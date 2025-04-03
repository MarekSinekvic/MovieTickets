import { env } from "process";

export const ENTRYPOINT = env.ENTRYPOINT ? env.ENTRYPOINT : "http://localhost:8000/api";