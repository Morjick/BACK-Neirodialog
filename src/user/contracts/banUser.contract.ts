import { IsNumber, IsString } from 'class-validator';

export class BanUserContract {
  @IsString({ message: 'Reason must be is string' })
  readonly reason: string;

  @IsNumber({}, { message: 'User id must be a number' })
  userId: number;

  banned = true;
}
