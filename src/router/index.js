import React from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import loadable from '@loadable/component'

// import PageA from "../pages/PageA.jsx";
// import PageB from "../pages/PageB.jsx";
const PageA = loadable(()=>import('../pages/PageA'));
const PageB = loadable(()=>import('../pages/PageB'));
const PageC = loadable(()=>import('../pages/PageC'));
console.log(process.env.NULS_ENV,99)
const Router = () => (
  <div className="primary-layout">
    <header>
      <Link to="/">PageA</Link>
      <Link to="/b">PageB</Link>
      <Link to="/c">PageC</Link>
    </header>
    <main>
      <Switch>
        <Route path="/"  exact component={PageA} />
        <Route path="/b" exact component={PageB} />
        <Route path="/c" exact component={PageC} />
        <Redirect from='*' to='/'/>
      </Switch>
    </main>
  </div>
);
export default Router;