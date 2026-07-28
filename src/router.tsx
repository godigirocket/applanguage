import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // The router's own scroll restoration was racing against
    // <ScrollToTop/> (root.tsx), which always scrolls to top on route
    // change — whichever won made pages open at an inconsistent scroll
    // position (sometimes still scrolled down from the previous page).
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
