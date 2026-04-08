"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormEngineRenderer } from "@squaredr/fieldcraft-react";
import type { FormResponse } from "@squaredr/fieldcraft-core";
import { demos } from "@/schemas";
import { SubmissionResult } from "@/components/SubmissionResult";
import { Footer } from "@/components/Footer";
import { useCallback, useState } from "react";

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export default function DemoPage() {
  const params = useParams();
  const demoId = params.id as string;
  const demo = demos.find((d) => d.id === demoId);

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormResponse | null>(null);

  const handleSubmit = useCallback(
    async (response: FormResponse) => {
      console.log(`[FieldCraft] Form "${demoId}" submitted:`, response);
      setSubmittedData(response);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [demoId]
  );

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setSubmittedData(null);
  }, []);

  if (!demo) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center gap-3 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-semibold text-foreground">
          Demo not found
        </h1>
        <p className="text-sm text-muted-foreground">
          No demo with ID &quot;{demoId}&quot; exists.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to demos
        </Link>
      </motion.div>
    );
  }

  const fieldCount = demo.schema.sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );
  const sectionCount = demo.schema.sections.length;

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Demos
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{demo.title}</span>
            <span>&middot;</span>
            <span>{fieldCount} fields</span>
            <span>&middot;</span>
            <span>
              {sectionCount} {sectionCount === 1 ? "section" : "sections"}
            </span>
          </div>
        </div>
      </header>

      {/* Form — fixed max-width prevents layout shift between steps */}
      <main className="flex-1 mx-auto w-full max-w-xl px-6 py-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {demo.title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {demo.description}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted && (
            <motion.div key="form" {...fadeSlide}>
              <FormEngineRenderer
                schema={demo.schema}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}

          {submitted && submittedData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <SubmissionResult data={submittedData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
