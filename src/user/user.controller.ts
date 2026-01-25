import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
/**
 * Get => return the user Info
 * post => update user name(requaire) , image
 */
@Controller('me')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUser(@Req() req: Request) {
    return this.userService.getUser(req);
  }

  @Post()
  async updateUser(@Req() req: Request, @Body() updaetUser: UpdateUserDto) {
    return this.userService.updateUser(req, updaetUser);
  }
}
