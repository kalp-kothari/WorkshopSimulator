import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import { RegistrationStatus } from "@/components/registration-status";
import Link from "next/link";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, string> = {
  "Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "AI & Data": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Cybersecurity": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Programming": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Design": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          registrations: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  if (!workshop) {
    notFound();
  }

  const existingRegistration = await prisma.registration.findUnique({
    where: {
      userId_workshopId: {
        userId: session.user.id,
        workshopId: id,
      },
    },
  });

  const spotsLeft = workshop.capacity - workshop._count.registrations;
  const isFull = spotsLeft <= 0;
  const isAlreadyRegistered = existingRegistration?.status === "CONFIRMED";
  const badgeColor = categoryColors[workshop.category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Back link */}
      <Link
        href="/#workshops"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Back to Workshops
      </Link>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 sm:h-72 dark:from-gray-800 dark:to-gray-700">
          {workshop.imageUrl ? (
            <img src={workshop.imageUrl} alt={workshop.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* Category & Title */}
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor}`}>
            {workshop.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {workshop.title}
          </h1>

          {/* Meta info */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {workshop.date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{workshop.location}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Capacity</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{workshop.capacity} seats</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Available</p>
              <p className={`mt-1 text-sm font-semibold ${isFull ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                {isFull ? "Sold Out" : `${spotsLeft} seats`}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About this Workshop</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 whitespace-pre-line dark:text-gray-400">
              {workshop.description}
            </p>
          </div>

          {/* Payment */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            {isAlreadyRegistered ? (
              <div className="text-center">
                <div className="mb-3">
                  <RegistrationStatus status="CONFIRMED" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  You&apos;re registered! Check your email for details.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Go to Dashboard →
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{(workshop.price / 100).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">One-time payment</span>
                </div>
                <CheckoutButton
                  workshopId={workshop.id}
                  price={workshop.price}
                  disabled={isFull}
                />
                <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                  Secure payment via Stripe. You&apos;ll receive a confirmation email.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
