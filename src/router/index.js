import React from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import loadable from '@loadable/component'

// import PageA from "../pages/PageA.jsx";
// import PageB from "../pages/PageB.jsx";
const PageA = loadable(()=>import('../pages/PageA'));
const PageB = loadable(()=>import('../pages/PageB'));
console.log(process.env.NULS_ENV,99)
const Router = () => (
  <div className="primary-layout">
    <header>
      <Link to="/">PageA</Link>
      <Link to="/b">PageB</Link>
    </header>
    <main>
      <Switch>
        <Route path="/"  exact component={loadable(()=>import('../pages/PageA'))} />
        <Route path="/b" exact component={loadable(()=>import('../pages/PageB'))} />
        <Redirect from='*' to='/'/>
      </Switch>
    </main>
  </div>
);
export default Router;