import { IsNumber } from 'class-validator';
import { CreateProductContract } from './createProduct.contract';

export class UpdateProductContract extends CreateProductContract {
  @IsNumber({}, { message: 'ID must be a number' })
  id: number;
}
