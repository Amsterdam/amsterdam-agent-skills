import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"

import "./styles/index.css"

const elem = document.getElementById("root")
if (!elem) {
  throw new Error("Root element #root not found in index.html")
}

createRoot(elem).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
