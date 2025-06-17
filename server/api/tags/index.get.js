import { withApiErrorFormat } from '~/server/utils/errorFormat';
import { apiResponse } from '~/server/utils/response';

export default defineEventHandler(async (event) => {
    return withApiErrorFormat(async () => {
        return apiResponse({
            data: [],
            message: '查詢成功',
            notify: false,
        });
    }, event);
});
