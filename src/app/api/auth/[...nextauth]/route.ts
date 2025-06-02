// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options";

export const handler = NextAuth(authOptions);

// 👇 export the supported HTTP methods
export { handler as GET, handler as POST };
