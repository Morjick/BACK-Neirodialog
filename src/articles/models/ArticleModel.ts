import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from 'src/user/models/UserModel';

@Table
export class ArticleModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
  })
  body: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  href: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  tags: string[];

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  show: boolean;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @BelongsTo(() => UserModel)
  author: UserModel;
}
