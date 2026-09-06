import Link from "next/link";

interface WorkshopCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  capacity: number;
  registrationCount: number;
  category: string;
  imageUrl?: string | null;
}

const categoryColors: Record<string, string> = {
  "Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "AI & Data": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Cybersecurity": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Programming": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Design": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function WorkshopCard({
  id,
  title,
  description,
  date,
  location,
  price,
  capacity,
  registrationCount,
  category,
  imageUrl,
}: WorkshopCardProps) {
  const spotsLeft = capacity - registrationCount;
  const isFull = spotsLeft <= 0;
  const badgeColor = categoryColors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${badgeColor}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              {date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              {location}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{(price / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <span className={`text-xs font-medium ${
              isFull ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"
            }`}>
              {isFull ? "Sold Out" : `${spotsLeft} seats left`}
            </span>
          </div>

          <Link
            href={`/workshop/${id}`}
            className={`mt-3 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
              isFull
                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                : "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            }`}
          >
            {isFull ? "Sold Out" : "View Workshop"}
          </Link>
        </div>
      </div>
    </div>
  );
}
