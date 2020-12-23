import { DGTConnection, DGTConnectionGravatarConfiguration, DGTConnectionService, DGTConnector, DGTExchange, DGTLDResource, DGTLDTermType, DGTLDTransformer, DGTLDTriple, DGTPurpose, DGTSource, DGTSourceGravatarConfiguration, DGTSourceService, DGTUriFactoryService } from '@digita-ai/dgt-shared-data';
import { DGTErrorArgument, DGTErrorNotImplemented, DGTHttpResponse, DGTHttpService, DGTInjectable, DGTLoggerService } from '@digita-ai/dgt-shared-utils';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import { DGTSourceGravatarResponse } from '../models/dgt-source-gravatar-response.model';

@DGTInjectable()
export class DGTConnectorGravatar extends DGTConnector<DGTSourceGravatarConfiguration, DGTConnectionGravatarConfiguration> {
    constructor(private logger: DGTLoggerService, private http: DGTHttpService, private connections: DGTConnectionService, private sources: DGTSourceService) {
        super();
    }

    connect(purpose: DGTPurpose, exchange: DGTExchange, connection: DGTConnection<DGTConnectionGravatarConfiguration>, source: DGTSource<DGTSourceGravatarConfiguration>): Observable<DGTConnection<DGTConnectionGravatarConfiguration>> {
        return of(null);
    }

    public query<T extends DGTLDResource>(holderUri: string, exchange: DGTExchange, transformer: DGTLDTransformer<T>): Observable<T[]> {
        this.logger.debug(DGTConnectorGravatar.name, 'Starting query', { exchange, holderUri });

        if (!exchange) {
            throw new DGTErrorArgument('Argument exchange should be set.', exchange);
        }

        let res = null;

        res = of({ holderUri, exchange, transformer })
            .pipe(
                switchMap(data => this.connections.get(exchange.connection)
                    .pipe(map(connection => ({ ...data, connection, uri: `https://www.gravatar.com/${Md5.hashStr(connection.configuration.email)}.json` })))),
                switchMap(data => this.sources.get(exchange.source)
                    .pipe(map(source => ({ ...data, source })))),
                switchMap(data => this.http.get<DGTSourceGravatarResponse>(data.uri)
                    .pipe(map(response => ({ ...data, response })))),
                tap(data => this.logger.debug(DGTConnectorGravatar.name, 'Received response from Gravatar', { data })),
                map(data => this.convertResponse(data.holderUri, data.response, exchange, data.source, data.connection)),
                tap(data => this.logger.debug(DGTConnectorGravatar.name, 'Converted response from Gravatar', { data })),
                switchMap((entity: DGTLDResource) => transformer.toDomain([entity])),
            );

        return res;
    }

    private convertResponse(holderUri: string, httpResponse: DGTHttpResponse<DGTSourceGravatarResponse>, exchange: DGTExchange, source: DGTSource<DGTSourceGravatarConfiguration>, connection: DGTConnection<DGTConnectionGravatarConfiguration>): DGTLDResource {
        const triples: DGTLDTriple[] = [];

        this.logger.debug(DGTConnectorGravatar.name, 'Starting conversion of Gravatar response', { httpResponse, exchange, source, connection });

        if (exchange && source && httpResponse && httpResponse.success && httpResponse.data && httpResponse.data.entry && httpResponse.data.entry[0]) {
            const entry = httpResponse.data.entry[0];

            this.logger.debug(DGTConnectorGravatar.name, 'Found entry', { entry });

            if (entry.preferredUsername) {
                this.logger.debug(DGTConnectorGravatar.name, 'Found username', { entry });
                triples.push({
                    subject: {
                        value: exchange.holder,
                        termType: DGTLDTermType.REFERENCE,
                    },
                    predicate: source.configuration.usernameField,
                    object: {
                        value: entry.preferredUsername,
                        termType: DGTLDTermType.LITERAL,
                    },
                });
            }

            if (entry.thumbnailUrl) {
                this.logger.debug(DGTConnectorGravatar.name, 'Found thumbnail', { entry });
                triples.push({
                    subject: {
                        value: exchange.holder,
                        termType: DGTLDTermType.REFERENCE,
                    },
                    predicate: source.configuration.thumbnailField,
                    object: {
                        value: entry.thumbnailUrl,
                        termType: DGTLDTermType.LITERAL,
                    },
                });
            }
        }

        return {
            triples,
            uri: holderUri,
            exchange: exchange.uri,
        };
    }

    public update<R extends DGTLDResource>(domainEntities: { original: R, updated: R }[], transformer: DGTLDTransformer<R>): Observable<R[]> {
        throw new DGTErrorNotImplemented();
    }

    public delete<R extends DGTLDResource>(domainEntities: R[], transformer: DGTLDTransformer<R>): Observable<R[]> {
        throw new DGTErrorNotImplemented();
    }

    public add<R extends DGTLDResource>(domainEntities: R[], transformer: DGTLDTransformer<R>): Observable<R[]> {
        throw new DGTErrorNotImplemented();
    }
}
