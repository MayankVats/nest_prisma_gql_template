import {
  ApolloServerPlugin,
  GraphQLRequestContextDidResolveOperation,
  GraphQLRequestListener,
} from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  // Check out the below reference to know about GraphQL-
  // -request lifecycle events
  // Reference: https://www.apollographql.com/docs/apollo-server/integrations/plugins/
  // Reference: https://docs.nestjs.com/graphql/plugins

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const logger: Logger = this.logger;

    return {
      async didResolveOperation(
        requestContext: GraphQLRequestContextDidResolveOperation<any>,
      ) {
        // log the below line to know more about requestContext
        // console.log('didResolveOperation', requestContext.operation);
        const { queryType, query } = _fetchQueryTypeAndName(requestContext);

        if (query !== '_service' && query !== '__schema') {
          const userData = requestContext.request.http.headers.get('user');
          let user = undefined;
          if (userData) {
            user = JSON.parse(userData);
          }

          const reqId = uuidv4();

          logger.http({ queryType, query, userId: user?.id, reqId });
        }
      },
    };
  }
}

function _fetchQueryTypeAndName(context) {
  return {
    queryType: context.operation.operation,
    query: context.operation.selectionSet.selections[0].loc.startToken.value,
  };
}
