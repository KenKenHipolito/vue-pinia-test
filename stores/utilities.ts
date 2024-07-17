import { defineStore } from 'pinia';
import { Notify, Dialog, QTableProps } from 'quasar';
import { web } from 'boot/axios';
import { useRequestStore } from 'stores/request_action';

export const useUtilitiesStore = defineStore('utilities', () => {
    const storeRequest = useRequestStore();

    const processOtherNotif = (code: string, message: string) => {
        if (code == 'Error') {
            Notify.create({ type: 'negative', message: message });
        } else if (code == 'Info') {
            Notify.create({ type: 'info', message: message });
        } else if (code == 'Warning') {
            Notify.create({ type: 'warning', message: message });
        } else if (code == 'request') {
            Notify.create({ type: 'warning', message: message });
        }
    };

    function createFormDataFromItem(item: Record<string, string | Blob | number | undefined>): FormData {
        const formData = new FormData();
        // Iterate over object entries and append each to formData
        for (const [key, value] of Object.entries(item)) {
            // Check if the value is a Blob (e.g., file) or a string and append accordingly
            if (typeof value === 'string' || value instanceof Blob) {
                formData.append(key, value);
            } else if (value !== undefined) {
                // Ensure undefined values are not appended
                formData.append(key, String(value));
            }
        }
        return formData;
    }

    async function tableInitiator(props: { pagination: QTableProps['pagination'] }, totalItems: number, search: string, headers: QTableProps['columns'], filter: Record<string, null>, endpoint: string) {
        const { page, sortBy, descending } = props.pagination ?? {};
        let { rowsPerPage } = props.pagination ?? {};

        const sortOn = descending ? 'desc' : 'asc';
        if (rowsPerPage == 0) {
            rowsPerPage = totalItems;
        }

        const [success, response] = await storeRequest.fetcherRequest(endpoint, {
            page: page,
            items: rowsPerPage,
            search: search,
            columns: headers,
            filter: filter,
            sortBy: sortBy,
            sortOn: sortOn,
        });
        return [success, response, rowsPerPage];
    }

    const ExportDataReport = async (data: Record<string, string | number | undefined>[], headers: QTableProps['columns'], toolbarTitle: string) => {
        let typeReport = '';

        Dialog.create({
            title: 'Export',
            message: 'Please Select A Type Of Report',
            ok: {
                push: true,
                color: 'positive',
                label: 'Excel',
            },
            cancel: {
                push: true,
                color: 'negative',
                label: 'PDF',
            },
            persistent: false,
        })
            .onOk(() => {
                typeReport = 'excel';
            })
            .onCancel(() => {
                typeReport = 'pdf';
            })
            .onDismiss(() => {
                if (typeReport != '') {
                    web.post('generateReport', { items: data, header: headers, title: toolbarTitle, type: typeReport })
                        .then((response: { data: string }) => {
                            window.open(response.data, '_blank')?.focus();
                        })
                        .catch((error) => {
                            Notify.create({ type: 'negative', message: error.response.data.message });
                        });
                }
            });
    };
    return { processOtherNotif, createFormDataFromItem, tableInitiator, ExportDataReport };
});
