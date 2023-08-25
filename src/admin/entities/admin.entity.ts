import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Admin {
  @Field(() => Int, {
    description: 'Example field (placeholder)',
    defaultValue: 1,
  })
  exampleField: number;
}
