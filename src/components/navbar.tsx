"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
const navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav>
      <div>
        <a href="#">Mystry Message</a>
        {
          <>
            session? (<span>Welcome, {user.username || user.email}</span>
            <Button onClick={() => signOut()}>LogOut</Button>
            ):(<Link href={"/sign-in"}>LogIn</Link>)
          </>
        }
      </div>
    </nav>
  );
};

export default navbar;
