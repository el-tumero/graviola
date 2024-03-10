import { createBrowserRouter } from "react-router-dom";
// pages
import Root from "./pages/Root";
import Generate from "./pages/Generate";

export const routerPaths = {
    root: "/",
    generate: "/generate",
    gallery: "/gallery"
}

const router = createBrowserRouter([
    {
        path: routerPaths.root,
        element: <Root />,
    },
    {
        path: routerPaths.generate,
        element: <Generate />
    },
    {
        path: routerPaths.gallery,
        element: <></>
    }
])

export default router