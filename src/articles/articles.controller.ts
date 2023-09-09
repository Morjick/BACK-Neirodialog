import {
  Controller,
  Post,
  Headers,
  UseGuards,
  Put,
  Get,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateArticleCotract } from './contracts/CreateArticles.contract';
import { AdminGuard } from 'src/guards/admin.guards';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private articleService: ArticlesService) {}

  @Post('create')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'description', type: String })
  @ApiParam({ name: 'body', type: String, required: false })
  @ApiParam({ name: 'avatar', type: String, required: false })
  @ApiParam({ name: 'tags', type: Array })
  async createArticle(@Body() body: CreateArticleCotract, @Headers() headers) {
    return await this.articleService.createArticle(body, headers);
  }

  @Put('update/:href')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'id', type: Number, required: false })
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'description', type: String })
  @ApiParam({ name: 'body', type: String, required: false })
  @ApiParam({ name: 'avatar', type: String, required: false })
  @ApiParam({ name: 'tags', type: Array })
  async updateArticle(@Body() body: CreateArticleCotract, @Headers() headers) {
    return await this.articleService.updateArticle(body, headers);
  }

  @Get('get-many')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'desctiprion', type: String, required: false })
  @ApiQuery({ name: 'body', type: String, required: false })
  async getMany(@Query() query) {
    return await this.articleService.getMany(query);
  }

  @Get('get-article/:href')
  async getArticle(@Param() param, @Headers() headers) {
    return await this.articleService.getArticle(param.href, headers);
  }
}
