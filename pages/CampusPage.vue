<template>
    <div class="tw-my-7 tw-mx-5">
        <q-card class="bg-grey-2 tw-w-full">
            <TableHeader />
            <Form />
            <Table />
        </q-card>
    </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const TableHeader = defineAsyncComponent(() => import('components/campus/CampusHeader.vue'));
const Form = defineAsyncComponent(() => import('components/campus/CampusForm.vue'));
const Table = defineAsyncComponent(() => import('components/campus/CampusTable.vue'));
</script>
