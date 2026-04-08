import { ArrowRight, Layers, Zap, Briefcase } from "lucide-react";
import Link from "next/link";
import { demos } from "@/schemas";
import { Footer } from "@/components/Footer";
import { AnimatedGrid, AnimatedCard } from "@/components/AnimatedCards";

const categories = [
  {
    key: "field-types" as const,
    label: "Field Types",
    icon: Layers,
  },
  {
    key: "features" as const,
    label: "Features",
    icon: Zap,
  },
  {
    key: "real-world" as const,
    label: "Real-World",
    icon: Briefcase,
  },
];

function DemoCard({ demo }: { demo: (typeof demos)[number] }) {
  const fieldCount = demo.schema.sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const sectionCount = demo.schema.sections.length;

  return (
    <Link
      href={`/demo/${demo.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-foreground leading-snug">
          {demo.title}
        </h3>
        <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {demo.description}
      </p>
      <div className="flex items-center gap-2 mt-auto pt-1">
        <span className="text-xs text-muted-foreground/70">
          {fieldCount} fields
        </span>
        <span className="text-muted-foreground/30">&middot;</span>
        <span className="text-xs text-muted-foreground/70">
          {sectionCount} {sectionCount === 1 ? "section" : "sections"}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 pt-16 pb-14 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            FieldCraft{" "}
            <span className="text-primary">Demos</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Interactive examples of every field type, feature, and real-world
            form pattern. Click any card to try it live.
          </p>
        </div>
      </header>

      {/* Demo grid */}
      <main className="mx-auto max-w-4xl px-6 py-12 flex-1">
        {categories.map((cat) => {
          const catDemos = demos.filter((d) => d.category === cat.key);
          if (catDemos.length === 0) return null;
          const Icon = cat.icon;
          return (
            <section key={cat.key} className="mb-12 last:mb-0">
              <div className="flex items-center gap-2.5 mb-4">
                <Icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </h2>
              </div>
              <AnimatedGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {catDemos.map((demo) => (
                  <AnimatedCard key={demo.id}>
                    <DemoCard demo={demo} />
                  </AnimatedCard>
                ))}
              </AnimatedGrid>
            </section>
          );
        })}
      </main>

      <Footer />
    </>
  );
}
