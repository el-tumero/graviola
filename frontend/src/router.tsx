import { createBrowserRouter } from "react-router-dom";
// pages
import App from "./App";
import Generate from "./pages/Generate";

export const routerPaths = {
    root: "/",
    generate: "/generate"
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/generate",
        element: <Generate />
    }
])

export default router