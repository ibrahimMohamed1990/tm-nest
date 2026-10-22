import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    if (await this.users.findByEmail(dto.email)) {
      throw new ConflictException('Email already in use');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create(dto.email, hash);
    return this.sign(user.id, user.email);
  }

  async login(dto: AuthDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.sign(user.id, user.email);
  }

  private async sign(sub: number, email: string) {
    return { access_token: await this.jwt.signAsync({ sub, email }) };
  }
}
