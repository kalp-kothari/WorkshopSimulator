import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Payment Cancelled</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Your payment was not completed. No charges have been made. You can try again whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Browse Workshops
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
