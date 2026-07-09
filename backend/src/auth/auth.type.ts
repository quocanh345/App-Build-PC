import { ObjectType, Field } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  payload: tokenPayload;
}

export interface AuthOutPut {
  auth: Auth;
  tokens: AuthToken;
}

@ObjectType()
export class AuthBody {
  @Field()
  auth!: Auth;

  @Field()
  accessToken!: string;
}

@ObjectType()
export class RefreshTokenBody {
  @Field()
  accessToken!: string;
}

export type tokenPayload = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  tokenId?: string;
};
