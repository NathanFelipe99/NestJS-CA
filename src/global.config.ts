import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DataWrapperInterceptor } from "./shared/infra/interceptors/data-wrapper/data.wrapper.interceptor";
import { ConflictErrorFilter } from "./shared/infra/filters/conflictError/conflictError.filter";

export async function applyGlobalInterceptors(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 422,
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        })
    );
    app.useGlobalInterceptors(
        new DataWrapperInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector))
    );

    app.useGlobalFilters(
        new ConflictErrorFilter()
    );
}