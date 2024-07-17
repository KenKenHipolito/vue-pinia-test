<template>
    <q-slide-transition>
        <div v-show="campusStore.isEdit">
            <q-form ref="formEl">
                <div class="q-pa-md q-gutter-y-sm">
                    <q-separator size="4" class="tw-my-2" color="info"></q-separator>
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <q-input counter maxlength="8" v-model="campusStore.form.code" :rules="requireRules" label="Code"></q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-input counter maxlength="50" v-model="campusStore.form.description" :rules="requireRules" label="Description"></q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-input counter maxlength="50" v-model="campusStore.form.campus_name" :rules="requireRules" label="Campus Name"></q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-select v-model="campusStore.form.campus_type" label="Campus Type" :options="campusStore.campusType" use-input hide-selected fill-input emit-value map-options option-label="label">
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">No results</q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <div class="col-12">
                            <q-input counter maxlength="100" v-model="campusStore.form.address" :rules="requireRules" label="Address"></q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-input counter maxlength="100" v-model="campusStore.form.no_reply_email" :rules="requireRules" label="Email"></q-input>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-input counter maxlength="100" v-model="campusStore.form.registrar_no_reply_email" :rules="requireRules" label="Registrar Email"></q-input>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-3">
                            <div class="tw-flex q-gutter-sm float-left lt-md:tw-w-full">
                                <div class="tw-flex-auto">
                                    <q-btn push size="medium" v-if="campusStore.saveBtnLabel == 'Save'" :loading="campusStore.loadingSubmit" color="positive" class="tw-mt-2 lt-md:tw-w-full" @click="submitForm(false)" icon="save" :label="campusStore.saveBtnLabel"></q-btn>

                                    <q-btn push size="medium" v-else :loading="campusStore.loadingSubmit" color="positive" class="tw-mt-2 lt-md:tw-w-full" @click="submitForm(true)" icon="save" :label="campusStore.saveBtnLabel"></q-btn>
                                </div>
                                <div class="tw-flex-auto">
                                    <q-btn push color="grey-4" class="tw-mt-2 text-black lt-md:tw-w-full" size="medium" @click="campusStore.abortForm()" icon="cancel" label="Cancel"></q-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-form>
        </div>
    </q-slide-transition>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCampusStore } from 'stores/campus';
import { Notify } from 'quasar';
const campusStore = useCampusStore();

import { requireRules } from 'assets/validationRules/rules';

const formEl = ref();
watch(
    () => campusStore.formEl,
    (n) => {
        if (n == 'reset') {
            formEl.value.resetValidation();
            formEl.value.reset();
            campusStore.formEl = 'init';
        }
    }
);

function submitForm(isUpdate: boolean) {
    formEl.value.validate().then((success: boolean) => {
        if (success) {
            campusStore.handleFormSubmit(isUpdate);
        } else {
            Notify.create({ type: 'negative', message: 'Please check all input in the form if valid' });
        }
    });
}
</script>
