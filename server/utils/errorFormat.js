// server/utils/withApiErrorFormat.ts
import { setResponseStatus } from 'h3';
import { apiResponse } from './response';
export async function withApiErrorFormat(fn, event) {
    try {
        return await fn();
    } catch (err) {
        console.log(err);
        setResponseStatus(event, err.statusCode || 500);
        return apiResponse({
            statusCode: err.statusCode || 500,
            notify: err.notify ?? false,
            success: false,
            message: err.message || 'Internal Server Error',
            ...err.extra, // 這裡可選，如果你想讓 throw 的 err 能帶額外欄位
        });
    }
}
