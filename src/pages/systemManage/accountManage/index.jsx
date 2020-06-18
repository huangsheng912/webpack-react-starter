import React from "react";
import "./index.less";
import Table from "components/Table";
import {
  Input,
  DatePicker,
  Select,
  Button,
  Divider,
  Modal,
  message
} from "antd";
import { post } from "utils/request";
import moment from "moment";
import EditModal from "./EditModal";
import { inject, observer } from "mobx-react";

const { Option } = Select;
const { RangePicker } = DatePicker;

@inject("configStore")
@observer
class Main extends React.Component {
  state = {
    loading: true,
    pageNumber: 0,
    pageSize: 10,
    status: "",
    startTime: "",
    endTime: "",
    search: "",
    editId: "" //编辑用户id
  };
  componentDidMount() {
    this.getList();
  }
  async getList() {
    this.setState({
      loading: true
    });
    const params = {
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,
      statusType: this.state.status,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      searchText: this.state.search
    };
    const res = await post("", "adminPageList", params);
    if (res.result) {
      this.setState({
        loading: false,
        total: res.result.totalCount,
        tableList: res.result.list
      });
    }
  }
  //下拉回调
  handleChange = v => {
    this.setState(
      {
        status: v
      },
      this.getList
    );
  };
  onTimeChange = (value, dateString) => {
    if (value.length) {
      this.setState({
        startTime: moment(value[0]).format("YYYY-MM-DD") + " 00:00:00",
        endTime: moment(value[1]).format("YYYY-MM-DD") + " 23:59:59"
      });
    } else {
      this.setState({
        startTime: "",
        endTime: ""
      });
    }
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  //查询
  doSearch = () => {
    this.setState(
      {
        loading: true,
        pageNumber: 0
      },
      this.getList
    );
  };
  //表格翻页
  changeSize = page => {
    this.setState(
      {
        pageNumber: page
      },
      this.getList
    );
  };
  //新建用户
  addAccount = () => {
    this.setState({
      modalTitle: "新建用户"
    });
    this.editModal.visible();
  };
  //编辑
  editUserInfo = record => {
    this.setState({
      modalTitle: "编辑用户信息",
      editId: record.id
    });
    this.editModal.props.form.setFieldsValue({
      mobile: record.mobile,
      realName: record.realName,
      userName: record.userName,
      company: record.company
    });
    this.editModal.visible();
  };
  //新建、编辑用户确认回调
  changeUserInfo = userInfo => {
    console.log(userInfo, "---userInfo");
    this.setState(
      {
        pageNumber: 0,
        status: "",
        startTime: "",
        endTime: "",
        search: ""
      },
      this.getList
    );
  };

  showConfirm = ({ title, record, cb }) => {
    Modal.confirm({
      title: title,
      content: "",
      onOk: () => cb(record),
      onCancel() {}
    });
  };
  //重置密码
  resetPs = async record => {
    const params = {
      id: record.id,
      password: "Yuyanji360"
    };
    const res = await post("", "resetPwd", params);
    if (res.result) {
      message.success("重置成功");
      const myId = this.props.configStore.configInfo.userId;
      if (id === myId) {
        this.props.configStore.clearLoginInfo();
        this.props.history.push("/login");
      }
    }
  };
  /*doConfirm = async (title, record) => {
    console.log(title,'---00')
    if (title === '确认重置该用户密码？') {
      const params = {
        id: record.id,
        password: 'Yuyanji360'
      }
      const res = await post('','resetPwd', params);
      if (res.result) {
        message.success('重置成功,请重新登录')
        const myId = this.props.configStore.configInfo.userId
        if (id === myId) {
          this.props.configStore.clearLoginInfo()
          this.props.history.push('/login')
        }
      }
    } else {
      //启用禁用
      const params = {
        id: record.id,
        admin: !record.admin
      }
      const res = await post('', 'markAdmin', params);
      if (res.result) {
        message.success('设置成功')
        this.getList()
      }
    }
  }*/

  //设置管理员
  setAdmin = async record => {
    const params = {
      id: record.id,
      admin: !record.admin
    };
    const res = await post("", "markAdmin", params);
    if (res.result) {
      message.success("设置成功");
      this.getList();
    }
  };
  //删除管理员
  delAdmin = async record => {
    const res = await post("", "record", { id: record.id });
    if (res.result) {
      message.success("设置成功");
      const myId = this.props.configStore.configInfo.userId;
      if (id === myId) {
        this.props.configStore.clearLoginInfo();
        this.props.history.push("/login");
      } else {
        this.getList();
      }
    }
  };
  logout = async () => {
    const myId = this.props.configStore.configInfo.userId;
    if (id === myId) {
      this.props.configStore.clearLoginInfo();
      this.props.history.push("/login");
    } else {
      this.getList();
    }
  };
  render() {
    const {
      searchVal,
      tableList,
      total,
      loading,
      modalTitle,
      pageNumber,
      editId
    } = this.state;
    const statusType = [
      { label: "全部", value: "" },
      { label: "启用", value: 0 },
      { label: "禁用", value: 1 }
    ];
    const columns = [
      {
        title: "用户名",
        key: "userName",
        dataIndex: "userName"
      },
      {
        title: "姓名",
        key: "realName",
        dataIndex: "realName"
      },
      {
        title: "所属公司/单位",
        key: "company",
        dataIndex: "company"
      },
      {
        title: "手机",
        key: "mobile",
        dataIndex: "mobile"
      },
      {
        title: "注册时间",
        key: "createDate",
        dataIndex: "createDate",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "是否管理员",
        key: "admin",
        dataIndex: "admin",
        render: text => (text ? "是" : "否")
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span>
            <a onClick={() => this.editUserInfo(record)}>编辑</a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                this.showConfirm({
                  title: "确认重置该用户密码？",
                  record,
                  cb: this.resetPs
                })
              }
            >
              重置密码
            </a>
            <Divider type="vertical" />
            {!record.admin ? (
              <a
                onClick={() =>
                  this.showConfirm({
                    title: "确认设置该用户为管理员？",
                    record,
                    cb: this.setAdmin
                  })
                }
              >
                成为管理员
              </a>
            ) : (
              <a
                onClick={() =>
                  this.showConfirm({
                    title: "确认取消该用户管理员权限？",
                    record,
                    cb: this.setAdmin
                  })
                }
              >
                取消管理员
              </a>
            )}
            <Divider type="vertical" />
            <a
              onClick={() =>
                this.showConfirm({
                  title: "确认删除该账户？",
                  record,
                  cb: this.delAdmin
                })
              }
            >
              删除
            </a>
          </span>
        )
      }
    ];
    return (
      <div className="account-manage bg-white">
        <div className="create-account">
          <Button type="primary" onClick={this.addAccount}>
            新建
          </Button>
        </div>
        <div className="search-account hidden">
          <div className="fl">
            状态&nbsp;&nbsp;&nbsp;
            <Select defaultValue="All" onChange={this.handleChange}>
              {statusType.map(v => (
                <Option key={v.value} value={v.value}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="fl">
            注册时间&nbsp;&nbsp;&nbsp;
            <RangePicker
              // showTime={{ format: 'HH:mm' }}
              // format="YYYY-MM-DD HH:mm"
              placeholder={["开始时间", "截止时间"]}
              onChange={this.onTimeChange}
            />
          </div>
          <div className="fl">
            <Input
              className="search-input"
              placeholder="请输入用户名、姓名、手机号查询"
              value={searchVal}
            />
          </div>
          <div className="fl">
            <Button type="primary" onClick={this.doSearch}>
              查询
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={tableList}
          loading={loading}
          total={total}
          changeSize={this.changeSize}
          currentPage={pageNumber}
        />
        <EditModal
          wrappedComponentRef={v => (this.editModal = v)}
          title={modalTitle}
          submit={this.changeUserInfo}
          id={editId}
        />
      </div>
    );
  }
}

export default Main;
