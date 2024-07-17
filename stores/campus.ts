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

interface responseType {
    code: number;
    data: Item;
    msg: string;
    status: string;
}

interface campusType {
    label: string;
    value: string;
}

export const useCampusStore = defineStore('campus', () => {
    const storeRequest = useRequestStore();
    const utilitiesStore = useUtilitiesStore();

    const ENDPOINT = 'campus';
    const TITLE = 'Campus';

    const serverItems = ref<Item[]>([]);

    const pagination = ref<Pagination>({
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 10,
    });

    const headers = ref<QTableProps['columns']>([
        { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
        { name: 'description', label: 'Description', field: 'description', align: 'left', sortable: true },
        { name: 'campus_name', label: 'Campus Name', field: 'campus_name', align: 'left', sortable: true },
        { name: 'address', label: 'Address', field: 'address', align: 'left', sortable: true },
        { name: 'campus_type', label: 'Campus Type', field: 'campus_type', align: 'left', sortable: true },
        { name: 'no_reply_email', label: 'No Reply Email', field: 'no_reply_email', align: 'left', sortable: true },
        { name: 'registrar_no_reply_email', label: 'Registrar No Reply Email', field: 'registrar_no_reply_email', align: 'left', sortable: true },
        { name: 'action', label: 'Actions', field: 'id', align: 'left' },
    ]);

    const form = ref<Item>(createInitialItemState());

    const totalItems = ref(0);
    const search = ref('');

    const loading = ref(false);
    const loadingSubmit = ref(false);
    const isEdit = ref(false);
    const formEl = ref();

    const saveBtnLabel = computed(() => (isEdit.value ? 'Update' : 'Save'));

    const campusType = ref<campusType[]>([
        { label: 'Company-Owned', value: 'CO' },
        { label: 'Franchise', value: 'F' },
    ]);

    /**
     * Creates the initial state for an item.
     *
     * @return {Item} The initial state object for an item with default values.
     */
    function createInitialItemState(): Item {
        return { code: '', description: '', campus_name: '', address: '', campus_type: '', no_reply_email: '', registrar_no_reply_email: '', id: 0 };
    }

    /**
     * Creates a new form for editing.
     *
     * @return {void}
     */
    function createForm() {
        isEdit.value = true;
        form.value = createInitialItemState();
        formEl.value = 'reset';
    }

    /**
     * Sets isEdit to false, resets the form to initial state, and sets formEl value to 'reset'.
     *
     * @return {void}
     */
    function abortForm() {
        isEdit.value = false;
        form.value = createInitialItemState();
        formEl.value = 'reset';
    }

    /**
     * Updates the form with the data from the given item and sets the isEdit flag to true.
     *
     * @param {Object} item - An object containing the data to update the form with.
     * @param {Item} item.data - The data to update the form with.
     * @return {void} This function does not return anything.
     */
    function modifyForm(item: { data: Item }) {
        isEdit.value = true;
        form.value = Object.assign({}, item.data);
    }

    /**
     * Deletes an item from the server and updates the local data accordingly.
     *
     * @param {Object} item - The item to be deleted.
     * @param {number} item.id - The ID of the item.
     * @param {Item} item.data - The data of the item.
     * @return {Promise<void>} A promise that resolves when the deletion is complete.
     */
    async function onFormDelete(item: { id: number; data: Item }) {
        Dialog.create({
            title: 'Confirm',
            message: 'Would you like to delete this data?',
            cancel: true,
            persistent: true,
        })
            .onOk(async () => {
                const [success, response] = await storeRequest.deleteRequest(ENDPOINT, item.id);
                if (success == 'Success') {
                    Notify.create({ type: 'positive', message: response.msg });
                    const index: number = serverItems.value.findIndex((serverItem) => serverItem.id === item.data.id);
                    serverItems.value.splice(index, 1);
                } else {
                    utilitiesStore.processOtherNotif(success, response.msg);
                    loadingSubmit.value = false;
                }
            })
            .onCancel(() => {
                Notify.create({ type: 'info', message: 'Data is safe' });
            });
    }

    /**
     * Handles form submission based on the update status.
     *
     * @param {boolean} isUpdate - Indicates whether the form is being updated.
     * @return {void} This function does not return anything.
     */
    async function handleFormSubmit(isUpdate: boolean) {
        loadingSubmit.value = true;

        let success: string;
        let response: responseType;

        const formData = utilitiesStore.createFormDataFromItem(form.value);

        if (isUpdate) {
            // Spoof
            formData.append('_method', 'put');

            [success, response] = await storeRequest.postRequest(ENDPOINT, formData, form.value.id);
        } else {
            [success, response] = await storeRequest.postRequest(ENDPOINT, formData);
        }

        if (success == 'Success') {
            Notify.create({ type: 'positive', message: response.msg });

            if (isUpdate) {
                const index: number = serverItems.value.findIndex((serverItem) => form.value.id === serverItem.id);
                serverItems.value.splice(index, 1, response.data);
            } else {
                serverItems.value.push(response.data);
            }
            abortForm();
        } else {
            utilitiesStore.processOtherNotif(success, response.msg);
        }

        loadingSubmit.value = false;
    }

    /**
     * Fetches items from the server based on the provided pagination options.
     *
     * @param {Object} props - The pagination options.
     * @param {QTableProps['pagination']} props.pagination - The pagination options.
     * @return {Promise<void>} A promise that resolves when the items are fetched.
     */
    async function fetchItems(props: { pagination: QTableProps['pagination'] }) {
        loading.value = true;

        const [success, response, rowsPerPage] = await utilitiesStore.tableInitiator(props, totalItems.value, search.value, headers.value, {}, ENDPOINT);

        pagination.value.page = props.pagination?.page;
        pagination.value.sortBy = props.pagination?.sortBy;
        pagination.value.descending = props.pagination?.descending;
        pagination.value.rowsPerPage = rowsPerPage;

        if (success == 'Error') {
            Notify.create({ type: 'negative', message: response.data.msg });
        } else {
            serverItems.value = response.data;
            pagination.value.rowsNumber = response.total;
            totalItems.value = response.total;
        }
        loading.value = false;
    }

    function getcampusTypeDescription(id: string) {
        const result = campusType.value.find((item: campusType) => item.value == id);
        return result ? result.label : '';
    }

    function exportData() {
        utilitiesStore.ExportDataReport(serverItems.value, headers.value, TITLE);
    }

    return { createForm, abortForm, modifyForm, onFormDelete, handleFormSubmit, fetchItems, getcampusTypeDescription, exportData, search, form, saveBtnLabel, loadingSubmit, isEdit, campusType, formEl, pagination, loading, serverItems, headers };
});
