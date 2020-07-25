import {IsEmail, IsString, Matches, MaxLength, MinLength} from 'class-validator'
import {User} from '../user.entity'

export class LoginInput implements Partial<User> {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string
}
