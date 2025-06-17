import { useHttp } from '../config.js';

export const apiGetTags = (data) => {
    return useHttp.get(`/api/tags`);
};
