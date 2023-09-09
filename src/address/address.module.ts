import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { AddressModel } from './models/AddressModel';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [SequelizeModule.forFeature([UserModel, AddressModel])],
})
export class AddressModule {}
