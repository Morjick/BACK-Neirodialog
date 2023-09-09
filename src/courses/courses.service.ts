import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { CourseModel } from './models/CourseModel';
import { CreateCourseContract } from './contracts/CreateCourse.contract';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import getTransplit from 'src/vendor/getTranslate/getTranslate';
import { SubscribeContract } from './contracts/Subscribe.contract';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(CourseModel) private courseReposity: typeof CourseModel,
  ) {}

  async createCourse(body: CreateCourseContract, headers) {
    try {
      const autor = await getAutor(headers);

      const href = getTransplit(body.title);

      const price = body.discount
        ? body.basePrice - (body.basePrice * body.discount) / 100
        : body.basePrice;

      const course = await this.courseReposity.create({
        ...body,
        price,
        autorId: autor.id,
        href,
      });

      return {
        message: 'Курс создан',
        ok: true,
        status: 200,
        course,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getCourses() {
    try {
      const courses = await this.courseReposity.findAll({
        where: { show: true },
      });

      return {
        message: 'ok',
        ok: true,
        courses,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async getCourse(href, headers) {
    try {
      const autor = await getAutor(headers);
      const course = await this.courseReposity.findOne({
        where: { href },
        include: { all: true },
      });

      if (!course.show) {
        if (autor.role !== 'ADMIN' && autor.role !== 'ROOT') {
          return {
            message: 'Курс не найден',
            ok: false,
            status: 404,
          };
        }
      }

      const subscribeIndex = autor.ok
        ? course.subscribers.findIndex((el) => el.id === autor.id)
        : -1;

      return {
        message: 'Ok',
        ok: true,
        course,
        isSubscribe: subscribeIndex >= 0,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        error: e,
        status: 501,
      };
    }
  }

  async subscribe(body: SubscribeContract, headers: any) {
    try {
      const course = await this.courseReposity.findOne({
        where: { id: body.course },
      });

      if (!course || !course.show) {
        return {
          message: 'Курс не найден',
          ok: false,
          status: 404,
        };
      }

      const user = await getAutor(headers);

      if (!user || !user.ok) {
        return {
          message: 'Необходимо авторизоваться',
          status: 401,
          ok: false,
        };
      }

      if (user.banned) {
        return {
          message:
            'Вы не можете подписаться на курс, так как были заблокированы',
          ok: false,
          banReason: user.banReason,
          status: 301,
        };
      }

      await this.courseReposity.update(
        {
          ...course,
          subscribersId: [...course.subscribersId, user.id],
        },
        { where: { id: course.id } },
      );

      return {
        message: 'Вы успешно подписались на курс!',
        ok: true,
        status: 200,
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
