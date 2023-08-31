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
import { LoggingPlugin } from './shared/providers';
import { AwsModule } from './aws/aws.module';

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  let logFormat = `${timestamp} [${level}] : ${JSON.stringify(message)}`;

  if (level == 'http') {
    logFormat = `${timestamp} [${level}] : [requestID: ][userId: ][type: ${message.queryType}] : ${message.query}`;
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
        transports: [
          // To output debug log level we need to
          // explicitly tell winston about it with below line
          new transports.Console({ level: 'debug' }),
        ],
      }),
    }),
    ConfigModule,
    UsersModule,
    PrismaModule,
    AwsModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver, LoggingPlugin],
})
export class AppModule {}
