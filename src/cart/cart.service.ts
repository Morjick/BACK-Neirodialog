import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { CartModel } from './models/CartModel';
import { CartItemModel } from './models/CartItemModel';
import { CreateCartContract } from './contracts/CreateCart';
import { CreateItemCartContract } from './contracts/CreateItemCart';
import { ProductModel } from 'src/product/models/ProductModel';
import { AddItemCartContract } from './contracts/AddItemCart';
import { getAutor } from 'src/vendor/getAutor/getAutor';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(CartModel) private cartReposity: typeof CartModel,
    @InjectModel(CartItemModel) private cartItemReposity: typeof CartItemModel,
    @InjectModel(ProductModel) private productReposity: typeof ProductModel,
    private readonly jwt: JwtService,
  ) {}

  async createCart(body: CreateCartContract, headers: any) {
    try {
      const cart = await this.cartReposity.create({ userId: body.userId });

      const token: string = headers.authorization.split(' ')[1];
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      await this.userReposity.update({ cartId: cart.id }, { where: { id } });

      return {
        ok: true,
        message: 'Корзина создана',
        cart,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async createItemCart(body: CreateItemCartContract, headers: any) {
    try {
      if (body.count === 0) {
        return {
          message: 'Число товара должно быть больше одного',
          ok: false,
          status: 505,
        };
      }

      const product = await this.productReposity.findOne({
        where: { id: body.itemId },
      });

      if (!product) {
        return {
          message: 'Продукт с таким id не найден',
          ok: false,
          status: 404,
        };
      }

      const token: string = headers.authorization.split(' ')[1];
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userReposity.findOne({
        where: { id },
        include: { all: true },
      });

      if (!user) {
        return {
          message: 'Пользователь не найден',
          ok: false,
          status: 404,
        };
      }

      const cartItem = await this.cartItemReposity.create({
        cartId: user.cartId,
        itemId: product.id,
        count: body.count,
      });

      return {
        message: 'Предмет карзины создан',
        ok: true,
        cartItem,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async addItemCart(body: AddItemCartContract, headers: any) {
    try {
      if (!body.itemId) {
        return {
          message: 'Укажите Id элемента',
          ok: false,
          status: 305,
        };
      }

      const token: string = headers.authorization.split(' ')[1];
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userReposity.findOne({
        where: { id },
        include: { all: true },
      });

      if (!user) {
        return {
          message: 'Пользователь не найден',
          ok: false,
          status: 404,
        };
      }

      let cart = null;

      if (!user.cartId) {
        const cartData = await this.createCart({ userId: user.id }, headers);
        cart = cartData.cart;
      }

      cart = await this.cartReposity.findOne({
        where: { id: user.cartId },
        include: { all: true, nested: true },
      });

      if (!cart) {
        const cartData = await this.createCart({ userId: user.id }, headers);
        cart = cartData.cart;
      }

      const cartItemIndex = !cart.items
        ? -1
        : cart.items.findIndex((el) => {
            return el.item.id === body.itemId;
          });

      if (cartItemIndex >= 0) {
        const cartItem = cart.items[cartItemIndex];

        if (body.count === 0) {
          await this.cartItemReposity.destroy({ where: { id: cartItem.id } });

          return {
            message: 'Продукт удалён, так как число товара указано как ноль',
            ok: true,
            status: 200,
          };
        }

        const newCartItem = await this.cartItemReposity.update(
          { count: body.count },
          { where: { id: cartItem.id } },
        );

        return {
          message: 'Продукт добавлен',
          ok: true,
          status: 200,
          cartItem: newCartItem,
        };
      } else {
        const cartItem = await this.cartItemReposity.create({
          itemId: body.itemId,
          count: body.count,
          cartId: cart.id,
        });

        return {
          message: 'Продукт добавлен',
          ok: true,
          status: 200,
          cartItem: cartItem,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async removeItemCart(body, headers) {
    try {
      const { id, ok } = await getAutor(headers);

      if (!ok || !id) {
        return {
          message: 'Не удалось подтвердить авторизацию',
          status: 401,
          ok: false,
        };
      }

      const user = await this.userReposity.findOne({ where: { id } });

      if (!user) {
        return {
          message: 'Не удалось найти пользователя',
          status: 404,
          ok: false,
        };
      }

      const cart = await this.cartReposity.findOne({
        where: { id: user.cartId },
        include: { all: true, nested: true },
      });

      const cartItemIndex = cart.items.findIndex((el) => {
        return el.item.id === body.itemId;
      });

      if (cartItemIndex < 0)
        return {
          message: 'Не удалось найти продукт',
          ok: false,
          status: 404,
        };

      const item = cart.items[cartItemIndex];

      await this.cartItemReposity.destroy({ where: { id: item.id } });

      const updatedCart = await this.cartReposity.findAll({
        where: { userId: user.id },
        include: { all: true, nested: true },
      });

      return {
        message: 'Продукт удалён',
        ok: true,
        status: 200,
        cart: updatedCart,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        status: 501,
        error: e,
      };
    }
  }

  async getCart(headers: any) {
    try {
      const token: string = headers.authorization.split(' ')[1];
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      await this.cartItemReposity.destroy({ where: { itemId: null } });

      const user = await this.userReposity.findByPk(id);

      const cart = await this.cartReposity.findByPk(user.cartId, {
        include: { all: true, nested: true },
      });

      let summ = 0;

      cart.items.forEach((el) => {
        const price = el.item.discount
          ? el.item.basePrice - (el.item.basePrice * el.item.discount) / 100
          : el.item.basePrice;
        const itemSummPrice = price * el.count;

        summ += itemSummPrice;
      });

      return {
        message: 'Корзина получен',
        ok: true,
        cart,
        summ,
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
