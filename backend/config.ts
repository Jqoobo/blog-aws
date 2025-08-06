import Joi from 'joi';

const envSchema = Joi.object({
  MONGODB_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(2527),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);
if (error) {
  console.error('⛔️ Configuration error:', error.message);
  process.exit(1);
}

export default {
  mongodbUrl: env.MONGODB_URL as string,
  jwtSecret: env.JWT_SECRET as string,
  port: env.PORT as number,
  isProd: env.NODE_ENV === 'production',
};
