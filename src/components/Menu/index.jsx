import React from "react";
import Loadable from "react-loadable";
import "./index.less";
import config from "../../router/config";
import { Redirect, Route, Switch } from "react-router-dom";
import { post } from "utils/request";
import AsyncComponent from "page/AsyncComponent";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import {
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Dropdown,
  Avatar,
  Modal,
  Form,
  Input,
  message
} from "antd";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

@Form.create()
class PasswordModal extends React.Component {
  state = {
    show: false,
    confirmLoading: false
  };
  visible = () => {
    this.setState(state => ({
      show: !this.state.show
    }));
  };
  handleOk = async () => {
    const { validateFields, getFieldsValue } = this.props.form;
    validateFields(async err => {
      if (!err) {
        const info = getFieldsValue();
        this.setState({
          confirmLoading: true
        });
        const isSuccess = await this.props.confirm(info);
        this.setState({
          confirmLoading: false
        });
        if (isSuccess) {
          this.visible();
        }
      }
    });
  };
  handleCancel = () => {
    this.visible();
  };
  checkNewPs = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("newPassword")) {
      callback("两次输入密码不一致");
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <Modal
        title="修改密码"
        visible={this.state.show}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        ref={v => (this.psModal = v)}
        confirmLoading={this.state.confirmLoading}
        width="700px"
        afterClose={resetFields}
      >
        <Form.Item {...formItemLayout} label="原密码">
          {getFieldDecorator("oldPassword", {
            rules: [
              {
                required: true,
                message: "请输入原密码"
              }
            ],
            validateTrigger: ["onBlur"]
          })(<Input type="password" placeholder="请输入原密码" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="新密码">
          {getFieldDecorator("newPassword", {
            rules: [
              {
                required: true,
                message: "请输入新密码"
              },
              {
                pattern: /^[!-~]{6,16}$/,
                message: "密码由数字、字母、特殊符号组成，长度为6-16"
              }
            ],
            validateTrigger: ["onBlur"]
          })(<Input type="password" placeholder="请输入新密码" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="重复新密码">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "请再次输入新密码"
              },
              {
                validator: this.checkNewPs
              }
            ],
            validateTrigger: ["onBlur"]
          })(<Input type="password" placeholder="请再次输入新密码" />)}
        </Form.Item>
      </Modal>
    );
  }
}

class RenderRoute extends React.Component {
  //避免menu组件setState导致异步组件多次重复加载
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // console.log(nextProps,1,nextState,2,nextContext,3,this.props,4,location.pathname)
    if (
      this.props.currentPath === nextProps.currentPath ||
      !this.props.currentPath
    ) {
      return false;
    }
    return true;
  }
  renderRoute = config =>
    config.map(v => {
      if (!v.children) {
        const LoadableBar = Loadable({
          loader: () => import("../../pages" + v.value),
          loading() {
            return null;
          }
        });
        // const LoadableBar = AsyncComponent(() => import("../../pages" + v.value))
        return (
          <Route exact path={v.value} key={v.value} component={v.component} />
        );
      }
      return this.renderRoute(v.children);
    });
  render() {
    const { config, redirectPath } = this.props;
    if (!config.length) return null;
    return (
      <Switch>
        {this.renderRoute(config)}
        <Redirect from="/" to={redirectPath} />
      </Switch>
    );
  }
}

class TabRoute extends React.Component {
  clickTab = v => {
    if (!v.choose && this.props.clickTab) {
      this.props.clickTab(v.path);
    }
  };
  closeTab = (e, v) => {
    e.stopPropagation();
    if (this.props.closeTab) {
      this.props.closeTab(v.path);
    }
  };
  render() {
    const { tabData } = this.props;
    return (
      <div className="tab-route">
        <div className="tab-wrap scrollbar">
          {tabData.map((v, i) => (
            <span
              key={i}
              className={v.choose ? "active-tab tab-item" : "tab-item"}
              onClick={() => this.clickTab(v)}
            >
              {v.title}
              {tabData.length > 1 ? (
                <span onClick={e => this.closeTab(e, v)}>x</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

@inject("configStore")
@observer
class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      crumb: [],
      tabData: []
    };
    //从接口读取菜单
    // this.menuConfig = this.props.configStore.configInfo.menuConfig || [];
    //本地菜单
    this.menuConfig = config;
  }
  componentDidMount() {
    this.props.configStore.getRouteInfo(this.menuConfig);
    this.props.configStore.changeRoute(location.pathname + location.search);
    // console.log(toJS(this.props.configStore.routeInfo), '-=--==routeInfo')
    this.getDefaultKeys();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(prevProps,1,prevState,2,this.props,3,this.state,4,location.pathname)
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.configStore.changeRoute(
        this.props.location.pathname + this.props.location.search
      );
    }
  }

  //初始化时获取默认展开菜单和默认打开页面
  getDefaultKeys = () => {
    const urlList = location.pathname.split("/").filter(i => i);
    const openKeys = urlList.slice(0, urlList.length - 1);
    this.setState({
      openKeys
    });
  };
  //展开收缩菜单
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  //渲染侧边菜单
  renderMenuItem = config =>
    config.map(v => {
      if (!v.children) {
        if (v.detail) return null;
        return (
          <Menu.Item key={v.value}>
            {v.icon && <Icon type={v.icon} />}
            <span>{v.title}</span>
          </Menu.Item>
        );
      }
      return this.renderSubMenu(v);
    });
  //子菜单
  renderSubMenu = item => (
    <SubMenu
      key={item.value}
      title={
        <span>
          {item.icon && <Icon type={item.icon} />}
          <span>{item.title}</span>
        </span>
      }
    >
      {this.renderMenuItem(item.children)}
    </SubMenu>
  );
  //点击菜单跳转
  changeRoute = e => {
    if (e.key === location.pathname) return;
    // this.props.configStore.changeRoute(e.key);
    this.props.history.push(e.key);
  };
  //点击切换tab
  clickTab = path => {
    // this.props.configStore.changeRoute(path);
    this.props.history.push(path);
  };
  //点击关闭tab
  closeTab = path => {
    this.props.configStore.closeTab(path);
    const { toPath } = this.props.configStore;
    if (toPath) {
      this.props.history.push(toPath);
    }
  };

  openSubRoute = e => {
    this.setState({
      openKeys: e
    });
  };
  //渲染菜单路径标签
  renderBreadcrumb = arr => (
    <Breadcrumb>
      {arr.map((v, i) => (
        <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
  //修改密码弹窗
  showPsModal = () => {
    this.psModal.visible();
  };

  changePassword = async info => {
    const id = this.props.configStore.configInfo.userId;
    const { newPassword, oldPassword } = info;
    try {
      const res = await post("", "modifyPwd", { id, newPassword, oldPassword });
      if (res.result && res.result.result) {
        message.success("修改成功，请重新登录");
        this.logOut();
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    } catch (e) {
      return false;
    }
  };
  logOut = () => {
    this.props.configStore.clearLoginInfo();
    this.props.history.push({
      pathname: "/login",
      state: {
        redirect: location.pathname + location.search
      }
    });
  };
  //默认重定向路径
  getDefaultRoute = config => {
    let defaultRoute = "/";
    if (!config[0].children) {
      defaultRoute = config[0].value;
    } else {
      defaultRoute = config[0].children[0].value;
    }
    return defaultRoute;
  };
  render() {
    const {
      breadCrumb,
      selectKey,
      tabData,
      configInfo
    } = this.props.configStore;
    const { collapsed, openKeys } = this.state;
    const dropMenu = (
      <Menu>
        <Menu.Item onClick={this.showPsModal}>
          <Icon type="setting" />
          修改密码
        </Menu.Item>
        <Menu.Item onClick={this.logOut}>
          <Icon type="logout" />
          退出
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="menu-bar">
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
            <div className="logo">
              {/*<img src={logo} alt="" />*/}
              {!collapsed ? <span>慧景链管理平台</span> : null}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectKey}
              openKeys={openKeys}
              onOpenChange={this.openSubRoute}
              onClick={this.changeRoute}
            >
              {this.renderMenuItem(this.menuConfig)}
            </Menu>
          </Sider>
          <Layout>
            <Header>
              <Icon
                className="trigger"
                type={collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
              {this.renderBreadcrumb(breadCrumb)}
              <Dropdown className="fr click" overlay={dropMenu}>
                <span>
                  <Avatar style={{ backgroundColor: "#87d068" }} icon="user" />
                  {configInfo.userName}
                </span>
              </Dropdown>
            </Header>
            {/*<TabRoute tabData={tabData}
                      clickTab={this.clickTab}
                      closeTab={this.closeTab}
            />*/}
            <Content>
              <RenderRoute
                config={this.menuConfig}
                currentPath={selectKey}
                redirectPath={this.getDefaultRoute(this.menuConfig)}
              />
            </Content>
          </Layout>
        </Layout>
        <PasswordModal
          wrappedComponentRef={v => (this.psModal = v)}
          confirm={this.changePassword}
        />
      </div>
    );
  }
}

export default MenuBar;
