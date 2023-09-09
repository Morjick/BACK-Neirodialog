import { IsEmail, IsString } from 'class-validator';

export class CreateUserContract {
  @IsString({ message: 'Имя должно быть строкой!' })
  readonly firstname: string;

  @IsString({ message: 'Фамилия должна быть строкой!' })
  readonly lastname: string;

  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Email is invalid' })
  readonly email: string;

  @IsString({ message: 'Password must be is string' })
  readonly password: string;

  readonly avatar?: string;
}
