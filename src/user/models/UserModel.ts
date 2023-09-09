import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { AddressModel } from 'src/address/models/AddressModel';
import { CartModel } from 'src/cart/models/CartModel';
import { CourseModel } from 'src/courses/models/CourseModel';
import { OrderModel } from 'src/order/models/OrderModel';
import { UserCourseModel } from './UserCourse';

export enum UserRolesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ROOT = 'ROOT',
}

@Table
export class UserModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Матвей', description: 'Имя пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Firstname is required field' },
    },
  })
  firstname: string;

  @ApiProperty({ example: 'Храмов', description: 'Фамилия пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Lastname is required field' },
    },
  })
  lastname: string;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @ApiProperty({
    example: 'ljawdbvahwdvawhdb',
    description: 'Password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required field' },
    },
  })
  password: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.STRING })
  banReason: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({
    type: DataType.ENUM('USER', 'ADMIN', 'ROOT'),
    defaultValue: 'USER',
  })
  role: string;

  @ForeignKey(() => CartModel)
  cartId: number;

  @BelongsTo(() => CartModel)
  cart: CartModel;

  @HasMany(() => OrderModel)
  orders: OrderModel[];

  @HasMany(() => AddressModel)
  address: AddressModel[];

  @ForeignKey(() => AddressModel)
  @Column({ type: DataType.INTEGER })
  defaultAddressId: number;

  @BelongsTo(() => AddressModel)
  defaultAddress: AddressModel;

  @ForeignKey(() => CourseModel)
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  cousesId: number[];

  @BelongsToMany(() => CourseModel, {
    through: { model: () => UserCourseModel },
  })
  couses: CourseModel[];
}
