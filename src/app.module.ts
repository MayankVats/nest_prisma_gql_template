import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    ConfigModule,
    UsersModule,
    PrismaModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [],
      }),
    }),
    AdminModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
