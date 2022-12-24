export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_CONNECTION: string;
      DB_PASSWORD: string;
      DB_USER: string;
      JWT_SECRET: string;
    }
  }
}
