"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "All",
  "Web Development",
  "AI & Data",
  "Cybersecurity",
  "Programming",
  "Design",
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/?${params.toString()}#workshops`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? "bg-primary-600 text-white dark:bg-primary-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
