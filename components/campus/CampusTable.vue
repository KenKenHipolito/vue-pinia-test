<template>
    <q-table flat bordered :class="campusStore.pagination.rowsPerPage == 0 ? 'tw-h-screen' : 'tw-h-full'" ref="tableRef" :rows="campusStore.serverItems" :columns="campusStore.headers" row-key="id" v-model:pagination="campusStore.pagination" :loading="campusStore.loading" :filter="campusStore.search" binary-state-sort @request="campusStore.fetchItems" :dense="$q.screen.lt.lg" :virtual-scroll="true">
        <template v-slot:body-cell-campus_type="props">
            <q-td :props="props">
                {{ campusStore.getCampusTypeDescription(props.row.campus_type) }}
            </q-td>
        </template>

        <template v-slot:body-cell-id="props">
            <q-td :props="props">
                <q-btn-group push>
                    <Actions :item="props.row" @removed="campusStore.onFormDelete" @edit="campusStore.onFormUpdate" />
                </q-btn-group>
            </q-td>
        </template>
        <template v-slot:no-data="{ icon, message }">
            <div class="full-width row flex-center text-primary q-gutter-sm">
                <span>{{ message }}</span>
                <q-icon size="2em" :name="icon" />
            </div>
        </template>
    </q-table>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Actions from 'components/table_components/ActionButton.vue';
import { useCampusStore } from 'stores/campus';
const campusStore = useCampusStore();

const tableRef = ref();

onMounted(async () => {
    tableRef.value.requestServerInteraction();
});
</script>
