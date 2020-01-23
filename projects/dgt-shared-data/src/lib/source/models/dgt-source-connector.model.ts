import { DGTLDResponse } from '../../linked-data/models/dgt-ld-response.model';
import { DGTSource } from './dgt-source.model';
import { DGTJustification } from '../../justification/models/dgt-justification.model';
import { DGTExchange } from '../../subject/models/dgt-subject-exchange.model';
import { Observable } from 'rxjs';

export interface DGTSourceConnector {
    query(
        exchange: DGTExchange,
        justification: DGTJustification,
    ): Observable<DGTLDResponse>;
}
