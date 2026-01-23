import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/SignUp.dto';
import { auth } from '../lib/auth';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
  async SignUp(signUp: SignUpDto) {
    const { email, password, name } = signUp;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return result;
  }

  async SignIn(signIn: SignInDto) {
    const { email, password } = signIn;

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return result;
  }
}
