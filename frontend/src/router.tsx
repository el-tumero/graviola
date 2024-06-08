import { createBrowserRouter } from "react-router-dom"
// pages
import Home from "./pages/Home"
import Generate from "./pages/Generate"
import Collection from "./pages/Collection"
import Error from "./pages/Error"
import TradeUp from "./pages/TradeUp"

export const routerPaths = {
    home: "/",
    generate: "/generate",
    collection: "/collection",
    tradeup: "/tradeup",
}

const router = createBrowserRouter(
    [
        {
            path: routerPaths.home,
            element: <Home />,
        },
        {
            path: routerPaths.generate,
            element: <Generate />,
        },
        {
            path: routerPaths.collection,
            element: <Collection />,
        },
        {
            path: routerPaths.tradeup,
            element: <TradeUp />,
        },
        {
            path: "*",
            element: <Error />,
        },
    ],
    {
        basename: import.meta.env.DEV ? "/" : "/graviola/",
    },
)

export default router
