import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { tokenPayload } from '../auth/auth.type';
import {
  UpdateProfileInput,
  ChangePasswordInput,
  ChangePhoneNumberInput,
  ChangeAddressInput,
  ChangeUsernameInput,
  ChangeEmailInput,
} from './dto/changeInfo.dto.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: tokenPayload) {
    return this.userService.getProfile(user.id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateProfile(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: UpdateProfileInput,
  ) {
    return this.userService.updateProfile(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async changeUsername(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ChangeUsernameInput,
  ) {
    return this.userService.changeUsername(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async changeAddress(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ChangeAddressInput,
  ) {
    return this.userService.changeAddress(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Auth)
  async changePhoneNumber(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ChangePhoneNumberInput,
  ) {
    return this.userService.changePhoneNumber(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Auth)
  async changeEmail(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ChangeEmailInput,
  ) {
    return this.userService.changeEmail(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async changePassword(
    @CurrentUser() user: tokenPayload,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.userService.changePassword(user.id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async removeUserProfile(@Args('id') id: string) {
    return this.userService.removeProfile(id);
  }
}
