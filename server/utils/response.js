// /server/utils/response.ts

export function apiResponse({ statusCode = 200, notify = false, success = true, ...rest } = {}) {
    return {
        statusCode,
        notify,
        success,
        ...rest,
    };
}
