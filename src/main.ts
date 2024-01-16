import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { applyGlobalInterceptors} from "./global.config";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    await applyGlobalInterceptors(app);
    
    await app.listen(3000, '0.0.0.0');
}
bootstrap();
