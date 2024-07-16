import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { Request } from "express";
import type { Observable } from "rxjs";

import { Injectable } from "@nestjs/common";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, unknown> {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        return next.handle().pipe(
            map((data: unknown) => {
                const ctx = context.switchToHttp();
                const request = ctx.getRequest<Request>();

                return {
                    traceID: request.traceID,
                    data
                };
            }),
        );
    };
}
