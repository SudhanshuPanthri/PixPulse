import { SignIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const user = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <Link href="/">
          <h1 className="text-base font-bold md:text-2xl">PixPulse</h1>
        </Link>
      </div>
      {user.isSignedIn ? (
        <UserButton />
      ) : (
        <Link
          href="/sign-in"
          className="w-24 flex items-center justify-center transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Header;
