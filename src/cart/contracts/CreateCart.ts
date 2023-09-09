import { IsNumber } from 'class-validator';

export class CreateCartContract {
  @IsNumber({}, { message: 'UserId must be a number' })
  userId: number;
}
