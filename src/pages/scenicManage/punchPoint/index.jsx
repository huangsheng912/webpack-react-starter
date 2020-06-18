import React from "react";
import "./index.less";
import { post } from "utils/request";
import { Button, Divider, Input, message, Modal, Select } from "antd";
import moment from "moment";
import Table from "components/Table";

const { Option } = Select;
const { confirm } = Modal;

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};
class Main extends React.Component {
  state = {
    tableLoading: true,
    pageNumber: 0,
    pageSize: 10,
    total: 0,
    scenicId: "",
    scenicList: [{ scenicName: "全部", id: "" }],
    list: [],
    totalPlace: 0
  };
  async componentDidMount() {
    await this.getScenic();
    await this.getList();
  }

  //打卡点
  async getList() {
    this.setState({
      tableLoading: true
    });
    const { pageNumber, pageSize, scenicId } = this.state;
    const res = await post("", "placePageList", {
      pageNumber,
      pageSize,
      scenicId
    });
    if (res.result) {
      if (pageNumber === 0) {
        this.setState({
          totalPlace: res.result.totalCount
        });
      }
      res.result.list.map(v => {
        const scenic = this.state.scenicList.filter(
          scenic => v.scenicId === scenic.id
        )[0];
        v.scenicName = scenic ? scenic.scenicName : "";
      });
      this.setState({
        tableLoading: false,
        total: res.result.totalCount,
        list: res.result.list
      });
    }
  }

  //景区
  async getScenic() {
    const params = {
      pageNumber: 0,
      pageSize: 100
    };
    const res = await post("", "scenicPageList", params);
    if (res.result) {
      this.setState(
        {
          scenicList: [...this.state.scenicList, ...res.result.list]
        },
        () => {
          console.log(this.state.scenicList, 11);
        }
      );
    }
  }

  handleChange = id => {
    console.log(id);
    this.setState({
      scenicId: id
    });
  };
  addPlace = () => {
    this.props.history.push("/scenicManage/punchPoint/addPunchPoint");
  };

  //分页
  changeSize = (page, size) => {
    this.setState(
      {
        tableLoading: true,
        pageNumber: page
      },
      this.getList
    );
  };

  toEdit = id => {
    this.props.history.push(
      "/scenicManage/punchPoint/editPunchPoint?id=" + id + "&edit=true"
    );
  };
  render() {
    const {
      list = [],
      total,
      tableLoading,
      pageNumber,
      scenicList,
      totalPlace
    } = this.state;
    //申请入驻弹窗
    function showModal(type, id) {
      confirm({
        title: "确定删除该打卡点",
        content: "",
        onOk() {
          return new Promise((resolve, reject) => {
            post("", "delPlace", { id })
              .then(res => {
                if (res.result && res.result.result) {
                  message.success("已删除");
                  this.setState(
                    {
                      pageNumber: 1
                    },
                    this.getList
                  );
                } else {
                  message.error("删除失败");
                }
                resolve();
              })
              .catch(e => {
                reject(e);
              });
          }).catch(() => console.log("error"));
        },
        onCancel() {}
      });
    }
    const columns = [
      {
        title: "序号",
        key: "index",
        dataIndex: "index",
        render: (text, row, index) =>
          index + 1 + this.state.pageNumber * this.state.pageSize
      },
      {
        title: "打卡点名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "所属景区",
        dataIndex: "scenicName",
        key: "scenicName"
      },
      {
        title: "景区地址",
        dataIndex: "address",
        key: "address"
      },
      /* {
         title: '开放时间',
         dataIndex: 'opentime',
         key: 'opentime',
       },
       {
         title: '状态',
         dataIndex: 'amount',
         key: 'amount',
       },*/
      {
        title: "操作",
        dataIndex: "operate",
        key: "operate",
        render: (text, item) => (
          <span>
            <a onClick={() => this.toEdit(item.id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => showModal(item.id)}>删除</a>
          </span>
        )
      }
    ];
    return (
      <div className="punch-point-page">
        <div className="table-search bg-white">
          <span className="search-label">打卡点数：{totalPlace}</span>
          <div className="fr">
            <Button type="primary" onClick={() => this.addPlace()}>
              新增打卡点
            </Button>
          </div>
        </div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              所属景区&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue=""
                onChange={v => this.handleChange(v, "orderState")}
              >
                {scenicList.map(scenic => (
                  <Option key={scenic.id} value={scenic.id}>
                    {scenic.scenicName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="fr">
              <Button type="primary" onClick={() => this.getList()}>
                查询
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={list}
            loading={tableLoading}
            total={total}
            changeSize={this.changeSize}
            currentPage={pageNumber}
          />
        </div>
      </div>
    );
  }
}

export default Main;
