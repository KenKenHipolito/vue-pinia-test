<template>
    <div class="q-pa-md q-gutter-y-sm">
        <div class="bg-secondary text-white">
            <q-toolbar>
                <q-toolbar-title>Campus</q-toolbar-title>
            </q-toolbar>
            <q-separator color="white" />
            <q-toolbar :inset="$q.screen.lt.md ? false : true">
                <q-breadcrumbs active-color="white" style="font-size: 16px">
                    <q-breadcrumbs-el label="Processs" icon="published_with_changes" />
                    <q-breadcrumbs-el label="Campus" />
                </q-breadcrumbs>
            </q-toolbar>
            <q-separator color="white" class="tw-mb-2" />
            <q-toolbar class="tw-pb-2">
                <q-input class="tw-w-1/2" color="grey-9" bg-color="grey-4" outlined v-model="campusStore.search" label="Search..." :clearable="false">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-space />

                <q-btn :size="$q.screen.lt.md ? 'large' : ''" icon="groups_3" color="positive" class="text-white tw-shadow-xl" @click="campusStore.createForm">
                    <span class="gt-md">&nbsp;&nbsp;Add Campus</span>
                    <q-tooltip anchor="top middle" self="top middle">
                        <strong>Add Campus</strong>
                    </q-tooltip>
                </q-btn>
                <q-btn :size="$q.screen.lt.md ? 'large' : ''" icon="file_download" color="white" class="text-black tw-shadow-xl tw-ms-2" @click="campusStore.exportData()">
                    <span class="gt-md">&nbsp;&nbsp;Export</span>
                    <q-tooltip anchor="top middle" self="top middle">
                        <strong>Export</strong>
                    </q-tooltip>
                </q-btn>
            </q-toolbar>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCampusStore } from 'stores/campus';
const campusStore = useCampusStore();
</script>
