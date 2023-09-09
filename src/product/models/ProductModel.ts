import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ResponseModel } from 'src/response/models/ResponseModel';
import { UserModel } from 'src/user/models/UserModel';
import { ProductTypeEnum } from '../contracts/ProductTypes.enum';

@Table
export class ProductModel extends Model {
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

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inStock: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 100 })
  countInStock: number;

  @Column({ type: DataType.INTEGER })
  volume: number;

  @Column({ type: DataType.INTEGER })
  size: number;

  @Column({ type: DataType.INTEGER })
  quantityInThePackage: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  labeling: boolean;

  @Column({ type: DataType.INTEGER })
  weight: number;

  @Column({
    type: DataType.ENUM('PHYSYCAL', 'ELECTRONIC'),
    defaultValue: 'PHYSYCAL',
  })
  type: ProductTypeEnum;

  @Column({ type: DataType.INTEGER })
  discount: number;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  images: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  videos: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  colors: string[];

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @BelongsTo(() => UserModel)
  author: UserModel;

  @HasMany(() => ResponseModel)
  responses: ResponseModel[];
}
