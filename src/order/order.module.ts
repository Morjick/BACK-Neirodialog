import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModel } from 'src/cart/models/CartModel';
import { UserModel } from 'src/user/models/UserModel';
import { CartItemModel } from 'src/cart/models/CartItemModel';
import { ProductModel } from 'src/product/models/ProductModel';
import { OrderModel } from './models/OrderModel';
import { CartService } from 'src/cart/cart.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [OrderService, CartService, JwtService],
  controllers: [OrderController],
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      CartModel,
      CartItemModel,
      ProductModel,
      OrderModel,
    ]),
  ],
  exports: [OrderService],
})
export class OrderModule {}
