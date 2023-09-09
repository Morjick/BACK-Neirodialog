import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseModel } from './models/ResponseModel';
import { getAutor } from 'src/vendor/getAutor/getAutor';
import { CreateResponseContract } from './contracts/CreateResponse';
import { DeleteResponseContract } from './contracts/DeleteResponse';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(ResponseModel) private responseReposity: typeof ResponseModel,
  ) {}

  async createResponse(body: CreateResponseContract, headers) {
    try {
      const { autor, id } = await getAutor(headers);

      if (!autor) {
        return {
          message: 'Не удалось установить пользователя',
          ok: false,
          status: 401,
        };
      }

      const response = await this.responseReposity.create({
        productId: body.productId,
        userId: id,
        score: body.score,
        text: body.text,
      });

      return {
        message: 'Отзыв оставлен',
        ok: true,
        response,
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

  async deleteReposne(body: DeleteResponseContract) {
    try {
      const response = await this.responseReposity.findByPk(body.responseId);

      if (!response) {
        return {
          message: 'Отзыв не найден',
          ok: false,
          status: 404,
        };
      }

      await this.responseReposity.destroy({ where: { id: body.responseId } });

      return {
        message: 'Отзыв успешно удалён',
        ok: true,
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
}
