/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import type { Request } from 'express';
import { CategorieService } from '../categorie/categorie.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly categoriesService: CategorieService,
  ) {}

  @Post()
  async creatCourse(
    @Body() createCourse: CreateCourseDto,
    @Req() req: Request,
  ) {
    const IsUseAdmin = await this.categoriesService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return await this.courseService.createCourse(createCourse);
  }

  @Patch('update/:slug')
  async updateCourse(
    @Param('slug') slug: string,
    @Body() updateCourse: UpdateCourseDto,
    @Req() req: Request,
  ) {
    const IsUseAdmin = await this.categoriesService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return await this.courseService.updateCourse(slug, updateCourse);
  }

  @Delete('delete/:slug')
  async deleteCourse(@Param('slug') slug: string, @Req() req: Request) {
    const IsUseAdmin = await this.categoriesService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return await this.courseService.deleteCourse(slug);
  }

  // GET http://localhost:3000/users/search?quary=html
  @Get('search')
  async searchCourses(@Query('query') query: string) {
    return await this.courseService.searchCourses(query);
  }

  @Get(':slug')
  async getCourse(@Param('slug') slug: string) {
    return await this.courseService.getCourse(slug);
  }

  @Get(':slug/lessons')
  async getCourseLessons(@Param('slug') slug: string) {
    return await this.courseService.getCourseLessons(slug);
  }
  @Post(':slug/lessons/:lessonId/progress')
  async updateLessonProgress(
    @Req() req: Request,
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @Body() body: UpdateLessonProgressDto,
  ) {
    const user = (req as any).user;
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Find courseId by slug
    const courseData = await this.courseService.getCourse(slug);
    const courseId = courseData.course.id;

    const { completed } = body;

    return this.courseService.markLessonProgress(
      user.id,
      courseId,
      lessonId,
      completed,
    );
  }
}
