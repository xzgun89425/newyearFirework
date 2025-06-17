// import { useApiHandler } from '~/composables/Func/useApiHandler.js';

const fetch = (url, options) => {
    const nuxtApp = useNuxtApp();
    const authStore = useAuthStore();
    return $fetch(url, {
        onRequest({ options }) {
            // if (Cookies.get('authToken')) {
            //     options.headers = {
            //         ...options.headers,
            //         Authorization: `Bearer ${Cookies.get('authToken')}`,
            //     };
            // } else if (authStore.authToken) {
            //     options.headers = {
            //         ...options.headers,
            //         Authorization: `Bearer ${authStore.authToken}`,
            //     };
            // }

            // options.headers = {
            //     ...options.headers,
            //     'Accept-Language': nuxtApp.$i18n.locale.value,
            // };
            options.query = options.query || {};
            // console.log(options.headers, 'header');
        },
        // 错误处理
        onResponseError({ response }) {
            // useApiHandler(response);
            return Promise.reject({
                ...response?._data,
                success: false,
            });
        },
        // 响应拦截
        onResponse({ response }) {
            if (response.ok) {
                // useApiHandler(response);
                return response._data;
            }
        },

        ...options,
    });
};

export const useHttp = {
    get: async (url, params, option) => {
        return await fetch(url, { method: 'get', params, ...option })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    post: async (url, body, option) => {
        return await fetch(url, { method: 'post', body, ...option })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    patch: async (url, body, option) => {
        return await fetch(url, { method: 'patch', body, ...option })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    put: async (url, body, option) => {
        return await fetch(url, { method: 'put', body, ...option })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    delete: async (url, body, option) => {
        return await fetch(url, { method: 'delete', body, ...option })
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
};
