import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, RefreshTokenEntity]),
    // JWT (access token)
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
        secret: jwt.accessSecret,
        signOptions: {
          expiresIn: jwt.accessTokenTTL,
          audience: jwt.audience,
          issuer: jwt.issuer,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtAccessStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
