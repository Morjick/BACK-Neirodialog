import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CartModel } from 'src/cart/models/CartModel';
import { UserModel } from 'src/user/models/UserModel';

@Table
export class OrderModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER })
  summ: number;

  @Column({ type: DataType.BOOLEAN })
  needPay: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inProcessing: boolean;

  @Column({
    type: DataType.ENUM(
      'GOING TO',
      'IN DELIVERY',
      'CLOSED',
      'DONE',
      'HAS ERROR',
    ),
    defaultValue: 'GOING TO',
  })
  status: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => CartModel)
  @Column({
    type: DataType.INTEGER,
  })
  cartId: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;
}
