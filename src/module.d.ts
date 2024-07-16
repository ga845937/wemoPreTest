// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";

declare module "express" {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    interface Request {
        traceID: string,
        service: string,
        clientIP: string,
        requestError: Error,
        debugInfo: unknown,
    }

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    interface Response {
        responseData: Record<string, unknown>,
    }
}
