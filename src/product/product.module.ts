import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { ProductModel } from './models/ProductModel';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [ProductService, JwtService],
  imports: [SequelizeModule.forFeature([UserModel, ProductModel])],
})
export class ProductModule {}
