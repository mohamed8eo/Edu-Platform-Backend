import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CategorieService } from '../categorie/categorie.service';
import type { Request } from 'express';
import { BanUserDto } from './dto/banUser.dto';
@Controller('admin')
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly categorieService: CategorieService,
  ) {}

  @Get('traffic/daily')
  async getDailyTraffic(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getDailyTraffic();
  }
  @Get('ttraffic/op-endpoints')
  async getTopEndpoints(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getTopEndpoints();
  }

  @Get('traffic/slow-endpoints')
  async getSlowEndpoints(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getSlowEndpoints();
  }

  @Get('traffic/error-stats')
  async getErrorStats(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getErrorStats();
  }

  @Get('traffic/active-users')
  async getActiveUsers(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getActiveUsers();
  }

  @Get('user/:id')
  async getUserInfo(@Req() req: Request, @Param('id') id: string) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getUserInfo(id);
  }

  @Get('all-users')
  async getAllUsers(@Req() req: Request) {
    const IsUseAdmin = await this.categorieService.getUserRole(req);
    if (!IsUseAdmin) {
      throw new Error('Unauthorized');
    }
    return this.trafficService.getAllUsers(req);
  }

  @Post('ban-user/:id')
  async banUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() banUser: BanUserDto,
  ) {
    return await this.trafficService.banUser(banUser, req, id);
  }
  @Post('unban-user/:id')
  async unbanUser(@Req() req: Request, @Param('id') id: string) {
    return await this.trafficService.unbinUser(id, req);
  }
}
