import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { CartService } from 'src/cart/cart.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { CartModel } from 'src/cart/models/CartModel';
import { CartItemModel } from 'src/cart/models/CartItemModel';
import { ProductModel } from 'src/product/models/ProductModel';
import { OrderModel } from 'src/order/models/OrderModel';
import { AddressModel } from 'src/address/models/AddressModel';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, CartService, JwtService, OrderService],
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
})
export class StatisticsModule {}
