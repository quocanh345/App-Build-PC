import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyEmailInput {
  @Field(() => String)
  token!: string;
}
