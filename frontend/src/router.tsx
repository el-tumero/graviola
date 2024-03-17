import { createBrowserRouter } from "react-router-dom";
// pages
import Root from "./pages/Root";
import Generate from "./pages/Generate";
import Collection from "./pages/Collection";
import Error from "./pages/Error";

export const routerPaths = {
    root: "/",
    generate: "/generate",
    collection: "/collection"
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
        path: routerPaths.collection,
        element: <Collection />
    },
    {
        path: "*",
        element: <Error />
    }
])

export default router