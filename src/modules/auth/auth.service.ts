import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { hash, compare } from '../../common/utils/hash.utils';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,

    private readonly jwtService: JwtService,
  ) {}

  /* ------------------------------------------------------------------ */
  /* TOKEN ISSUANCE */
  /* ------------------------------------------------------------------ */
  private async createRefreshToken(userId: string): Promise<string> {
    const rawToken = randomUUID(); // opaque
    const tokenHash = await bcrypt.hash(rawToken, 10);

    const expiresAt = new Date();
    expiresAt.setTime(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const tokenEntity = await this.refreshTokenRepo.save({
      userId,
      tokenHash,
      expiresAt,
    });

    return `${tokenEntity.id}.${rawToken}`;
  }

  private async createAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  private async issueTokens(user: User) {
    const refreshToken = await this.createRefreshToken(user.id);
    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  /* ------------------------------------------------------------------ */
  /* SIGNUP */
  /* ------------------------------------------------------------------ */
  async signup(dto: SignupDto) {
    const hashedPassword = await hash(dto.password);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
    });
    await this.userRepository.save(user);
    return await this.issueTokens(user);
  }

  /* ------------------------------------------------------------------ */
  /* LOGIN */
  /* ------------------------------------------------------------------ */

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.issueTokens(user);
  }

  /* ------------------------------------------------------------------ */
  /* LOGOUT */
  /* ------------------------------------------------------------------ */

  async logout(refreshToken: string) {
    const [id, rawToken] = refreshToken.split('.');
    const tokenEntity = await this.refreshTokenRepo.findOneBy({ id });
    if (!tokenEntity) return;

    const valid = await compare(rawToken, tokenEntity.tokenHash);
    if (valid) {
      tokenEntity.revoked = true;
      await this.refreshTokenRepo.save(tokenEntity);
    }
  }

  /* ------------------------------------------------------------------ */
  /* REFRESH TOKEN ROTATION */
  /* ------------------------------------------------------------------ */

  async refresh(refreshToken: string) {
    const [id, rawToken] = refreshToken.split('.');
    const tokenEntity = await this.refreshTokenRepo.findOneBy({ id });
    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenEntity.revoked) {
      await this.refreshTokenRepo.update(
        { userId: tokenEntity.userId },
        { revoked: true },
      );
      throw new ForbiddenException('Token reuse detected');
    }
    const valid = await compare(rawToken, tokenEntity.tokenHash);
    if (!valid || tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    tokenEntity.revoked = true;
    await this.refreshTokenRepo.save(tokenEntity);

    const user = await this.userRepository.findOneByOrFail({
      id: tokenEntity.userId,
    });

    return await this.issueTokens(user);
  }
}
