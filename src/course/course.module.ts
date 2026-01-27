import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from '../user/user.module';
import { CategorieModule } from '../categorie/categorie.module';

@Module({
  imports: [UserModule, CategorieModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
