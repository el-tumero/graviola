import React from "react"
import ReactDOM from "react-dom/client"
import router from "./router"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App>
            <RouterProvider router={router} />
        </App>
    </React.StrictMode>,
)
