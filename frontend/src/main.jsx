import React from "react"
import ReactDOM from "react-dom/client"
import router from "./router"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import App from "./App"
import store from "./redux/store"
import { Provider } from "react-redux"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <App>
                <RouterProvider router={router} />
            </App>
        </Provider>
    </React.StrictMode>,
)
