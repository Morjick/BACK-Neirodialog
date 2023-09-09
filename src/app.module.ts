import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { UserModel } from './user/models/UserModel';
import { ProductModule } from './product/product.module';
import { ProductModel } from './product/models/ProductModel';
import { CartModule } from './cart/cart.module';
import { CartModel } from './cart/models/CartModel';
import { CartItemModel } from './cart/models/CartItemModel';
import { ResponseModule } from './response/response.module';
import { ResponseModel } from './response/models/ResponseModel';
import { StaticModule } from './static/static.module';
import { OrderModule } from './order/order.module';
import { OrderModel } from './order/models/OrderModel';
import { AddressModule } from './address/address.module';
import { AddressModel } from './address/models/AddressModel';
import { StatisticsModule } from './statistics/statistics.module';
import { ArticlesModule } from './articles/articles.module';
import { ArticleModel } from './articles/models/ArticleModel';
import { CoursesModule } from './courses/courses.module';
import { CourseModel } from './courses/models/CourseModel';
import { UserCourseModel } from './user/models/UserCourse';
import { SupportModule } from './support/support.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      models: [
        UserModel,
        ProductModel,
        CartModel,
        CartItemModel,
        ResponseModel,
        OrderModel,
        AddressModel,
        ArticleModel,
        CourseModel,
        UserCourseModel,
      ],
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
      logging: false,
    }),
    UserModule,
    ProductModule,
    CartModule,
    ResponseModule,
    StaticModule,
    OrderModule,
    AddressModule,
    StatisticsModule,
    ArticlesModule,
    CoursesModule,
    SupportModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
