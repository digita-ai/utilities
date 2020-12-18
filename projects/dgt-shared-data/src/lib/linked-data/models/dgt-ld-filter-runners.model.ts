import { Type } from '@angular/core';
import { DGTLDFilterRunnerService } from '../services/dgt-ld-filter-runner.service';
import { DGTLDFilter } from './dgt-ld-filter.model';

export interface DGTLDFilterRunners {
    runners: Type<DGTLDFilterRunnerService<DGTLDFilter>>[];
}
