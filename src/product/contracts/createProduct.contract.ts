import { IsNumber, IsString } from 'class-validator';
import { ProductTypeEnum } from './ProductTypes.enum';

export class CreateProductContract {
  @IsString({ message: 'Title must be is string' })
  readonly title: string;

  @IsString({ message: 'Description must be is string' })
  readonly description: string;

  @IsNumber({}, { message: 'BasePrice must be a number' })
  basePrice: number;
  discount = 0;

  show = true;
  inStock = true;

  countInStock: number;
  volume: number;
  size: number;
  quantityInThePackage: number;
  labeling: boolean;
  weight: number;

  type: ProductTypeEnum;

  images?: string[];
  videos?: string[];
  colors: string[];
}
