import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleModel } from './models/ArticleModel';
import { UserModel } from 'src/user/models/UserModel';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [SequelizeModule.forFeature([UserModel, ArticleModel])],
})
export class ArticlesModule {}
