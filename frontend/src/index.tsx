import "./wdyr";

import "core-js/stable";
import "regenerator-runtime/runtime";

import * as React from "react";
import { render } from "react-dom";

import App from "./App";

(App as any).whyDidYouRender = true;

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.querySelector("#root")
);

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.querySelector("#root")
);
