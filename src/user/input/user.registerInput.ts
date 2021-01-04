import { IsEmail, IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from 'src/types/roles';
import { User } from 'src/user/user.entity';

const userRolesObj = { ...UserRoles };
const { ADMIN, SUPER_ADMIN, ...registerRolesObj } = userRolesObj;
const registerRoles = Object.values(registerRolesObj);

export class RegisterInput implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsIn(registerRoles, { message: 'cannot register with spicified Role' })
  role: UserRoles;
}
