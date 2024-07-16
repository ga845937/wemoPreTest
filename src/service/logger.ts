import type { Request, Response } from "express";
import type { TransformableInfo } from "logform";

import { logDirectory, nodeEnv } from "@env";
import { name as projectName } from "@packageJson";
import winston from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

interface ILogData {
    program: string,
    project: string,
    env: string,
    service: string,
    traceID: string,
    clientIP: string,
    requestMethod: string,
    requestURI: string,
    isoTime: string,
    time: string,
    // version: IVersion,
    debugInfo?: unknown,
}

interface IRequestLogData extends ILogData {
    requestHeader: Record<string, unknown>,
    requestQuery?: Record<string, unknown>,
    requestBody?: unknown,
}

interface IResponseLogData extends ILogData {
    httpStatus: number,
    responseHeader: Record<string, unknown>,
    responseData: Record<string, unknown>,
    error?: Record<string, unknown>,
}

const createBaseLogData = (req: Request): ILogData => {
    return {
        program: "nodejs",
        project: projectName,
        env: nodeEnv,
        service: req.service,
        traceID: req.traceID,
        clientIP: req.clientIP,
        requestMethod: req.method,
        requestURI: req.originalUrl,
        isoTime: new Date().toISOString(),
        time: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1),
        // version
    };
};

const errorToJson = (error: Error): Record<string, unknown> => {
    const stack = error.stack.split("\n").map((x: string) => x.trim());
    stack.shift();
    return {
        name: error.name,
        message: error.message,
        stack
    };
};

const logger = winston.createLogger({
    transports: [
        new DailyRotateFile({
            format: winston.format.printf((info: TransformableInfo) => JSON.stringify(info.message)),
            filename: logDirectory + `${projectName}-%DATE%.json`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxFiles: "3d",
        }),
    ],
});

export const requestLog = (request: Request): void => {
    request.traceID = "traceID";
    request.service = request.path.split("/")[1];
    request.clientIP = request.ip.replace("::ffff:", "");

    const reqLogData: IRequestLogData = {
        ...createBaseLogData(request),
        requestHeader: request.headers,
        requestQuery: request.query || {},
        requestBody: request.body || {}
    };

    logger.info(reqLogData);
};

export const responseLog = (request: Request, response: Response, responseData: Record<string, unknown>): void => {
    const resLogData: IResponseLogData = {
        ...createBaseLogData(request),
        httpStatus: response.statusCode,
        responseHeader: response.getHeaders(),
        responseData
    };

    if (request.requestError) {
        resLogData.error = errorToJson(request.requestError);
    }
    if (request.debugInfo) {
        resLogData.debugInfo = request.debugInfo instanceof Error ? errorToJson(request.debugInfo) : request.debugInfo;
    }

    logger.info(resLogData);
};
