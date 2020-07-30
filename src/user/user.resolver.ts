import {UnauthorizedException, UseFilters} from '@nestjs/common'
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {MyContext} from '../types/myContext'
import {CustomResult} from '../utils/CustomResult'
import {Public} from '../utils/public.decorator'
import validationFilter from '../utils/validation.filter'
import {LoginInput} from './input/user.loginInput'
import {RegisterInput} from './input/user.registerInput'
import {loginValidationPipe} from './pipes/user.loginInput.pipe'
import {registerValidationPipe} from './pipes/user.registerInput.pipe'
import {MeResult} from './user.customResults'
import {User} from './user.entity'
import {UserService} from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.userService.users()
  }

  @Public()
  @Mutation(() => CustomResult)
  @UseFilters(validationFilter)
  async register(
    @Args('registerInput', registerValidationPipe) registerInput: RegisterInput,
  ): Promise<CustomResult> {
    return await this.userService.register(registerInput)
  }

  @Public()
  @Mutation(() => String)
  @UseFilters(validationFilter)
  async login(
    @Args('loginInput', loginValidationPipe) loginInput: LoginInput,
    @Context() {res}: MyContext,
  ): Promise<string> {
    return await this.userService.login(loginInput, res)
  }

  @Mutation(() => Boolean)
  async logout(@Context() {res}: MyContext): Promise<boolean> {
    return await this.userService.logout(res)
  }

  @Query(() => MeResult)
  async me(@Context() {jwtPayload}: MyContext): Promise<typeof MeResult> {
    if (!jwtPayload) throw new UnauthorizedException()
    return await this.userService.me(jwtPayload?.userId)
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args('userId') userId: string): Promise<boolean> {
    return await this.userService.revokeRefreshToken(userId)
  }
}
