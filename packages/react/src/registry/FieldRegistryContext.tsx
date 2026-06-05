import { createContext, useContext } from "react";
import type { FieldRegistry } from "./field-registry";

const FieldRegistryContext = createContext<FieldRegistry>({});

export function FieldRegistryProvider({
  registry,
  children,
}: {
  registry: FieldRegistry;
  children: React.ReactNode;
}) {
  return (
    <FieldRegistryContext.Provider value={registry}>
      {children}
    </FieldRegistryContext.Provider>
  );
}

export function useFieldRegistry(): FieldRegistry {
  return useContext(FieldRegistryContext);
}
