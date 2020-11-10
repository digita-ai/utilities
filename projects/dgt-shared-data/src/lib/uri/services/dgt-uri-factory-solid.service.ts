import { DGTLDResource, DGTLDTriple } from '@digita-ai/dgt-shared-data/public-api';
import { Observable, of } from 'rxjs';
import { DGTUriFactoryService } from './dgt-uri-factory.service';

/**
 * Service that generates URIs for resources from a solid pod
 * e.g. https://sanderclaes.inrupt.net/foo/bar
 * Pass resourceType to constructor ('holder', 'connection', 'exchange', ...)
 */
export class DGTUriFactorySolidService implements DGTUriFactoryService {

    /**
     * Generates a URI for a resource
     * @param resource The DGTLDResource to generate a uri for
     */
    public generate(resource: DGTLDResource): Observable<string> {
        // not sure if this is correct in all cases
        return of(resource.triples[0].subject.value);
    }

}
