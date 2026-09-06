"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="text-primary-600 dark:text-primary-400">Workshop</span>Hub
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/#workshops"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                Workshops
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  Dashboard
                </Link>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {status === "loading" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700" />
            )}
            {status === "authenticated" && session && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.name}
                </span>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  Sign out
                </button>
              </div>
            )}
            {status === "unauthenticated" && (
              <Link
                href="/login"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-gray-200 pb-4 pt-2 dark:border-gray-800 md:hidden">
            <div className="space-y-1">
              <Link
                href="/#workshops"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Workshops
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Dashboard
                </Link>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950"
                >
                  Admin
                </Link>
              )}
              {status === "authenticated" && session && (
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Sign out ({session.user.name})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
