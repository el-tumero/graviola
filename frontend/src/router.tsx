import { createBrowserRouter } from "react-router-dom";
// pages
import Root from "./pages/Root";
import Generate from "./pages/Generate";

export const routerPaths = {
    root: "/",
    generate: "/generate"
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/generate",
        element: <Generate />
    }
])

export default router