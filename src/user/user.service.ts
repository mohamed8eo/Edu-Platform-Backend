/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../lib/auth';
import { db } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  public async getUserId(req: Request) {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    return session?.user;
  }
  async getUser(req: Request) {
    const userInfo = await this.getUserId(req);
    if (!userInfo?.id) return null;
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userInfo?.id));
    return userData;
  }

  async updateUser(req: Request, updateUser: UpdateUserDto) {
    const { name, image } = updateUser;
    const userInfo = await this.getUserId(req);
    if (!userInfo?.id) throw new Error('User not found');

    await db.update(user).set({ name, image }).where(eq(user.id, userInfo.id));
    return this.getUser(req);
  }
}
