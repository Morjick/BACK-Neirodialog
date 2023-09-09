import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { AddressModel } from './models/AddressModel';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import { SetDefaultAddress } from './contracts/SetDefaultAddress.contract';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(AddressModel) private addressReposity: typeof AddressModel,
  ) {}

  async addAddress(value: string, headers: any) {
    try {
      if (!value || !value.length) {
        return {
          message: 'Укажите адрес',
          ok: false,
          status: 301,
        };
      }

      const user = await getAutor(headers);

      if (!user.id) {
        return {
          message: 'Пользователь не найден',
          ok: false,
          status: 401,
        };
      }

      const address = await this.addressReposity.create({
        userId: user.id,
        address: value,
      });

      return {
        message: 'Адрес добавлен',
        ok: true,
        address,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async setDefaultAddress(body: SetDefaultAddress, headers) {
    try {
      const { id } = await getAutor(headers);

      if (!id) {
        return {
          message: 'Не удалось подтвердить авториизацию',
          ok: false,
          status: 401,
        };
      }

      const user = await this.userReposity.findOne({ where: { id } });
      const address = await this.addressReposity.findOne({
        where: { id: body.addressId },
      });

      if (!user || !address) {
        return {
          message: 'Не удалось найти пользователя или адрес',
          ok: false,
          status: 404,
        };
      }

      await this.userReposity.update(
        { defaultAddressId: address.id },
        { where: { id: user.id } },
      );

      return {
        message: 'Адрес по умолчанию',
        ok: true,
        status: 200,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
        error: e,
      };
    }
  }

  async getAddress(headers) {
    try {
      const user = await getAutor(headers);

      if (!user || !user.id) {
        return {
          message: 'Пользователь не найден',
          ok: false,
          status: 401,
        };
      }

      const address = await this.addressReposity.findAll({
        where: { userId: user.id },
        // include: { all: true },
      });

      return {
        message: 'Адреса получены',
        ok: true,
        address,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }
}
