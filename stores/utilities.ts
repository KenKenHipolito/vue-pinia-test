import { defineStore } from 'pinia';
import { Notify, Dialog } from 'quasar';
import { web } from 'boot/axios';

export const useUtilitiesStore = defineStore('utilities', () => {
    const ProcessOtherNotif = (code: string, message: string) => {
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

    const ExportDataReport = async (data: unknown, headers: string[], toolbarTitle: string) => {
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
    return { ProcessOtherNotif, createFormDataFromItem, ExportDataReport };
});
