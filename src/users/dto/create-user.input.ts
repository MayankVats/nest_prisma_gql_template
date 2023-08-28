import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'id of the user' })
  id: string;

  @Field({ description: 'email of the user' })
  email: string;

  @Field({ description: 'password of the user' })
  password: string;
}
