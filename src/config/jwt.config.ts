import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  audience?: string;
  issuer?: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
}

const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    audience: process.env.JWT_TOKEN_AUDIENCE!,
    issuer: process.env.JWT_TOKEN_ISSUER!,
    accessTokenTTL: parseInt(process.env.JWT_ACCESS_TTL ?? '3600', 10),
    refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TTL ?? '604800', 10),
  }),
);

export default jwtConfig;
