import { DGTErrorArgument, DGTInjectable, DGTLoggerService } from '@digita-ai/dgt-shared-utils';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DGTCacheService } from '../../cache/services/dgt-cache.service';
import { DGTLDFilter } from '../../linked-data/models/dgt-ld-filter.model';
import { DGTUriFactoryService } from '../../uri/services/dgt-uri-factory.service';
import { DGTCategory } from '../models/dgt-category.model';
import { DGTCategoryTransformerService } from './dgt-category-transformer.service';
import { DGTCategoryService } from './dgt-category.service';

@DGTInjectable()
export class DGTCategoryCacheService extends DGTCategoryService {
    constructor(
        private logger: DGTLoggerService,
        private cache: DGTCacheService,
        private transformer: DGTCategoryTransformerService,
        private uri: DGTUriFactoryService,
    ) {
        super();
    }

    public get(uri: string): Observable<DGTCategory> {
        this.logger.debug(DGTCategoryCacheService.name, 'Starting to get categories', { uri });

        if (!uri) {
            throw new DGTErrorArgument('Argument uri should be set.', uri);
        }

        return this.cache.get<DGTCategory>(this.transformer, uri);
    }

    public query<T extends DGTCategory>(filter?: DGTLDFilter): Observable<T[]> {
        this.logger.debug(DGTCategoryCacheService.name, 'Starting to query categories', filter);

        return this.cache.query<T>(this.transformer, filter);
    }

    public save<T extends DGTCategory>(resources: T[]): Observable<T[]> {
        this.logger.debug(DGTCategoryCacheService.name, 'Starting to save resource', { resource: resources });

        if (!resources) {
            throw new DGTErrorArgument('Argument category should be set.', resources);
        }

        return of({
            resources,
        }).pipe(
            switchMap((data) =>
                this.uri
                    .generate(data.resources, 'category')
                    .pipe(map((updatedResources) => ({ ...data, resources: updatedResources as T[] }))),
            ),
            switchMap((data) =>
                this.cache.save<T>(this.transformer, data.resources).pipe(map((savedResources) => savedResources)),
            ),
        );
    }

    public delete(resource: DGTCategory): Observable<DGTCategory> {
        this.logger.debug(DGTCategoryCacheService.name, 'Starting to delete category', { resource });

        if (!resource) {
            throw new DGTErrorArgument('Argument resource should be set.', resource);
        }

        return of({ resource }).pipe(
            switchMap((data) =>
                this.cache.delete(this.transformer, [data.resource]).pipe(map((resources) => ({ ...data, resources }))),
            ),
            map((data) => _.head(data.resources)),
        );
    }
}
