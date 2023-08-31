import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AwsService } from 'src/aws/aws.service';
@Module({
  providers: [UsersResolver, UsersService, AwsService],
})
export class UsersModule {}
