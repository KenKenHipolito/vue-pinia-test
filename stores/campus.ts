import { defineStore } from 'pinia';
import { useRequestStore } from 'stores/request_action';
import { useUtilitiesStore } from 'stores/utilities';
import { Notify, Dialog, QTableProps } from 'quasar';
import { Pagination } from 'assets/type';

import { ref, computed } from 'vue';

interface Item {
    id?: number;
    code: string;
    description: string;
    campus_name: string;
    address: string;
    campus_type: string;
    no_reply_email: string;
    registrar_no_reply_email: string;
}

interface CampusType {
    label: string;
    value: string;
}

export const useCampusStore = defineStore('campus', () => {
    const storeRequest = useRequestStore();
    const utilitiesStore = useUtilitiesStore();

    const serverItems = ref<Item[]>([]);

    const pagination = ref<Pagination>({
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10,
    });

    const headers = ref<QTableProps['columns']>([
        { name: 'code', label: 'Code', field: 'code', align: 'left' },
        { name: 'description', label: 'Description', field: 'description', align: 'left' },
        { name: 'campus_name', label: 'Campus Name', field: 'campus_name', align: 'left' },
        { name: 'address', label: 'Address', field: 'address', align: 'left' },
        { name: 'campus_type', label: 'Campus Type', field: 'campus_type', align: 'left' },
        { name: 'no_reply_email', label: 'No Reply Email', field: 'no_reply_email', align: 'left' },
        { name: 'registrar_no_reply_email', label: 'Registrar No Reply Email', field: 'registrar_no_reply_email', align: 'left' },
    ]);

    const form = ref<Item>(createInitialItemState());

    const totalItems = ref(0);
    const search = ref('');

    const loading = ref(false);
    const loadingSubmit = ref(false);
    const isEdit = ref(false);
    const formEl = ref();

    const saveBtnLabel = computed(() => (isEdit.value ? 'Update' : 'Save'));

    const campusType = ref<CampusType[]>([
        { label: 'Company-Owned', value: 'CO' },
        { label: 'Franchise', value: 'F' },
    ]);

    function createInitialItemState(): Item {
        return { code: '', description: '', campus_name: '', address: '', campus_type: '', no_reply_email: '', registrar_no_reply_email: '', id: 0 };
    }

    function createForm() {
        isEdit.value = true;
        form.value = createInitialItemState();
        formEl.value = 'reset';
    }

    function abortForm() {
        isEdit.value = false;
        form.value = createInitialItemState();
        formEl.value = 'reset';
    }

    function modifyForm(item: { data: Item }) {
        isEdit.value = true;
        form.value = Object.assign({}, item.data);
    }

    async function onFormDelete(item: { id: number; data: Item }) {
        Dialog.create({
            title: 'Confirm',
            message: 'Would you like to delete this data?',
            cancel: true,
            persistent: true,
        })
            .onOk(async () => {
                const [success, response] = await storeRequest.deleteRequest('campus', item.id);
                if (success == 'Success') {
                    Notify.create({ type: 'positive', message: response.msg });
                    const index: number = serverItems.value.findIndex((serverItem) => serverItem.id === item.data.id);
                    serverItems.value.splice(index, 1);
                } else {
                    utilitiesStore.ProcessOtherNotif(success, response.msg);
                    loadingSubmit.value = false;
                }
            })
            .onCancel(() => {
                Notify.create({ type: 'info', message: 'Data is safe' });
            });
    }

    async function onFormUpdate() {
        loadingSubmit.value = true;

        const formData = utilitiesStore.createFormDataFromItem(form.value);

        const [success, response] = await storeRequest.putRequest('campus', form.value.id, formData);

        if (success == 'Success') {
            Notify.create({ type: 'positive', message: response.msg });
            const index: number = serverItems.value.findIndex((serverItem) => form.value.id === serverItem.id);
            serverItems.value.splice(index, 1, response.data);
            abortForm();
        } else {
            utilitiesStore.ProcessOtherNotif(success, response.msg);
            loadingSubmit.value = false;
        }
    }

    async function onFormInsert() {
        loadingSubmit.value = true;

        const formData = utilitiesStore.createFormDataFromItem(form.value);

        const [success, response] = await storeRequest.postRequest('campus', formData);

        if (success == 'Success') {
            Notify.create({ type: 'positive', message: response.msg });
            serverItems.value.push(response.data);
            abortForm();
        } else {
            utilitiesStore.ProcessOtherNotif(success, response.msg);
            loadingSubmit.value = false;
        }
    }

    async function fetchItems(props: { pagination: QTableProps['pagination'] }) {
        const { page, sortBy, descending } = props.pagination ?? {};
        let { rowsPerPage } = props.pagination ?? {};
        pagination.value.page = page;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;
        loading.value = true;
        if (rowsPerPage == 0) {
            pagination.value.rowsPerPage = 0;
            rowsPerPage = totalItems.value;
        } else {
            pagination.value.rowsPerPage = rowsPerPage;
        }

        const [success, response] = await storeRequest.fetcherRequest('campus', {
            page: page,
            items: rowsPerPage,
            search: search.value,
            columns: headers.value,
            filter: {},
            sortBy: sortBy,
        });

        if (success == 'Error') {
            Notify.create({ type: 'negative', message: response.data.msg });
        } else {
            serverItems.value = response.data;
            pagination.value.rowsNumber = response.total;
            totalItems.value = response.total;
        }
        loading.value = false;
    }

    function getCampusTypeDescription(id: string) {
        const result = campusType.value.find((item: CampusType) => item.value == id);
        return result ? result.label : '';
    }

    function exportData() {
        utilitiesStore.ExportDataReport(serverItems.value, headers.value, 'Campus');
    }

    return { createForm, abortForm, modifyForm, onFormDelete, onFormUpdate, onFormInsert, fetchItems, getCampusTypeDescription, exportData, search, form, saveBtnLabel, loadingSubmit, isEdit, campusType, formEl, pagination, loading, serverItems, headers };
});
