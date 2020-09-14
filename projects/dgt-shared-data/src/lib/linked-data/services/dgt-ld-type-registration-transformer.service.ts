import { Observable, of, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { DGTLoggerService, DGTParameterCheckerService } from '@digita/dgt-shared-utils';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { map } from 'rxjs/operators';
import { DGTLDTransformer } from '../models/dgt-ld-transformer.model';
import { DGTLDTypeRegistration } from '../models/dgt-ld-type-registration.model';
import { DGTLDResource } from '../models/dgt-ld-resource.model';
import { DGTConnectionSolid } from '../../connection/models/dgt-connection-solid.model';
import { DGTLDTermType } from '../models/dgt-ld-term-type.model';
import { DGTLDDataType } from '../models/dgt-ld-data-type.model';
import { DGTLDTriple } from '../models/dgt-ld-triple.model';

/** Transforms linked data to typeRegistrations, and the other way around. */
@Injectable()
export class DGTLDTypeRegistrationTransformerService implements DGTLDTransformer<DGTLDTypeRegistration> {

    constructor(
        private logger: DGTLoggerService,
        private paramChecker: DGTParameterCheckerService
    ) { }

    /**
     * Transforms multiple linked data entities to typeRegistrations.
     * @param resources Linked data objects to be transformed to typeRegistrations
     * @throws DGTErrorArgument when arguments are incorrect.
     * @returns Observable of typeRegistrations
     */
    public toDomain(resources: DGTLDResource[]): Observable<DGTLDTypeRegistration[]> {
        this.paramChecker.checkParametersNotNull({ entities: resources });

        return forkJoin(resources.map(entity => this.toDomainOne(entity)))
            .pipe(
                map(typeRegistrations => _.flatten(typeRegistrations)),
                map(typeRegistrations => typeRegistrations.filter(t => t !== null)),
            )
    }

    /**
     * Transformed a single linked data entity to typeRegistrations.
     * @param resource The linked data entity to be transformed to typeRegistrations.
     * @throws DGTErrorArgument when arguments are incorrect.
     * @returns Observable of typeRegistrations
     */
    private toDomainOne(resource: DGTLDResource): Observable<DGTLDTypeRegistration[]> {
        this.paramChecker.checkParametersNotNull({ entity: resource });

        let res: DGTLDTypeRegistration[] = null;

        if (resource && resource.triples) {
            const typeRegistrationSubjectValues = resource.triples.filter(value =>
                value.predicate.namespace === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' &&
                value.predicate.name === 'type' &&
                value.object.value === 'http://www.w3.org/ns/solid/terms#TypeRegistration'
            );

            this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Found typeRegistration subjects to transform', { typeRegistrationSubjectValues });

            if (typeRegistrationSubjectValues) {
                res = typeRegistrationSubjectValues.map(typeRegistrationSubjectValue => this.transformOne(typeRegistrationSubjectValue, resource));
            }
        }

        this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Transformed values to typeRegistrations', { entity: resource, res });

        return of(res);
    }

    /**
     * Converts typeRegistrations to linked data.
     * @param typeRegistrations The typeRegistrations which will be transformed to linked data.
     * @param connection The connection on which the typeRegistrations are stored.
     * @throws DGTErrorArgument when arguments are incorrect.
     * @returns Observable of linked data entities.
     */
    public toTriples(typeRegistrations: DGTLDTypeRegistration[], connection: DGTConnectionSolid): Observable<DGTLDResource[]> {
        this.paramChecker.checkParametersNotNull({ typeRegistrations, connection });
        this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Starting to transform to linked data', { typeRegistrations, connection });

        const entities = typeRegistrations.map<DGTLDResource>(typeRegistration => {
            let triples = typeRegistration.triples;
            const documentUri = typeRegistration.documentUri;
            const documentSubject = {
                value: '#',
                termType: DGTLDTermType.REFERENCE
            };
            const typeRegistrationId = v4();
            const typeRegistrationSubjectUri = `${documentUri}#${typeRegistrationId}`;
            const typeRegistrationSubject = {
                value: typeRegistrationSubjectUri,
                termType: DGTLDTermType.REFERENCE
            };

            if (!triples) {
                triples = [
                    {
                        exchange: null,
                        source: typeRegistration.source,
                        connection: typeRegistration.connection,
                        predicate: {
                            namespace: 'http://www.w3.org/ns/solid/terms#',
                            name: 'forClass'
                        },
                        subject: typeRegistrationSubject,
                        object: {
                            termType: DGTLDTermType.REFERENCE,
                            dataType: DGTLDDataType.STRING,
                            value: typeRegistration.forClass.namespace + typeRegistration.forClass.name
                        },
                        originalValue: {
                            termType: DGTLDTermType.REFERENCE,
                            dataType: DGTLDDataType.STRING,
                            value: typeRegistration.forClass.namespace + typeRegistration.forClass.name
                        },
                    },
                    {
                        exchange: null,
                        source: typeRegistration.source,
                        connection: typeRegistration.connection,
                        predicate: {
                            namespace: 'http://www.w3.org/ns/solid/terms#',
                            name: 'instance'
                        },
                        subject: typeRegistrationSubject,
                        object: {
                            termType: DGTLDTermType.REFERENCE,
                            dataType: DGTLDDataType.STRING,
                            value: typeRegistration.instance
                        },
                        originalValue: {
                            termType: DGTLDTermType.REFERENCE,
                            dataType: DGTLDDataType.STRING,
                            value: typeRegistration.instance
                        },
                    },

                    {
                        exchange: null,
                        source: typeRegistration.source,
                        connection: typeRegistration.connection,
                        predicate: {
                            namespace: 'http://www.w3.org/ns/solid/terms#',
                            name: 'TypeRegistration',
                        },
                        subject: documentSubject,
                        object: typeRegistrationSubject,
                        originalValue: typeRegistrationSubject,
                    }
                ];
            }

            const newEntity: DGTLDResource = {
                ...typeRegistration,
                documentUri,
                subject: {
                    value: typeRegistrationSubjectUri,
                    termType: DGTLDTermType.REFERENCE
                },
                triples
            };

            this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Transformed typeRegistration to linked data', { newEntity, typeRegistration });

            return newEntity;
        });

        this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Transformed typeRegistrations to linked data', { entities, typeRegistrations });

        return of(entities);
    }

    /**
     * Creates a single typeRegistration from linked data.
     * @param typeRegistrationSubjectValue The entity of the the typeRegistration's subject.
     * @param resource\ The entity to be transformed to an typeRegistration.
     * @throws DGTErrorArgument when arguments are incorrect.
     * @returns The transformed typeRegistration.
     */
    private transformOne(typeRegistrationSubjectValue: DGTLDTriple, resource: DGTLDResource): DGTLDTypeRegistration {
        this.paramChecker.checkParametersNotNull({ typeRegistrationSubjectValue, entity: resource });
        this.logger.debug(DGTLDTypeRegistrationTransformerService.name, 'Starting to transform one entity', { typeRegistrationSubjectValue, entity: resource });

        const documentUri = resource.documentUri ? resource.documentUri : typeRegistrationSubjectValue.subject.value;

        const forClass = resource.triples.find(value =>
            value.subject.value === typeRegistrationSubjectValue.subject.value &&
            value.predicate.namespace === 'http://www.w3.org/ns/solid/terms#' &&
            value.predicate.name === 'forClass'
        );

        const instance = resource.triples.find(value =>
            value.subject.value === typeRegistrationSubjectValue.subject.value &&
            value.predicate.namespace === 'http://www.w3.org/ns/solid/terms#' &&
            value.predicate.name === 'instance'
        );

        const typeRegistrationTriples = resource.triples.filter(value =>
            value.subject.value === typeRegistrationSubjectValue.subject.value
        );

        return {
            documentUri: documentUri,
            forClass: forClass ? {
                namespace: forClass.object.value.split('#')[0] + '#',
                name: forClass.object.value.split('#')[1]
            } : null,
            instance: instance ? instance.object.value : null,
            connection: typeRegistrationSubjectValue.connection,
            source: typeRegistrationSubjectValue.source,
            subject: {
                value: typeRegistrationSubjectValue.object.value,
                termType: DGTLDTermType.REFERENCE
            },
            triples: [...typeRegistrationTriples, typeRegistrationSubjectValue],
        };
    }
}
