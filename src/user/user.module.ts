import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/UserModel';
import { CartModel } from 'src/cart/models/CartModel';
import { CartItemModel } from 'src/cart/models/CartItemModel';
import { CartService } from 'src/cart/cart.service';
import { ProductModel } from 'src/product/models/ProductModel';
import { OrderModel } from 'src/order/models/OrderModel';
import { AddressModel } from 'src/address/models/AddressModel';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, CartService, MailService],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      CartModel,
      CartItemModel,
      ProductModel,
      OrderModel,
      AddressModel,
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
