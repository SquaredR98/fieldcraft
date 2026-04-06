import type { Section } from "@squaredr/formengine-core";
import { cn } from "../utils/cn";

export type SectionNavigationProps = {
  sections: Section[];
  currentSectionId: string;
  visitedSectionIds: string[];
  onJumpTo: (sectionId: string) => void;
  className?: string;
};

export function SectionNavigation({
  sections,
  currentSectionId,
  visitedSectionIds,
  onJumpTo,
  className,
}: SectionNavigationProps) {
  return (
    <nav className={cn(className)} aria-label="Form sections">
      <ol className="flex flex-col gap-1 list-none">
        {sections.map((section, index) => {
          const isCurrent = section.id === currentSectionId;
          const isVisited = visitedSectionIds.includes(section.id);
          return (
            <li key={section.id}>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 w-full p-2 rounded-md text-sm text-left transition-colors",
                  isCurrent && "bg-primary/10 text-primary font-medium",
                  isVisited && !isCurrent && "text-foreground hover:bg-accent",
                  !isVisited && !isCurrent && "text-muted-foreground opacity-60",
                )}
                onClick={() => onJumpTo(section.id)}
                disabled={!isVisited && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                  isCurrent && "bg-primary text-primary-foreground",
                  isVisited && !isCurrent && "bg-muted text-muted-foreground",
                  !isVisited && !isCurrent && "bg-muted text-muted-foreground",
                )}>
                  {index + 1}
                </span>
                <span>{section.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
