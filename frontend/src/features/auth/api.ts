import { gqlRequest } from '@/lib/graphql-client';

const AUTH_BODY_FIELDS = `
  accessToken
  auth {
    id
    email
    phoneNumber
  }
`;

export interface AuthAccount {
  id: string;
  email: string;
  phoneNumber: string;
}

export interface AuthBody {
  accessToken: string;
  auth: AuthAccount;
}

export async function loginRequest(email: string, password: string) {
  const query = `
    mutation Login($input: LoginAuthInput!) {
      login(loginAuthInput: $input) {
        ${AUTH_BODY_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ login: AuthBody }>(query, {
    input: { email, password },
  });
  return data.login;
}

export interface RegisterInput {
  email: string;
  password: string;
  phoneNumber: string;
}

export async function registerRequest(input: RegisterInput) {
  const query = `
    mutation Register($input: RegisterAuthInput!) {
      register(registerAuthInput: $input) {
        ${AUTH_BODY_FIELDS}
      }
    }
  `;
  const data = await gqlRequest<{ register: AuthBody }>(query, { input });
  return data.register;
}

export async function logoutRequest() {
  const query = `
    mutation Logout {
      logout
    }
  `;
  await gqlRequest(query);
}

export async function forgotPasswordRequest(email: string) {
  const query = `
    mutation ForgotPassword($input: ForgotPasswordInput!) {
      forgotPassword(forgotPasswordInput: $input)
    }
  `;
  const data = await gqlRequest<{ forgotPassword: boolean }>(query, {
    input: { email },
  });
  return data.forgotPassword;
}

export async function resetPasswordRequest(token: string, newPassword: string) {
  const query = `
    mutation ResetPassword($input: ResetPasswordInput!) {
      resetPassword(resetPasswordInput: $input)
    }
  `;
  const data = await gqlRequest<{ resetPassword: boolean }>(query, {
    input: { token, newPassword },
  });
  return data.resetPassword;
}

export async function verifyEmailRequest(token: string) {
  const query = `
    mutation VerifyEmail($input: VerifyEmailInput!) {
      verifyEmail(verifyEmailInput: $input)
    }
  `;
  const data = await gqlRequest<{ verifyEmail: boolean }>(query, {
    input: { token },
  });
  return data.verifyEmail;
}

export async function resendVerificationEmailRequest(email: string) {
  const query = `
    mutation ResendVerificationEmail($input: ResendVerificationEmailInput!) {
      resendVerificationEmail(resendVerificationEmailInput: $input)
    }
  `;
  const data = await gqlRequest<{ resendVerificationEmail: boolean }>(query, {
    input: { email },
  });
  return data.resendVerificationEmail;
}

export async function refreshTokenRequest() {
  const query = `
    mutation RefreshToken {
      refreshToken {
        accessToken
      }
    }
  `;
  const data = await gqlRequest<{ refreshToken: { accessToken: string } }>(
    query,
  );
  return data.refreshToken.accessToken;
}
