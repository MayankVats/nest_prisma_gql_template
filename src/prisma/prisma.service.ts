import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const config = configService.get();

    super({
      datasources: {
        db: {
          url: config.DATABASE_URL,
        },
      },
    });
  }
}
