import {Field, InputType} from '@nestjs/graphql'
import {IsEmail, IsString, Matches, MaxLength, MinLength} from 'class-validator'
import {UserRoles} from '../../types/roles'
import {User} from '../user.entity'

type excludedOptions = typeof UserRoles.ADMIN | typeof UserRoles.SUPER_ADMIN
type RegisterUserRoles = Exclude<UserRoles, excludedOptions>

@InputType({description: 'New user data'})
export class RegisterInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string

  @Field()
  @IsString()
  role: RegisterUserRoles
}
