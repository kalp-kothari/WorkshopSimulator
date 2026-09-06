import { prisma } from "@/lib/prisma";
import { WorkshopCard } from "@/components/workshop-card";
import { CategoryFilter } from "@/components/category-filter";
import { Suspense } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function WorkshopGrid({ category }: { category?: string }) {
  const workshops = await prisma.workshop.findMany({
    where: category ? { category } : undefined,
    include: {
      _count: {
        select: {
          registrations: {
            where: { status: "CONFIRMED" },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  if (workshops.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center dark:border-gray-700 dark:bg-gray-900">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">No workshops found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Check back soon for new workshops!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workshops.map((workshop) => (
        <WorkshopCard
          key={workshop.id}
          id={workshop.id}
          title={workshop.title}
          description={workshop.description}
          date={workshop.date}
          location={workshop.location}
          price={workshop.price}
          capacity={workshop.capacity}
          registrationCount={workshop._count.registrations}
          category={workshop.category}
          imageUrl={workshop.imageUrl}
        />
      ))}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Learn Skills That
            <br />
            <span className="text-primary-600 dark:text-primary-400">Actually Matter.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Expert-led, hands-on workshops designed to take you from concept to
            production. Real projects, real skills, real results.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#workshops"
              className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Explore Workshops
            </a>
            <Link
              href="/login"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Sign In
            </Link>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-100/50 blur-3xl dark:bg-primary-900/20" />
          <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Secure Login</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Sign in with Google or GitHub — no passwords needed.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Easy Payments</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Secure checkout powered by Stripe.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Instant Confirmation</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Professional confirmation email right after payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section id="workshops" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Explore Workshops
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Find the perfect workshop for your learning goals.
              </p>
            </div>
            <Suspense>
              <CategoryFilter />
            </Suspense>
          </div>

          <div className="mt-8">
            <WorkshopGrid category={category} />
          </div>
        </div>
      </section>
    </div>
  );
}
