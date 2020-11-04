import { UseFilters } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MyContext } from '../types/MyContext'
import { CustomResult } from '../utils/CustomResult'
import { Public } from '../utils/public.decorator'
import validationFilter from '../utils/validation.filter'
import { validationPipe } from '../utils/validationPipe'
import { LoginInput } from './input/user.loginInput'
import { RegisterInput } from './input/user.registerInput'
import { MeResult } from './user.customResults'
import { User } from './user.entity'
import { UserService } from './user.service'

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
    @Context() {req}: MyContext, @Args('registerInput', validationPipe) registerInput: RegisterInput,
  ): Promise<CustomResult> {
    return await this.userService.register(registerInput, req)
  }

  @Public()
  @Mutation(() => CustomResult)
  @UseFilters(validationFilter)
  async login(
    @Args('loginInput', validationPipe) loginInput: LoginInput,
    @Context() {res}: MyContext,
  ): Promise<CustomResult> {
    return await this.userService.login(loginInput, res)
  }

  @Mutation(() => Boolean)
  async logout(@Context() {res}: MyContext): Promise<boolean> {
    return await this.userService.logout(res)
  }

  @Query(() => MeResult)
  async me(@Context() {jwtPayload}: MyContext): Promise<typeof MeResult> {
    return await this.userService.me(jwtPayload!.userId)
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Args('userId') userId: string): Promise<boolean> {
    return await this.userService.revokeRefreshToken(userId)
  }
}
