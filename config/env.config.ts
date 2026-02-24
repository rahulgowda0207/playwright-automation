import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  dev: {
    baseUrl: process.env.DEV_BASE_URL,
  },
  qa: {
    baseUrl: process.env.QA_BASE_URL,
  },
  stage: {
    baseUrl: process.env.STAGE_BASE_URL,
  },
  prod: {
    baseUrl: process.env.PROD_BASE_URL,
  },
};
