import { BusinessUnit } from '.';

export interface LegalEntity {
    id: number;
    name: string;
    domainName?: string;
    color: string;
    businessUnits: BusinessUnit[];
    identifier?: string;
}
