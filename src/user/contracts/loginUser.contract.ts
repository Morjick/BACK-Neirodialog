import { IsEmail, IsString } from 'class-validator';

export class LoginUserContract {
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Email is invalid' })
  readonly email: string;

  @IsString({ message: 'Password must be is string' })
  readonly password: string;
}
