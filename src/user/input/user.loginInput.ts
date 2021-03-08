import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';

export class LoginInput implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
