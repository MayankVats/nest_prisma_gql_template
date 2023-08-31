import { Injectable } from '@nestjs/common';

interface AwsConfig {
  AWS_DEFAULT_REGION: string;
  AWS_S3_BUCKET_REGION: string;
  AWS_S3_BUCKET_NAME: string;
}

export interface Config extends AwsConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
}

@Injectable()
export class ConfigService {
  private config: Config;

  constructor() {
    this.loadFromEnv();
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): Config {
    return {
      NODE_ENV: env.NODE_ENV || 'dev',
      PORT: parseInt(env.PORT) || 3000,
      DATABASE_URL: env.DATABASE_URL,
      AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION,
      AWS_S3_BUCKET_REGION: env.AWS_S3_BUCKET_REGION,
      AWS_S3_BUCKET_NAME: env.AWS_S3_BUCKET_NAME,
    };
  }

  public get(): Readonly<Config> {
    return this.config;
  }
}
