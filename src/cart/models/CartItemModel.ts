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
import { CartModel } from './CartModel';

@Table
export class CartItemModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => CartModel)
  @Column({ type: DataType.INTEGER })
  cartId: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.INTEGER })
  itemId: number;

  @BelongsTo(() => ProductModel)
  item: ProductModel;

  @Column({ type: DataType.INTEGER })
  count: number;
}
