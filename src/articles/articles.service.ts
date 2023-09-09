import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { ArticleModel } from './models/ArticleModel';
import { CreateArticleCotract } from './contracts/CreateArticles.contract';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import { Op } from 'sequelize';
import getTransplit from 'src/vendor/getTranslate/getTranslate';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(UserModel) private userReposity: typeof UserModel,
    @InjectModel(ArticleModel) private articleReposity: typeof ArticleModel,
  ) {}

  async createArticle(body: CreateArticleCotract, headers: any) {
    try {
      const autor = await getAutor(headers);

      if (!autor.ok || autor.role !== 'ADMIN') {
        return {
          status: 401,
          message: 'Недостаточно прав для создания статьи',
          ok: false,
        };
      }

      const href = getTransplit(body.title);

      const article = await this.articleReposity.create({
        ...body,
        href,
        autorId: autor.id,
      });

      return {
        ok: true,
        message: 'Статья успешно создана',
        article,
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

  async getArticle(href: string, headers) {
    try {
      const article = await this.articleReposity.findOne({
        where: { href },
        include: [{ model: UserModel }],
      });

      if (!article) {
        return {
          message: 'Статья не найден',
          status: 404,
          ok: false,
        };
      }

      if (!article.show) {
        const { role } = await getAutor(headers);

        if (role !== 'ADMIN' && role !== 'ROOT') {
          return {
            status: 404,
            message: 'Статья не найдена',
            ok: false,
          };
        } else {
          return {
            message: 'Ok',
            ok: true,
            article,
            status: 200,
          };
        }
      }

      return {
        message: 'Ok',
        ok: true,
        article,
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

  async getMany(query) {
    try {
      const {
        limit = 5,
        offset = 0,
        title = '',
        description = '',
        body = '',
      } = query;

      const articles = await this.articleReposity.findAll({
        limit,
        offset,
        where: {
          show: true,
          title: {
            [Op.iLike]: `%${title}%`,
          },
          description: {
            [Op.iLike]: `%${description}%`,
          },
          body: {
            [Op.iLike]: `%${body}%`,
          },
        },
        include: [{ model: UserModel }],
        order: [['updatedAt', 'DESC']],
      });

      const articlesCount = await this.articleReposity.count({
        where: { show: true },
      });
      const pages =
        articlesCount / limit > 1 ? Math.ceil(articlesCount) / limit : 1;
      const nextPageAvaible = pages > 1 ? true : false;
      const activePage = Math.ceil(offset / limit)
        ? Math.ceil(offset / limit)
        : 1;

      return {
        message: 'Статьи получены',
        ok: true,
        status: 200,
        articles,
        pagination: {
          count: articlesCount,
          nextPageAvaible,
          activePage,
        },
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

  async updateArticle(body: CreateArticleCotract, headers) {
    try {
      const { role } = await getAutor(headers);

      if (role !== 'ADMIN' && role !== 'ROOT') {
        return {
          status: 301,
          message: 'У вас недостаточно прав для редактирования этой статьи',
          ok: false,
        };
      }

      const href = getTransplit(body.title);

      await this.articleReposity.update({ ...body, href }, { where: { href } });

      return {
        message: 'Статья успешно измененна',
        ok: true,
        status: 200,
      };
    } catch (e) {
      return {
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
      };
    }
  }
}
