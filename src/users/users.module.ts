import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { LoggerService } from 'src/shared/providers/logger.service';

@Module({
  providers: [UsersResolver, UsersService, LoggerService],
})
export class UsersModule {}
