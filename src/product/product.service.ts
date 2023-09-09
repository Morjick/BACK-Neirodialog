import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from './models/ProductModel';
import { UserModel } from 'src/user/models/UserModel';
import { CreateProductContract } from './contracts/createProduct.contract';
import getTransplit from 'src/vendor/getTranslate/getTranslate';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { GetManyProductContract } from './contracts/getManyProduct.contract';
import { SetShowProductContract } from './contracts/setShowProduct.contract';
import { UpdateProductContract } from './contracts/updateProduct.contract';
import { ResponseModel } from 'src/response/models/ResponseModel';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel) private productReposity: typeof ProductModel,
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    private readonly jwt: JwtService,
  ) {}

  async createProduct(body: CreateProductContract, headers: any) {
    try {
      const token: string = headers.authorization.split(' ')[1];
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const autor = await this.userReposity.findOne({ where: { id } });

      const href = await getTransplit(body.title);

      const price = body.discount
        ? body.basePrice - (body.basePrice * body.discount) / 100
        : body.basePrice;

      const product = await this.productReposity.create({
        ...body,
        href,
        autorId: autor.id,
        price,
      });

      return {
        message: 'Продукт создан',
        ok: true,
        product,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async deleteProduct(href: string) {
    try {
      if (!href) {
        return {
          message: 'Укажите ссылку для удаления продукта',
          status: 404,
          error: 'NotFound',
        };
      }

      await this.productReposity.destroy({ where: { href } });

      return {
        message: 'Продукт удалён',
        ok: true,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async getOne(href: string) {
    try {
      if (!href) {
        return {
          message: 'Укажите ссылку для удаления продукта',
          status: 404,
          error: 'NotFound',
        };
      }

      const product = await this.productReposity.findOne({
        where: { href },
        include: [
          {
            model: UserModel,
          },
          {
            model: ResponseModel,
            nested: true,
          },
        ],
      });

      if (!product.show) {
        return {
          message: 'Продукт был скрыт. Возможно, его доработают и вернут',
          status: 404,
          ok: false,
        };
      }

      return {
        message: 'Продукт получен',
        product,
        ok: true,
        status: 200,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async getMany(body: GetManyProductContract) {
    try {
      const {
        limit = 50,
        offset = 0,
        sort = 'ASC',
        title = '',
        sortColumn = 'basePrice',
      } = body;

      const products = await this.productReposity.findAll({
        limit,
        offset,
        where: {
          show: true,
          title: {
            [Op.iLike]: `%${title}%`,
          },
        },
        order: [[sortColumn, sort]],
        include: [
          {
            model: UserModel,
          },
          {
            model: ResponseModel,
            nested: true,
          },
        ],
      });

      const count = await this.productReposity.count({ where: { show: true } });
      const pages = count / limit > 1 ? Math.ceil(count) / limit : 1;
      const nextPageAvaible = pages > 1 ? true : false;
      const activePage = Math.ceil(offset / limit)
        ? Math.ceil(offset / limit)
        : 1;

      return {
        message: 'Продукты получены',
        ok: true,
        products,
        pagination: {
          nextPageAvaible,
          pages,
          activePage,
        },
        search: body,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async setShowProduct(body: SetShowProductContract) {
    try {
      await this.productReposity.update(
        { show: body.show },
        { where: { id: body.productId } },
      );

      return {
        message: 'Продукт изменён',
        ok: true,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async updateProduct(body: UpdateProductContract) {
    try {
      const price = body.discount
        ? body.basePrice - (body.basePrice * body.discount) / 100
        : body.basePrice;

      const product = await this.productReposity.update(
        { ...body, price },
        { where: { id: body.id } },
      );

      return {
        ok: true,
        message: 'Продукт обновлён',
        product,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }
}
