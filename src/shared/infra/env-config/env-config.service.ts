import { Injectable } from '@nestjs/common';
import { IEnvConfig } from './interface/IEnvConfig';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvConfig {
    constructor(private configService: ConfigService) { }

    getAppPort(): number {
        return Number(this.configService.get<number>('PORT'));
    }
    getNodeEnvironment(): string {
        return this.configService.get<string>('NODE_ENV');
    }

}
