import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to access this page. This area is restricted to administrators only.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
