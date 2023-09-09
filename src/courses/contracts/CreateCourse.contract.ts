import { IsNumber, IsString } from 'class-validator';

export class CreateCourseContract {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'description must be a string' })
  description: string;

  @IsNumber({}, { message: 'basePrice must be a number' })
  basePrice: number;

  @IsNumber({}, { message: 'discount must be a number' })
  discount: number;

  images: string[];
}
