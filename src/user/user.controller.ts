import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddCourseDto } from './dto/add-course.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
/**
 * Get => return the user Info
 * post => update user name(requaire) , image
 */
@ApiTags('User')
@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'User info retrieved successfully.',
  })
  async getUser(@Req() req: Request) {
    return this.userService.getUser(req);
  }

  @Post()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 201, description: 'User updated successfully.' })
  async updateUser(@Req() req: Request, @Body() updaetUser: UpdateUserDto) {
    return this.userService.updateUser(req, updaetUser);
  }

  @Post('add-course')
  @ApiOperation({ summary: 'Add course to user' })
  @ApiResponse({ status: 201, description: 'Course added successfully.' })
  async addCourseToUser(
    @Req() req: Request,
    @Body() addCourseDto: AddCourseDto,
  ) {
    return this.userService.addCourseToUser(req, addCourseDto.courseId);
  }
}
