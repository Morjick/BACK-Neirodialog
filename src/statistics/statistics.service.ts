import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { CartService } from 'src/cart/cart.service';
import { CartModel } from 'src/cart/models/CartModel';
import { UserModel } from 'src/user/models/UserModel';
import { Op } from 'sequelize';
import { OrderService } from 'src/order/order.service';
import { OrderModel } from 'src/order/models/OrderModel';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(CartModel) private cartReposity: typeof CartModel,
    @InjectModel(OrderModel) private orderReposity: typeof OrderModel,
    private readonly jwt: JwtService,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
  ) {}

  async getUserSignUpStatistic() {
    try {
      const userCount = await this.userReposity.count({
        where: { banned: false },
      });

      const lastMounthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const lastMounthEnd = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const nowMounth = new Date(Date.now());

      const userCountInNowMounth = await this.userReposity.count({
        where: {
          banned: false,
          createdAt: {
            [Op.lte]: nowMounth,
          },
        },
      });

      const userCountInLastMounth = await this.userReposity.count({
        where: {
          banned: false,
          createdAt: {
            [Op.gte]: lastMounthStart,
            [Op.lte]: lastMounthEnd,
          },
        },
      });

      const ordersInNowMounth = await this.orderReposity.count({
        where: {
          createdAt: {
            [Op.lte]: nowMounth,
          },
        },
      });

      const ordersInLastMounth = await this.orderReposity.count({
        where: {
          createdAt: {
            [Op.gte]: lastMounthStart,
            [Op.lte]: lastMounthEnd,
          },
        },
      });

      const payedInNowMounth = await this.orderReposity.count({
        where: {
          needPay: false,
          createdAt: {
            [Op.lte]: nowMounth,
          },
        },
      });

      const allOrdersCount = await this.orderReposity.count();

      const summOrdersInNowMounth = await this.orderReposity.sum('summ', {
        where: {
          createdAt: {
            [Op.lte]: nowMounth,
          },
        },
      });

      const summOrdersInLastMounth = await this.orderReposity.sum('summ', {
        where: {
          createdAt: {
            [Op.gte]: lastMounthStart,
            [Op.lte]: lastMounthEnd,
          },
        },
      });

      return {
        message: 'Статистика получена',
        ok: true,
        status: 200,
        statistic: {
          users: {
            userCount,
            userCountInNowMounth,
            userCountInLastMounth,
          },
          orders: {
            ordersInNowMounth,
            payedInNowMounth,
            ordersInLastMounth,
            allOrdersCount,
            summOrdersInNowMounth,
            summOrdersInLastMounth: summOrdersInLastMounth
              ? summOrdersInLastMounth
              : 0,
          },
        },
      };
    } catch (e) {
      console.log(e);
      return {
        message: 'неожиданная ошибка сервера',
        ok: false,
        error: e,
        status: 501,
      };
    }
  }
}
