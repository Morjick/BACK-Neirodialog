import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/user/models/UserModel';
import { CourseModel } from './models/CourseModel';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, JwtService],
  imports: [SequelizeModule.forFeature([UserModel, CourseModel])],
})
export class CoursesModule {}
