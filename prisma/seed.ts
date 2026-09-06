import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workshops = [
  {
    id: "workshop-react-advanced",
    title: "Advanced React Workshop",
    description:
      "Master advanced React patterns including Server Components, Suspense, concurrent features, and performance optimization. This hands-on workshop covers real-world architecture patterns used by top engineering teams.\n\nYou'll build a production-grade application from scratch, learning component composition, state management at scale, and advanced hooks patterns. Perfect for developers who want to level up their React expertise.",
    date: new Date("2026-10-15T09:00:00Z"),
    location: "Online (Zoom)",
    price: 481000,
    capacity: 50,
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-nextjs-fullstack",
    title: "Full-Stack Next.js Workshop",
    description:
      "Build production-ready full-stack applications with Next.js App Router. Learn server actions, data fetching patterns, authentication, database integration with Prisma, and deployment strategies.\n\nThis workshop takes you from project setup to production deployment, covering middleware, API routes, caching, and ISR. You'll deploy a complete SaaS application by the end.",
    date: new Date("2026-10-22T09:00:00Z"),
    location: "Online (Google Meet)",
    price: 249900,
    capacity: 40,
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-python-datascience",
    title: "Python for Data Science",
    description:
      "Dive into data science with Python. Learn NumPy, Pandas, Matplotlib, and Scikit-learn through practical exercises on real-world datasets. From data cleaning to visualization to basic ML models.\n\nPerfect for developers, analysts, and anyone wanting to add data skills to their toolkit. No prior data science experience required — just basic Python knowledge.",
    date: new Date("2026-11-05T10:00:00Z"),
    location: "Bangalore, India",
    price: 199900,
    capacity: 35,
    category: "AI & Data",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-ml-fundamentals",
    title: "Machine Learning Fundamentals",
    description:
      "Understand the core concepts of machine learning from supervised and unsupervised learning to neural networks. Work through hands-on projects using TensorFlow and scikit-learn.\n\nLearn regression, classification, clustering, and deep learning basics. Build and evaluate ML models on real datasets, and understand when to use which algorithm.",
    date: new Date("2026-11-12T10:00:00Z"),
    location: "Online (Zoom)",
    price: 299900,
    capacity: 30,
    category: "AI & Data",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-cybersecurity",
    title: "Cybersecurity Essentials",
    description:
      "Learn the fundamentals of cybersecurity including threat modeling, network security, encryption, and secure coding practices. Hands-on labs with real-world attack and defense scenarios.\n\nCovers OWASP Top 10, penetration testing basics, incident response, and security compliance. Ideal for developers who want to build more secure applications.",
    date: new Date("2026-11-20T09:00:00Z"),
    location: "Delhi, India",
    price: 249900,
    capacity: 25,
    category: "Cybersecurity",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-java-oop",
    title: "Java & OOP Masterclass",
    description:
      "Deep dive into Java and Object-Oriented Programming. From SOLID principles to design patterns, generics, streams, and modern Java features (records, sealed classes, pattern matching).\n\nBuild a complete project applying clean architecture principles. Perfect for intermediate developers looking to write more maintainable, testable Java code.",
    date: new Date("2026-12-01T09:00:00Z"),
    location: "Online (Google Meet)",
    price: 199900,
    capacity: 45,
    category: "Programming",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-git-github",
    title: "Git & GitHub Masterclass",
    description:
      "Master version control with Git and collaboration with GitHub. Learn branching strategies, merge conflict resolution, rebasing, CI/CD with GitHub Actions, and open-source contribution workflows.\n\nFrom beginner to advanced: understand the Git internals, write better commit messages, and establish team workflows that scale.",
    date: new Date("2026-12-10T10:00:00Z"),
    location: "Online (Zoom)",
    price: 99900,
    capacity: 60,
    category: "Programming",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop",
  },
  {
    id: "workshop-uiux-developers",
    title: "UI/UX for Developers",
    description:
      "Bridge the gap between design and development. Learn typography, color theory, layout principles, accessibility, and user research methods — all from a developer's perspective.\n\nPractice with Figma, build a design system, and learn to translate designs into clean CSS. No design background required.",
    date: new Date("2026-12-18T09:00:00Z"),
    location: "Mumbai, India",
    price: 149900,
    capacity: 30,
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const workshop of workshops) {
    const result = await prisma.workshop.upsert({
      where: { id: workshop.id },
      update: {
        title: workshop.title,
        description: workshop.description,
        date: workshop.date,
        location: workshop.location,
        price: workshop.price,
        capacity: workshop.capacity,
        category: workshop.category,
        imageUrl: workshop.imageUrl,
      },
      create: workshop,
    });
    console.log(`  ✅ ${result.title} — ₹${(result.price / 100).toLocaleString("en-IN")}`);
  }

  // Optionally promote admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: {
        email: adminEmail,
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log(`  ✅ Admin: ${adminUser.email}`);
  }

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
