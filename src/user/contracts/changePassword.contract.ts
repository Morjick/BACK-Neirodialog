import { IsString } from 'class-validator';

export class ChangePasswordContract {
  @IsString({ message: 'Password must be string' })
  oldPassword: string;

  @IsString({ message: 'New password must be string' })
  newPassword: string;
}
