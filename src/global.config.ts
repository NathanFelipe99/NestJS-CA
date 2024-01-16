import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DataWrapperInterceptor } from "./shared/infra/interceptors/data-wrapper/data.wrapper.interceptor";

export async function applyGlobalInterceptors(app: INestApplication) {
    app.useGlobalInterceptors(
        new DataWrapperInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector))
    );
}