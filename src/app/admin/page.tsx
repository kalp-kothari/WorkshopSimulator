import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RegistrationStatus } from "@/components/registration-status";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const workshops = await prisma.workshop.findMany({
    include: {
      registrations: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          registrations: { where: { status: "CONFIRMED" } },
        },
      },
    },
    orderBy: { date: "asc" },
  });

  const totalRegistrations = workshops.reduce(
    (sum, w) => sum + w._count.registrations, 0
  );
  const totalRevenue = workshops.reduce(
    (sum, w) =>
      sum +
      w.registrations
        .filter((r) => r.status === "CONFIRMED" && r.amountPaid)
        .reduce((s, r) => s + (r.amountPaid || 0), 0),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage workshops and view all registered attendees.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Workshops</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{workshops.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmed Registrations</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalRegistrations}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
            ₹{(totalRevenue / 100).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Tables */}
      {workshops.map((workshop) => (
        <div
          key={workshop.id}
          className="mb-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{workshop.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {workshop.date.toLocaleDateString("en-IN", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}{" "}
                  — {workshop._count.registrations}/{workshop.capacity} spots filled
                </p>
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                ₹{(workshop.price / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {workshop.registrations.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No registrations yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Attendee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {workshop.registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {reg.user.name || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {reg.user.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <RegistrationStatus status={reg.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {reg.amountPaid ? `₹${(reg.amountPaid / 100).toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {reg.createdAt.toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
