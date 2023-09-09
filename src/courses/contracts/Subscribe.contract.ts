import { IsNumber } from 'class-validator';

export class SubscribeContract {
  @IsNumber({}, { message: 'Course must be a string (id)' })
  course: number;
}
