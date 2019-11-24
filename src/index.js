import React from 'react';
import ReactDom from 'react-dom';
import App from "./router/index.js";
import { BrowserRouter,HashRouter} from "react-router-dom";
import { AppContainer } from "react-hot-loader";

function renderWithHotReload(App) {
  ReactDom.render(
    <AppContainer>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppContainer>,document.getElementById("app")
  );
}

renderWithHotReload(App);

if (module.hot) {
  module.hot.accept("./router/index.js", () => {
    const Router = require("./router/index.js").default;
    renderWithHotReload(Router);
  });
}
