import { neon } from "@neondatabase/serverless";

export async function Login(email: string, password: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
  return data;
}

export async function AddUserName(username: string, email: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = sql`UPDATE users SET username = ${username} WHERE email = ${email}`;
  return data;
}
