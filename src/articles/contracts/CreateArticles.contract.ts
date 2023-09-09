import { IsArray, IsString } from 'class-validator';

export class CreateArticleCotract {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'Body must be a string' })
  body: string;

  @IsString({ message: 'Desctiprion must be a string' })
  description: string;

  avatar: string;

  @IsArray({ message: 'Укажите заголовки для продвижения статьи' })
  tags: string[];

  id?: number;
}
