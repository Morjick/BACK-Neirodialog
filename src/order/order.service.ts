import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartService } from 'src/cart/cart.service';
import { CartModel } from 'src/cart/models/CartModel';
import { UserModel } from 'src/user/models/UserModel';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import { OrderModel } from './models/OrderModel';
import { OrderStatusEnum } from './contracts/OrderStatus.model';
import { ProductTypeEnum } from 'src/product/contracts/ProductTypes.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(CartModel) private cartReposity: typeof CartModel,
    @InjectModel(OrderModel) private orderReposity: typeof OrderModel,
    private readonly cartService: CartService,
  ) {}

  async createOrder(headers: any) {
    try {
      const { cart, summ } = await this.cartService.getCart(headers);
      const user = await getAutor(headers);

      if (!user.id) {
        return {
          message: 'Пользователь не найден',
          status: 401,
          ok: false,
        };
      }

      if (user.id !== cart.user.id) {
        return {
          message: 'Вы не можете создавать заказ для друго человека',
          ok: false,
          status: 301,
        };
      }

      const order = await this.orderReposity.create({
        userId: user.id,
        cartId: cart.id,
        summ,
        needPay: true,
      });

      const userActualCart = await this.cartReposity.findOne({
        where: { id: cart.id },
        include: { all: true, nested: true },
      });

      const userCart = userActualCart.items;

      //! вот эти продукты нужно отправлять пользователю на почту
      //! и добавлять в личный кабинет
      const electronicProducts = userCart.filter(
        (el) => el.item.type === ProductTypeEnum.electronic,
      );

      const newCart = await this.cartService.createCart(
        {
          userId: user.id,
        },
        headers,
      );

      return {
        message: 'Заказ создан',
        ok: true,
        order,
        newCart,
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getOrders(headers) {
    try {
      const user = await getAutor(headers);

      if (!user.id) {
        return {
          message: 'Пользователь не найден',
          status: 401,
          ok: false,
        };
      }

      const orders = await this.orderReposity.findAll({
        where: { userId: user.id },
        include: { all: true, nested: true },
      });

      return {
        message: 'Заказы получены',
        ok: true,
        orders,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getOrder(id) {
    try {
      const order = await this.orderReposity.findByPk(id);

      if (!order) {
        return {
          message: 'Заказ не найден',
          ok: false,
          status: 404,
        };
      }

      return {
        message: 'Заказы получены',
        ok: true,
        order,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getOrderForAdmin(status: OrderStatusEnum) {
    try {
      let orders = [];

      if (status) {
        orders = await this.orderReposity.findAll({
          where: { status },
          include: { all: true, nested: true },
          order: [['createdAt', 'ASC']],
        });
      } else {
        orders = await this.orderReposity.findAll({
          include: { all: true, nested: true },
          order: [['createdAt', 'ASC']],
        });
      }

      return {
        message: 'Заказы получены',
        ok: true,
        orders,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async setOrderStatus(body) {
    try {
      const { status, orderId } = body;
      if (!status) {
        return {
          message: 'Укажите статус заказа',
          eror: 'Invalid',
          ok: false,
          status: 301,
        };
      }

      await this.orderReposity.update({ status }, { where: { id: orderId } });

      return {
        message: 'Заказы получены',
        ok: true,
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
