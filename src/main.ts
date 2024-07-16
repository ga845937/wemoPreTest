import { httpPort } from "@env";
import { HttpExceptionFilter } from "@filter/httpException";
import { LoggerInterceptor } from "@interceptor/logger";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform";
import { MainModule } from "@modules/main";
import { NestFactory } from "@nestjs/core";
import { Validator } from "@pipe/validator";
// npm helmet for security

const main = async (): Promise<void> => {
    const app = await NestFactory.create(MainModule);

    app.getHttpAdapter().getInstance().disable("x-powered-by");
    app.useGlobalInterceptors(new LoggerInterceptor());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new Validator());
    await app.listen(httpPort);
};

main();
