import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class CreateResponseContract {
  @IsString({ message: 'Text must be a string' })
  text: string;

  @IsNumber({}, { message: 'Score must be a number' })
  score: number;

  @IsNumber({}, { message: 'ProductId must be a number' })
  @IsEmpty({ message: 'ProductId is required' })
  productId: number;
}
