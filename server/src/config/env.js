const port = Number(process.env.PORT) || 3001;

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV ?? "development",
};
