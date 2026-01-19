import dotenv from 'dotenv';
import { envConfig } from './env.config';

dotenv.config();

const ENV = process.env.ENV || 'qa';

export const config = {
  ...envConfig[ENV as keyof typeof envConfig],
  env: ENV,
};
