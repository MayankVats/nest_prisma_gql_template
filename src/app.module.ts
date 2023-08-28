import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from './config/config.module';
import { format, transports } from 'winston';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  level = level.toUpperCase();

  let logFormat = `${timestamp} [${level}] : ${JSON.stringify(
    message,
    null,
    2,
  )}`;

  if (level == 'info') {
    logFormat = `${timestamp} [${level}]: ${message}`;
  }

  if (level == 'http') {
    logFormat = `${timestamp} [${level}] : [requestID: , userId: ] : ${message.method} ${message.url}`;
  }
  if (stack) {
    logFormat = logFormat + JSON.stringify(stack, null, 2);
  }
  return logFormat;
});

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql',
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        format: format.combine(format.timestamp(), customFormat),
        transports: [new transports.Console()],
      }),
    }),
    ConfigModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
