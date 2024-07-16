import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request, Response } from "express";
import type { Observable } from "rxjs";

import { Injectable } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { requestLog, responseLog } from "service/logger";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        requestLog(request);

        return next
            .handle()
            .pipe(
                tap((responseData: Record<string, unknown>) => {
                    const response = ctx.getResponse<Response>();
                    responseLog(request, response, responseData);
                }),
            );
    };
}
