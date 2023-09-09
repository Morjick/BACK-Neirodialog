import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AdminGuard } from 'src/guards/admin.guards';
import { CreateCourseContract } from './contracts/CreateCourse.contract';
import { SubscribeContract } from './contracts/Subscribe.contract';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Курсы')
@Controller('courses')
export class CoursesController {
  constructor(private courseService: CoursesService) {}

  @Post('create-course')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'description', type: String })
  @ApiParam({ name: 'basePrice', type: Number })
  @ApiParam({ name: 'discount', type: Number })
  @ApiParam({ name: 'images', type: Array })
  async createCourse(@Body() body: CreateCourseContract, @Headers() headers) {
    return await this.courseService.createCourse(body, headers);
  }

  @Post('subscribe')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'course', type: Number })
  async subscribe(@Body() body: SubscribeContract, @Headers() headers) {
    return await this.courseService.subscribe(body, headers);
  }

  @Get('get-courses')
  async getCourses() {
    return await this.courseService.getCourses();
  }

  @Get('get-course/:href')
  async getCourse(@Param() param, @Headers() headers) {
    return await this.courseService.getCourse(param.href, headers);
  }
}
