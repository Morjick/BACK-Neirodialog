import { IsBoolean, IsNumber } from 'class-validator';

export class SetShowProductContract {
  @IsNumber({}, { message: 'productId must be a number' })
  productId: number;

  @IsBoolean({ message: 'show must be a boolean' })
  show: boolean;
}
