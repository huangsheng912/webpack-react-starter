import React from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";

import PageA from "../pages/PageA.jsx";
import PageB from "../pages/PageB.jsx";

const Router = () => (
  <div className="primary-layout">
    <header>
      <Link to="/">PageA</Link>
      <Link to="/b">PageB</Link>
    </header>
    <main>
      <Switch>
        <Route path="/"  exact component={PageA} />
        <Route path="/b" exact component={PageB} />
        <Redirect from='*' to='/'/>
      </Switch>
    </main>
  </div>
);
export default Router;