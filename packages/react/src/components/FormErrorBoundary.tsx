import { Component } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[FieldCraft] A field component crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm"
        >
          <p className="font-medium text-destructive">Something went wrong rendering this section.</p>
          <p className="mt-1 text-muted-foreground">
            Please refresh the page. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
