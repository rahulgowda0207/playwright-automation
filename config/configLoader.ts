import { envConfig } from './env.config';

const VALID_ENVS = ['dev', 'qa', 'stage', 'prod'] as const;
type ValidEnv = (typeof VALID_ENVS)[number];

const ENV = process.env.ENV || 'qa';

if (!(VALID_ENVS as readonly string[]).includes(ENV)) {
  throw new Error(
    `Invalid ENV value "${ENV}". Must be one of: ${VALID_ENVS.join(', ')}`
  );
}

const envKey = ENV as ValidEnv;
const baseUrl = envConfig[envKey].baseUrl;

if (!baseUrl) {
  throw new Error(
    `baseUrl for environment "${ENV}" is not set. ` +
      `Ensure ${ENV.toUpperCase()}_BASE_URL is defined in your .env file.`
  );
}

export const config = {
  baseUrl,
  env: ENV,
};
