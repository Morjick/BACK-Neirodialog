import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModel } from './models/ResponseModel';
import { ProductModel } from 'src/product/models/ProductModel';
import { UserModel } from 'src/user/models/UserModel';

@Module({
  providers: [ResponseService],
  controllers: [ResponseController],
  imports: [
    SequelizeModule.forFeature([ResponseModel, ProductModel, UserModel]),
  ],
})
export class ResponseModule {}
