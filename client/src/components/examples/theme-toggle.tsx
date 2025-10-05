import { ThemeProvider } from "../theme-provider";
import { ThemeToggle } from "../theme-toggle";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}
