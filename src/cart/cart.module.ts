import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModel } from './models/CartModel';
import { CartItemModel } from './models/CartItemModel';
import { ProductModel } from 'src/product/models/ProductModel';
import { UserModel } from 'src/user/models/UserModel';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CartController],
  providers: [CartService, JwtService],
  imports: [
    SequelizeModule.forFeature([
      CartModel,
      CartItemModel,
      ProductModel,
      UserModel,
    ]),
  ],
  exports: [CartService],
})
export class CartModule {}
