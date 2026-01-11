import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  autoLoadEntities: boolean;
  logging: boolean;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? 'ravinder',
    password: process.env.DB_PASSWORD ?? ' ',
    name: process.env.DB_NAME ?? 'fittrack-pro',
    synchronize: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    logging: process.env.DB_LOGGING === 'true',
  }),
);
