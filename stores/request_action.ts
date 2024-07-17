import { web } from 'boot/axios';
import { defineStore } from 'pinia';

export const useRequestStore = defineStore('request_action', () => {
    const fetcherRequest = async (url: string, params: unknown) => {
        return web
            .get(url, { params })
            .then((response) => {
                return [response.data.status, response.data];
            })
            .catch((error) => {
                return ['Error', { msg: error.response.data.message }];
            });
    };

    const deleteRequest = async (url: string, id: number) => {
        return web
            .delete(url + '/' + id)
            .then((response) => {
                return [response.data.status, response.data];
            })
            .catch((error) => {
                return ['Error', { msg: error.response.data.message }];
            });
    };

    const postRequest = async (url: string, data: unknown, id?: number | undefined | null) => {
        return web
            .post(id ? url + '/' + id : url, data)
            .then((response) => {
                return [response.data.status, response.data];
            })
            .catch((error) => {
                return ['Error', { msg: error.response.data.message }];
            });
    };

    const putRequest = async (url: string, id: number | undefined, data: unknown) => {
        return web
            .put(url + '/' + id, data)
            .then((response) => {
                return [response.data.status, response.data];
            })
            .catch((error) => {
                return ['Error', { msg: error.response.data.message }];
            });
    };

    return { fetcherRequest, deleteRequest, postRequest, putRequest };
});
