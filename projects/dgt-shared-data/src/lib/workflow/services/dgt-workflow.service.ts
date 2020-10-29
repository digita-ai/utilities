import { DGTWorkflow } from '../models/dgt-workflow.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { DGTInjectable, DGTLoggerService, DGTParameterCheckerService } from '@digita-ai/dgt-shared-utils';
import { DGTExchange } from '../../exchanges/models/dgt-exchange.model';
import { DGTLDFilterService } from '../../linked-data/services/dgt-ld-filter.service';
import { DGTConnectorService } from '../../connector/services/dgt-connector.service';
import { DGTLDResource } from '../../linked-data/models/dgt-ld-resource.model';

@DGTInjectable()
export class DGTWorkflowService {

  private workflows: DGTWorkflow[] = [];

  constructor(
    private logger: DGTLoggerService,
    private filters: DGTLDFilterService,
    private connectors: DGTConnectorService,
    private paramChecker: DGTParameterCheckerService,
  ) { }

  public execute<T extends DGTLDResource>(exchange: DGTExchange, resources: T[]): Observable<T[]> {
    this.logger.debug(DGTWorkflowService.name, 'Executing workflow', { exchange, resources });

    this.paramChecker.checkParametersNotNull({ exchange, resources });

    return of({ exchange, resources, workflows: this.workflows.filter(workflow => workflow.source === exchange.source) })
      .pipe(
        switchMap(data => (data.workflows.length === 0 ? of([data.resources]) : forkJoin(data.workflows.map(workflow => this.executeForWorkflow(workflow, data.exchange, data.resources))))
          .pipe(map(updatedTriples => ({ ...data, updatedTriples: _.flatten(updatedTriples) })))),
        map(data => data.resources),
      );
  }

  private executeForWorkflow(workflow: DGTWorkflow, exchange: DGTExchange, resources: DGTLDResource[]): Observable<DGTLDResource[]> {
    this.logger.debug(DGTWorkflowService.name, 'Executing a single workflow', { workflow, exchange, resources });

    this.paramChecker.checkParametersNotNull({ workflow, resources });

    return of({ workflow, resources, exchange })
      .pipe(
        switchMap(data => this.filters.run(workflow.filter, data.resources)
          .pipe(map(triples => ({ ...data, triples })))),
        switchMap(data => forkJoin(workflow.actions.map(action => action.execute(data.triples)))
          .pipe(map(updatedTriples => ({ ...data, updatedTriples: _.flatten(updatedTriples) })))),
        switchMap(data =>
          data.workflow.destination ?
            this.connectors.save(data.exchange, data.updatedTriples, data.workflow.destination).pipe(
              map(newTriple => ({ ...data, newTriple }))
            ) : of(data)
        ),
        map(data => data.triples),
      );
  }

  public register(workflow: DGTWorkflow) {
    this.logger.debug(DGTWorkflowService.name, 'Registring workflow', { workflow });

    this.paramChecker.checkParametersNotNull({ workflow });

    if (!this.workflows) {
      this.workflows = [];
    }

    this.workflows.push(workflow);
  }

}
