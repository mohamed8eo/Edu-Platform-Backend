/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { TrafficLog } from './dto/trafficLog.dto';
import { db } from '../db';
import { eq, gte, isNotNull, sql } from 'drizzle-orm';
import { trafficLogs, user } from '../db/schema';
import { auth } from '../lib/auth';
import type { Request } from 'express';
import { BanUserDto } from './dto/banUser.dto';

// const DEFAULT_BAN_DURATION = Number(process.env.DEFAULT_BAN_DURATION);
@Injectable()
export class TrafficService {
  private readonly logger = new Logger('TrafficService');

  async log(data: TrafficLog) {
    await db.insert(trafficLogs).values({
      method: data.method,
      path: data.path,
      statusCode: data.statusCode,
      durationMs: data.durationMs,
      ip: data.ip,
      userAgent: data.userAgent,
      userId: data.userId,
      createdAt: data.timestamp,
    });
  }

  async getDailyTraffic() {
    return db
      .select({
        day: sql<string>`DATE(${trafficLogs.createdAt})`,
        requests: sql<number>`COUNT(*)`,
      })
      .from(trafficLogs)
      .groupBy(sql`DATE(${trafficLogs.createdAt})`)
      .orderBy(sql`DATE(${trafficLogs.createdAt})`);
  }
  async getTopEndpoints() {
    return db
      .select({
        path: trafficLogs.path,
        hits: sql<number>`COUNT(*)`,
      })
      .from(trafficLogs)
      .groupBy(trafficLogs.path)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);
  }

  async getSlowEndpoints() {
    return db
      .select({
        path: trafficLogs.path,
        avgDuration: sql<number>`AVG(${trafficLogs.durationMs})`,
      })
      .from(trafficLogs)
      .groupBy(trafficLogs.path)
      .orderBy(sql`AVG(${trafficLogs.durationMs}) DESC`)
      .limit(10);
  }

  async getErrorStats() {
    return db
      .select({
        statusCode: trafficLogs.statusCode,
        count: sql<number>`COUNT(*)`,
      })
      .from(trafficLogs)
      .where(gte(trafficLogs.statusCode, 400))
      .groupBy(trafficLogs.statusCode)
      .orderBy(trafficLogs.statusCode);
  }

  async getActiveUsers() {
    const result = await db
      .select({
        userId: trafficLogs.userId,
      })
      .from(trafficLogs)
      .where(isNotNull(trafficLogs.userId))
      .groupBy(trafficLogs.userId);

    // Returns array of { userId: string }
    return result.map((r) => r.userId);
  }

  async getUserInfo(userId: string) {
    const userInfo = await db.select().from(user).where(eq(user.id, userId));
    if (userInfo.length === 0) throw new Error('User not found');
    return userInfo[0];
  }

  async getAllUsers(req: Request) {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = parseInt(req.query.limit as string) || 10;
    const pageSize = limit > 10 ? 10 : limit;

    return await auth.api.listUsers({
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sortBy: 'name',
        sortDirection: 'desc',
        filterField: 'role',
        filterValue: 'admin',
        filterOperator: 'ne',
      },
      headers: req.headers as any,
    });
  }
  private parseDuration(value: string): number {
    if (value.endsWith('d')) return Number(value.slice(0, -1)) * 86400;
    if (value.endsWith('h')) return Number(value.slice(0, -1)) * 3600;
    if (value.endsWith('m')) return Number(value.slice(0, -1)) * 60;
    return Number(value);
  }

  async banUser(banUser: BanUserDto, res: Request, id: string) {
    const { banReason, banExpiresIn } = banUser;
    const parsedDuration = banExpiresIn
      ? this.parseDuration(banExpiresIn)
      : Number(process.env.DEFAULT_BAN_DURATION);

    await auth.api.banUser({
      body: {
        userId: id,
        banReason,
        banExpiresIn: parsedDuration,
      },
      headers: res.headers as any,
    });

    return {
      message: 'User banned successfully',
    };
  }

  async unbinUser(userId: string, res: Request) {
    await auth.api.unbanUser({
      body: {
        userId,
      },
      headers: res.headers as any,
    });
  }
}
