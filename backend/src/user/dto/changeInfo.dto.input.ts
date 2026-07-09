import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  address?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  oldPassword!: string;

  @Field()
  newPassword!: string;
}

@InputType()
export class ChangePhoneNumberInput {
  @Field()
  newPhoneNumber!: string;
}

@InputType()
export class ChangeAddressInput {
  @Field()
  newAddress!: string;
}

@InputType()
export class ChangeUsernameInput {
  @Field()
  newUsername!: string;
}

@InputType()
export class ChangeEmailInput {
  @Field()
  newEmail!: string;
}
