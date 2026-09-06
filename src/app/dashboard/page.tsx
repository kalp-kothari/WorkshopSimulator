import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RegistrationStatus } from "@/components/registration-status";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: session.user.id },
    include: { workshop: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {session.user.name}! Here are your registrations.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
          <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
            No registrations yet
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse our workshops and register for one to get started.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Browse Workshops
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {reg.workshop.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {reg.workshop.date.toLocaleDateString("en-IN", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reg.workshop.location}
                  </p>
                </div>
                <RegistrationStatus status={reg.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  Confirmation: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{reg.id.toUpperCase().slice(0, 12)}</span>
                </span>
                {reg.amountPaid && (
                  <span>
                    Paid: <span className="font-medium text-gray-700 dark:text-gray-300">₹{(reg.amountPaid / 100).toLocaleString("en-IN")}</span>
                  </span>
                )}
                <span>
                  Registered: {reg.createdAt.toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
