import { IsNumber } from 'class-validator';

export class AddItemCartContract {
  @IsNumber({}, { message: 'itemId must be a number' })
  itemId: number;

  @IsNumber({}, { message: 'count must be a number' })
  count: number;
}
