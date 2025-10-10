if (process.argv.includes("--dev")) process.loadEnvFile();

type Env_variables = {
  PORT: string | number;
  MONGO_URI?: string;
  FRONTEND: string;
  SALT_ROUNDS: string | number;
  TOKEN_SECRET_KEY: string;
  TOKEN_EXPIRATION_TIME: string;
  TOKEN_NAME:string;
  EMAIL_USER:string;
  EMAIL_PASSWORD:string;
};

const env_variables:Env_variables = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND: process.env.FRONTEND || "http://localhost:5173",
  SALT_ROUNDS: process.env.SALT_ROUND || 10,
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY ?? "youncantknow",
  TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME ?? "15 days",
  TOKEN_NAME: process.env.TOKEN_NAME ?? 'chrono_dev_authentication_token',
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD!
};

if (!env_variables.MONGO_URI) {
  throw Error("MONGO_URI environment variable is required");
}
if (!env_variables.TOKEN_SECRET_KEY)
  throw Error("TOKEN_SECRET_KEY environment variable is required");

if (!env_variables.EMAIL_USER)
  throw Error("EMAIL_USER environment variable is required");

if (!env_variables.EMAIL_PASSWORD)
  throw Error("EMAIL_PASSWORD environment variable is required");

export { env_variables };
