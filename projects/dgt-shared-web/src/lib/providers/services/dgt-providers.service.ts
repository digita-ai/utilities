import { DGTSource, DGTSourceSolidConfiguration, DGTSourceType, DGTLDValue } from '@digita/dgt-shared-data';
import { DGTProvider } from '../models/dgt-provider.model';
import { Injectable } from '@angular/core';
import { DGTLoggerService, DGTHttpService } from '@digita/dgt-shared-utils';
import auth from 'solid-auth-client';
import { Observable, from } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { DGTProviderState } from '../models/dgt-provider-state.model';
import { DGTProviderSolid } from '../models/dgt-provider-solid.model';

@Injectable()
export class DGTProvidersService {
    constructor(private logger: DGTLoggerService, private http: DGTHttpService) {

    }

    public connect(provider: DGTProvider<any>, source: DGTSource<any>, callbackUri: string): Observable<DGTProvider<any>> {
        this.logger.debug(DGTProvidersService.name, 'Starting to connect to source', { source });

        let res: Observable<DGTProvider<any>> = null;

        if (source && source.type === DGTSourceType.SOLID) {
            res = this.connectToSolid(provider, source, callbackUri);
        }

        return res;
    }

    private connectToSolid(provider: DGTProviderSolid, source: DGTSource<DGTSourceSolidConfiguration>, callbackUri: string): Observable<DGTProviderSolid> {
        this.logger.debug(DGTProvidersService.name, 'Starting to connect to Solid', { provider, source, callbackUri });

        let res: Observable<DGTProvider<any>> = null;

        if (source) {
            res = from(auth.login(source.configuration.serverUri, {
                callbackUri
            }))
                .pipe(
                    map(data => ({ state: DGTProviderState.CONNECTING, ...provider }))
                );
        }

        return res;
    }
}
