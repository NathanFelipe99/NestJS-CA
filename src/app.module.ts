import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { UserModule } from './user/infra/user.module';
import { DatabaseModule } from './shared/infra/database/database.module';

@Module({
  imports: [EnvConfigModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
