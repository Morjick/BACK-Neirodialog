import { IsNumber } from 'class-validator';

export class CreateItemCartContract {
  @IsNumber({}, { message: 'UserId must be a number' })
  userId: number;

  @IsNumber({}, { message: 'itemId must be a number' })
  itemId: number;

  @IsNumber({}, { message: 'count must be a numer' })
  count: number;
}
