import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

const configFactory = {
  provide: 'ConfigService',
  useFactory: () => {
    const config = new ConfigService();
    return config;
  },
};

@Module({
  providers: [configFactory],
  exports: [configFactory],
})
export class ConfigModule {}
