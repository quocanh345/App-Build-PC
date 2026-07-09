import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterAuthInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String)
  phoneNumber!: string;
}
