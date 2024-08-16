// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { Toaster } from "~/components/ui/sonner";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Book Inventory</Title>
          <Suspense>{props.children}</Suspense>
          <Toaster closeButton />
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
