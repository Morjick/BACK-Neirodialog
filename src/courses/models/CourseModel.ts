import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserCourseModel } from 'src/user/models/UserCourse';
import { UserModel } from 'src/user/models/UserModel';

@Table
export class CourseModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true })
  title: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING, unique: true })
  href: string;

  @Column({ type: DataType.INTEGER })
  basePrice: number;

  @Column({ type: DataType.INTEGER })
  price: number;

  @Column({ type: DataType.BOOLEAN })
  show: boolean;

  @Column({ type: DataType.INTEGER })
  discount: number;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  images: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  videos: string[];

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @BelongsTo(() => UserModel)
  author: UserModel;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  subscribersId: number[];

  @BelongsToMany(() => UserModel, { through: { model: () => UserCourseModel } })
  subscribers: UserModel[];
}
