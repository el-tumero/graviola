import { createBrowserRouter } from "react-router-dom"
// pages
import Home from "./pages/Home"
import Generate from "./pages/Generate"
import Keywords from "./pages/Keywords"
import Drops from "./pages/Drops"
import Error from "./pages/Error"
import TradeUp from "./pages/TradeUp"

export const routerPaths = {
    home: "/",
    generate: "/generate",
    drops: "/drops",
    tradeup: "/tradeup",
    keywords: "/keywords",
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
            path: routerPaths.drops,
            element: <Drops />,
        },
        {
            path: routerPaths.tradeup,
            element: <TradeUp />,
        },
        {
            path: routerPaths.keywords,
            element: <Keywords />,
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
