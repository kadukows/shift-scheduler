import * as React from "react";
import { render } from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from "./App";

const unused = "seomthing";

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.querySelector("#root")
);
