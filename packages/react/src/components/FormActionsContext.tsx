import { createContext, useContext } from "react";

/**
 * Navigation actions a field component may need.
 *
 * Exists because `FieldProps` deliberately carries no engine reference — a
 * field receives its own value and callbacks and nothing more. That is the
 * right default for the 40-odd input fields, but a handful of *screen* types
 * (a welcome cover page, a thank-you screen) are chrome rather than inputs and
 * legitimately need to move the form on.
 *
 * Before this, `WelcomeScreenField` reached for
 * `document.querySelector('[data-question-index="1"]')` — an attribute that
 * existed nowhere in the package, so its Start button did nothing at all
 * (`REACT-13`). A context keeps the engine out of `FieldProps` while giving
 * those few components a real way to advance.
 *
 * Every action is optional. A component rendered outside `FormEngineRenderer`
 * gets an empty object and must degrade rather than throw.
 *
 * @since 1.11.0
 */
export type FormActions = {
  /** Advance a section (stepped/classic) or a question (conversational). */
  advance?: () => void;
  /** True when there is nothing further to advance to. */
  atEnd?: boolean;
};

const FormActionsContext = createContext<FormActions>({});

export function FormActionsProvider({
  actions,
  children,
}: {
  actions: FormActions;
  children: React.ReactNode;
}) {
  return (
    <FormActionsContext.Provider value={actions}>
      {children}
    </FormActionsContext.Provider>
  );
}

/**
 * Navigation actions for the current form, or an empty object when rendered
 * outside one. Callers must handle `advance` being undefined.
 */
export function useFormActions(): FormActions {
  return useContext(FormActionsContext);
}
