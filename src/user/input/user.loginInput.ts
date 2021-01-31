import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, IsString} from 'class-validator';
import {User} from 'src/user/user.entity';

@InputType({description: 'Login input data'})
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string
}
