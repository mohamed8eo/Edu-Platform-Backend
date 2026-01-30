import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHell() {
    return 'Hello Brother!!';
  }
}
