import React from "react";
import "./style";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Provider } from "mobx-react";
import store from "./store";
import { hot } from "react-hot-loader/root";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";

import Loadable from "react-loadable";
const LoadableBar = function(loader) {
  return Loadable({
    loader,
    loading() {
      return null;
    }
  });
};
const Login = LoadableBar(() => import("page/login"));
const Menu = LoadableBar(() => import("components/Menu"));

import { get } from "utils/request";
import { inject, observer } from "mobx-react";

import { Provider as ProviderForRedux } from "react-redux";
import storeForRedux from "src/pages/ReduxTodo/store";
import ReduxTodo from "src/pages/ReduxTodo";

//权限路由
@inject("configStore")
@observer
class AuthRoute extends React.Component {
  componentDidMount() {
    console.log("挂载了！！！");
  }
  render() {
    const { component: Comp, ...rest } = this.props;
    const { tokenId } = this.props.configStore;
    return (
      <Route
        {...rest}
        render={props =>
          tokenId ? (
            <Comp {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { redirect: props.location.pathname }
              }}
            />
          )
        }
      />
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    this.getConfigInfo();
  }
  //获取配置信息
  async getConfigInfo() {
    const res = await get("/api/info");
    if (res.success) {
      localStorage.setItem("configInfo", JSON.stringify(res.data));
      //业务系统合约--configInfo.appContractAddress
      //token合约---configInfo.tokenContractAddress
      //usdi小数位数--configInfo.usdiDecimals
      //百分比表示小数位数 1000=>0.1=>10%--configInfo.rateDecimals
      //nuls小数位数--configInfo.nulsDecimals
    } else {
      localStorage.removeItem("configInfo");
    }
  }
  render() {
    return (
      <Provider {...store}>
        <BrowserRouter>
          <ConfigProvider locale={zhCN}>
            <Switch>
              <Route path="/login" exact component={Login} />
              <AuthRoute path="/" component={Menu} />
            </Switch>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

class AppForRedux extends React.Component {
  render() {
    return (
      <ProviderForRedux store={storeForRedux}>
        <ConfigProvider locale={zhCN}>
          <ReduxTodo />
        </ConfigProvider>
      </ProviderForRedux>
    );
  }
}

// export default hot(AppForRedux);
export default hot(App);
