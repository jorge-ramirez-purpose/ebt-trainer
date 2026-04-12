import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { MarkedProvider } from "./context/MarkedContext";
import { ThemeToggle } from "./components/ThemeToggle";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MarkedProvider>
          <ThemeToggle />
          <App />
        </MarkedProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
