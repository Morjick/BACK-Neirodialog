import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/UserModel';
import { JwtService } from '@nestjs/jwt';
import { CreateUserContract } from './contracts/createUser.contract';
import { IsValidPassword } from 'src/vendor/isValidVassword/isValidVassword';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { LoginUserContract } from './contracts/loginUser.contract';
import { SetRoleUserContract } from './contracts/setRoleUser.contract';
import { BanUserContract } from './contracts/banUser.contract';
import { CartModel } from 'src/cart/models/CartModel';
import { CartService } from 'src/cart/cart.service';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import { ChangePasswordContract } from './contracts/changePassword.contract';
import { MailService } from 'src/mail/mail.service';
import { SendMailContract } from 'src/mail/contracts/SendMail.contract';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(CartModel) private cartReposity: typeof CartModel,
    private readonly jwt: JwtService,
    private readonly cartService: CartService,
    private readonly mailService: MailService,
  ) {}

  async signUp(body: CreateUserContract) {
    try {
      const isUserExist = await this.userReposity.findOne({
        where: { email: body.email },
      });

      if (isUserExist) {
        return {
          message: 'Пользователь с такой электронной почтой уже сушествует',
          status: 301,
          error: 'Not unique params',
        };
      }

      const isPasswordValid = await IsValidPassword(
        body.password,
        body.firstname,
      );

      if (!isPasswordValid.ok) {
        return {
          message: isPasswordValid.message,
          status: 401,
        };
      }

      const hashPassword = await bcrypt.hash(body.password, 10);

      const user = await this.userReposity.create({
        ...body,
        role: 'USER',
        password: hashPassword,
      });

      const token = this.jwt.sign(
        {
          id: user.id,
          name: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '15d',
        },
      );

      const cart = await this.cartService.createCart(
        {
          userId: user.id,
        },
        { authorization: `Bearer ${token}` },
      );

      const userWithCart = await this.userReposity.findByPk(user.id, {
        include: { all: true },
      });

      return {
        message: 'Пользователь создан',
        token,
        user: userWithCart,
        cart,
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

  async signIn(body: LoginUserContract) {
    try {
      const user = await this.userReposity.findOne({
        where: { email: body.email },
      });

      if (!user) {
        return {
          message: 'Пользователь с такой почтой не найден',
          status: 404,
          ok: false,
        };
      }

      const isPassword = await bcrypt.compare(body.password, user.password);

      if (!isPassword) {
        return {
          message: 'Указан не верный пароль',
          status: 301,
          ok: false,
        };
      }

      const token = this.jwt.sign(
        {
          id: user.id,
          name: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '15d',
        },
      );

      return {
        message: 'Авторизация подтверждена',
        token,
        user,
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

  async checkToken(token: string) {
    try {
      const { id } = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!id) {
        return {
          message: 'Не удалось подтвердить авторизацию',
          ok: false,
          status: 401,
        };
      }

      const user = await this.userReposity.findOne({
        where: { id },
        include: { all: true },
      });

      return {
        message: 'Авторизация подтверждена',
        ok: true,
        user,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async setRole(body: SetRoleUserContract) {
    try {
      const { userId, role } = body;
      const update = await this.userReposity.update(
        { role },
        { where: { id: userId } },
      );

      return {
        message: 'Роль установлена',
        ok: true,
        update,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async banUser(body: BanUserContract) {
    try {
      const { userId, reason, banned } = body;
      await this.userReposity.update(
        { banReason: reason, banned },
        { where: { id: userId } },
      );

      return {
        message: 'Пользователь заблокирован',
        ok: true,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
      };
    }
  }

  async changePassword(body: ChangePasswordContract, headers) {
    try {
      if (!body.newPassword || !body.oldPassword) {
        return {
          message: 'Укажите старый и новый пароль',
          ok: false,
          status: 301,
        };
      }

      const { id } = await getAutor(headers);

      if (!id) {
        return {
          status: 401,
          message: 'Необходимо авторизоваться',
          ok: false,
        };
      }

      const user = await this.userReposity.findOne({ where: { id } });

      const isPassword = await bcrypt.compare(body.oldPassword, user.password);

      if (!isPassword) {
        return {
          ok: false,
          status: 301,
          message: 'Старый пароль указан не верно',
        };
      }

      const isValidNewPassword = await IsValidPassword(body.newPassword);

      if (!isValidNewPassword.ok) {
        return {
          message: isPassword.message,
          ok: false,
          status: 301,
        };
      }

      await this.userReposity.update(
        { password: body.newPassword },
        { where: { id } },
      );

      return await this.signIn({
        email: user.email,
        password: body.newPassword,
      });
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
      };
    }
  }

  async getUser(userId: number) {
    try {
      const user = await this.userReposity.findByPk(userId);

      if (!user) {
        return {
          message: 'Пользователь не найден',
          error: 'NotFound',
          status: 404,
        };
      }

      return {
        message: 'Пользователь найден',
        ok: true,
        user,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getMany(body) {
    try {
      const { limit = 50, offset = 0, firstname = '', lastname = '' } = body;

      const users = await this.userReposity.findAll({
        limit,
        offset,
        where: {
          firstname: {
            [Op.iLike]: `%${firstname}%`,
          },
          lastname: {
            [Op.iLike]: `%${lastname}%`,
          },
        },
        include: { all: true },
      });

      const activePage = Math.ceil(offset / limit + 1)
        ? Math.ceil(offset / limit + 1)
        : 1;
      const count = await this.userReposity.count();
      const pagesCount = count / limit;
      const pages = pagesCount > 1 ? Math.ceil(pagesCount) : 1;
      const nextPageAvaible = pages >= activePage + 1 ? true : false;
      const prevPageAvaible = activePage <= 1 ? false : true;

      return {
        message: 'Пользователи получены',
        ok: true,
        users,
        pagination: {
          nextPageAvaible,
          prevPageAvaible,
          pages,
          activePage,
        },
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getProfile(headers) {
    try {
      const { id } = await getAutor(headers);

      if (!id) {
        return {
          message: 'Пользователь не найден',
          ok: false,
          status: 404,
        };
      }

      const user = await this.userReposity.findOne({
        where: { id },
        attributes: [
          'firstname',
          'lastname',
          'id',
          'email',
          'avatar',
          'banned',
          'banReason',
          'city',
          'avatar',
          'role',
        ],
        include: { all: true, nested: true },
      });

      return {
        message: 'Пользователь успешно получен',
        ok: true,
        user,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async changeAvatar(avatar: string, headers: any) {
    try {
      if (!avatar) {
        return {
          status: 301,
          message: 'Укажите аватар',
          ok: false,
        };
      }

      const { id } = await getAutor(headers);

      await this.userReposity.update({ avatar }, { where: { id } });

      const userData = await this.userReposity.findByPk(id);

      return {
        status: 200,
        ok: true,
        user: userData,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      };
    }
  }

  async verifyEmail() {
    try {
      const mailContent: SendMailContract = {
        from: 'neirodialog@yandex.ru',
        email: 'matvey-khramov@inbox.ru',
        text: 'Hello, Matvey',
      };

      return await this.mailService.sendMail(mailContent);
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      };
    }
  }
}
