import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RegistrationStatus } from "@/components/registration-status";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await auth();
  const { session_id } = await searchParams;

  if (!session?.user) {
    redirect("/login");
  }

  let registration = null;

  if (session_id) {
    registration = await prisma.registration.findUnique({
      where: { stripeSessionId: session_id },
      include: { workshop: true },
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Thank you for your registration. A confirmation email has been sent to your inbox.
        </p>

        {registration && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-left dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {registration.workshop.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {registration.workshop.date.toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <RegistrationStatus status={registration.status} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Confirmation #</span>
              <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                {registration.id.toUpperCase().slice(0, 12)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            Browse Workshops
          </Link>
        </div>
      </div>
    </div>
  );
}
