import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'fittrack-pro',
  port: parseInt(process.env.APP_PORT ?? '3000'),
  env: process.env.NODE_ENV,
}));
