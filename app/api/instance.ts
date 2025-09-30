import fetches from "@siberiacancode/fetches";

export const api = fetches.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
});
