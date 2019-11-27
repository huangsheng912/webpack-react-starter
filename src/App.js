import React from 'react';
import Router from "./router/index.js";
import './style'
import { BrowserRouter} from "react-router-dom";
import { hot } from "react-hot-loader";

const App = ()=> {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )}

export default hot(module)(App)

