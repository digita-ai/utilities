import { DGTErrorArgument, DGTErrorNotImplemented, DGTInjectable, DGTParameterCheckerService } from '@digita-ai/dgt-shared-utils';
import { forkJoin, Observable, of } from 'rxjs';
import { DGTLDTriple } from '../../linked-data/models/dgt-ld-triple.model';
import { DGTLDFilterType } from '../models/dgt-ld-filter-type.model';
import { DGTLDFilterRunnerService } from './dgt-ld-filter-runner.service';

import { map, switchMap } from 'rxjs/operators';
import { DGTExchangeService } from '../../exchanges/services/dgt-exchange.service';
import { DGTLDFilterConnection } from '../models/dgt-ld-filter-connection.model';
import { DGTLDResource } from '../models/dgt-ld-resource.model';

@DGTInjectable()
export class DGTLDFilterRunnerConnectionService implements DGTLDFilterRunnerService<DGTLDFilterConnection> {
  public readonly type: DGTLDFilterType = DGTLDFilterType.CONNECTION;

  constructor(private exchanges: DGTExchangeService, private paramChecker: DGTParameterCheckerService) { }

  run<R extends DGTLDResource>(filter: DGTLDFilterConnection, resources: R[]): Observable<R[]> {
    if (!filter) {
      throw new DGTErrorArgument('Argument filter should be set.', filter);
  }

  if (!resources) {
      throw new DGTErrorArgument('Argument triples should be set.', resources);
  }

  return of({filter, resources})
  .pipe(
      switchMap(data => forkJoin(resources.map(triple => this.runOne<R>(filter, triple).pipe(map(result => result ? triple : null))))),
      map(triples => triples.filter(triple => triple !== null)),
  )
}

private runOne<R extends DGTLDResource>(filter: DGTLDFilterConnection, resource: R): Observable<boolean> {
  this.paramChecker.checkParametersNotNull({ filter, resource });
  return this.exchanges.get(resource.exchange).pipe(
      map(exchange => exchange && exchange.connection ? filter.connections.find(connection => connection.uri === exchange.connection) : null),
      map(holder => holder !== null && holder !== undefined ? true : false),
  );
}
}
