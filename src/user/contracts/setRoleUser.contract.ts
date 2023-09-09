import { IsString, IsNumber } from 'class-validator';
import { UserRolesEnum } from '../models/UserModel';

export class SetRoleUserContract {
  @IsString({ message: 'Role must be string' })
  readonly role: UserRolesEnum;

  @IsNumber({}, { message: 'userId must be is number' })
  readonly userId: number;
}
