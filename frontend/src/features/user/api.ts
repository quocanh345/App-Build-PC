import { gqlRequest } from '@/lib/graphql-client';

export interface UserProfile {
  id: string;
  username: string;
  address: string;
}

export interface Account {
  id: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

export async function fetchMyProfile() {
  const query = `
    query MyProfile {
      me {
        id
        username
        address
      }
    }
  `;
  const data = await gqlRequest<{ me: UserProfile }>(query);
  return data.me;
}

export async function fetchMyAccount() {
  const query = `
    query MyAccount {
      myAccount {
        id
        email
        phoneNumber
        isVerified
      }
    }
  `;
  const data = await gqlRequest<{ myAccount: Account }>(query);
  return data.myAccount;
}

export async function updateProfileRequest(input: { username?: string; address?: string }) {
  const query = `
    mutation UpdateProfile($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
        id
        username
        address
      }
    }
  `;
  const data = await gqlRequest<{ updateProfile: UserProfile }>(query, { input });
  return data.updateProfile;
}

export async function changeEmailRequest(newEmail: string) {
  const query = `
    mutation ChangeEmail($input: ChangeEmailInput!) {
      changeEmail(input: $input) {
        id
        email
        phoneNumber
        isVerified
      }
    }
  `;
  const data = await gqlRequest<{ changeEmail: Account }>(query, {
    input: { newEmail },
  });
  return data.changeEmail;
}

export async function changePhoneNumberRequest(newPhoneNumber: string) {
  const query = `
    mutation ChangePhoneNumber($input: ChangePhoneNumberInput!) {
      changePhoneNumber(input: $input) {
        id
        email
        phoneNumber
      }
    }
  `;
  const data = await gqlRequest<{ changePhoneNumber: Account }>(query, {
    input: { newPhoneNumber },
  });
  return data.changePhoneNumber;
}

export async function changePasswordRequest(oldPassword: string, newPassword: string) {
  const query = `
    mutation ChangePassword($input: ChangePasswordInput!) {
      changePassword(input: $input)
    }
  `;
  const data = await gqlRequest<{ changePassword: boolean }>(query, {
    input: { oldPassword, newPassword },
  });
  return data.changePassword;
}
