import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth'; // Your Better Auth instance
import { AuthModule } from './auth/auth.module';
import { CategorieModule } from './categorie/categorie.module';
import { CourseModule } from './course/course.module';
import { TrafficModule } from './traffic/traffic.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    BetterAuthModule.forRoot({ auth }),
    AuthModule,
    CategorieModule,
    CourseModule,
    TrafficModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
