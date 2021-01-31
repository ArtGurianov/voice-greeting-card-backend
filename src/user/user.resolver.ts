import {UseFilters} from '@nestjs/common';
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {MyContext} from 'src/types/MyContext';
import {CustomResult} from 'src/utils/CustomResult';
import {Public} from 'src/utils/public.decorator';
import validationFilter from 'src/utils/validation.filter';
import {validationPipe} from 'src/utils/validationPipe';
import {LoginInput} from './input/user.loginInput';
import {RegisterInput} from './input/user.registerInput';
import {MeResult} from './user.customResults';
import {User} from './user.entity';
import {UserService} from './user.service';
import {Roles} from 'src/utils/roles.decorator';
import {UserRoles} from 'src/types/roles';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.users();
  }

  @Public()
  @Mutation(() => CustomResult)
  @UseFilters(validationFilter)
  async register(
    @Args('registerInput', validationPipe) registerInput: RegisterInput,
  ): Promise<CustomResult> {
    return await this.userService.register(registerInput);
  }

  @Public()
  @Mutation(() => CustomResult)
  @UseFilters(validationFilter)
  async login(
    @Args('loginInput', validationPipe) loginInput: LoginInput,
    @Context() {res}: MyContext,
  ): Promise<CustomResult> {
    return await this.userService.login(loginInput, res);
  }

  @Mutation(() => Boolean)
  async logout(@Context() {res}: MyContext): Promise<boolean> {
    return await this.userService.logout(res);
  }

  @Query(() => MeResult)
  async me(@Context() {jwtPayload}: MyContext): Promise<typeof MeResult> {
    return await this.userService.me(jwtPayload!.userId);
  }

  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args('userId') userId: string): Promise<boolean> {
    return await this.userService.revokeRefreshToken(userId);
  }
}
