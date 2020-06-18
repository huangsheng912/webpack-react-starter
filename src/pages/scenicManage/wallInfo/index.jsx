import React from "react";
import "./index.less";
import { post } from "utils/request";
import { Button, DatePicker } from "antd";
import moment from "moment";
import Table from "components/Table";
import { observer, inject } from "mobx-react";

const { RangePicker } = DatePicker;
const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

@inject("configStore")
@observer
class Main extends React.Component {
  state = {
    tableLoading: true,
    page: 0
  };

  componentDidMount() {
    this.getList();
  }

  async getList() {
    const params = {
      placeId: ""
    };
    await post("", "getDisplay", params);
  }

  onTimeChange = (value, dateString) => {
    console.log(value[0].$d.getTime(), "time");
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    const start = value[0].$d.getTime();
    const end = value[1].$d.getTime();
    this.setState({
      start,
      end
    });
  };

  //列表查询
  doSearch = () => {
    this.setState(
      {
        tableLoading: true,
        page: 0
      },
      this.getList
    );
  };
  //分页
  changeSize = (page, size) => {
    this.setState(
      {
        tableLoading: true,
        page
      },
      this.getList
    );
  };
  toDetail = id => {
    this.props.configStore.changeRoute(
      "/dashBoard/rewardDistribution/detail?id=" + id
    );
    this.props.history.push({
      pathname: "/dashBoard/rewardDistribution/detail",
      /*query: {
        id: 456
      },*/
      search: "?id=" + id
    });
  };

  render() {
    const { usdi, nuls, list = [], total, tableLoading, page } = this.state;
    const columns = [
      {
        key: "index",
        dataIndex: "index",
        title: "编号",
        render: (text, row, index) =>
          index + 1 + this.state.pageNumber * this.state.pageSize
      },
      {
        key: "info",
        dataIndex: "info",
        title: "上墙内容"
      },
      {
        key: "belongScenic",
        dataIndex: "belongScenic",
        title: "所属景区"
      },
      {
        key: "belongPlace",
        dataIndex: "belongPlace",
        title: "所属景点"
      },
      {
        key: "userName",
        dataIndex: "userName",
        title: "用户名"
      },
      {
        key: "time",
        dataIndex: "time",
        title: "上墙时间"
      },
      {
        key: "level",
        dataIndex: "level",
        title: "危险等级"
      },
      {
        key: "status",
        dataIndex: "status",
        title: "状态"
      },
      {
        key: "operate",
        dataIndex: "operate",
        title: "操作",
        render: (text, record) => (
          <a onClick={() => this.toDetail(record.date)}>屏蔽</a>
        )
      }
    ];
    return (
      <div className="redemption-page">
        <div className="table-search"></div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              日期范围&nbsp;&nbsp;&nbsp;
              <RangePicker
                // showTime={{ format: 'HH:mm' }}
                // format="YYYY-MM-DD HH:mm"
                placeholder={["开始时间", "截止时间"]}
                onChange={this.onTimeChange}
              />
            </div>
            <div className="fr">
              <Button type="primary" onClick={this.doSearch}>
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
            currentPage={page}
          />
        </div>
      </div>
    );
  }
}

export default Main;
