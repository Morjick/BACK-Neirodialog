import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductModel } from 'src/product/models/ProductModel';
import { UserModel } from 'src/user/models/UserModel';

@Table
export class ResponseModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.TEXT })
  text: string;

  @Column({ type: DataType.INTEGER })
  score: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductModel)
  product: ProductModel;
}
