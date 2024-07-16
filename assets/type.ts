import { QTableProps } from 'quasar';

export interface LoadItemsParams {
    page?: number;
    rowsPerPage?: number;
    search: string;
    columns: QTableProps['columns'];
    filter: Record<string, null>;
    sortBy?: string | null;
}

export interface Pagination {
    sortBy?: string | null;
    descending?: boolean;
    page?: number;
    rowsPerPage?: number;
    rowsNumber?: number;
    items?: [];
}
