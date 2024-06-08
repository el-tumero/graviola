import { createBrowserRouter } from "react-router-dom"
// pages
import Root from "./pages/Root"
import Generate from "./pages/Generate"
import Collection from "./pages/Collection"
import Error from "./pages/Error"
import TradeUp from "./pages/TradeUp"

export const routerPaths = {
    root: "/",
    generate: "/generate",
    collection: "/collection",
    tradeup: "/tradeup",
}

const router = createBrowserRouter(
    [
        {
            path: routerPaths.root,
            element: <Root />,
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
