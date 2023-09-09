import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CourseModel } from 'src/courses/models/CourseModel';
import { UserModel } from 'src/user/models/UserModel';

@Table
export class UserCourseModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => CourseModel)
  @Column({ type: DataType.INTEGER })
  courseId: number;

  @BelongsTo(() => CourseModel)
  course: CourseModel;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  subscriberId: number;

  @BelongsTo(() => UserModel)
  subscriber: UserModel;
}
