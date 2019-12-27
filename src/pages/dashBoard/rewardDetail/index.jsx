import React from "react";
import "./index.less";
import { get } from "utils/request";
import { Button, Input, Select } from "antd";
import moment from "moment";
import Table from "components/Table";
import { transformNum } from "../../../utils/util";

const { Option } = Select;

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};
class Main extends React.Component {
  state = {
    tableLoading: true,
    page: 0
  };
  componentDidMount() {
    this.getTotal();
    this.getList();
  }
  async getTotal() {
    const res = await get("/usdi/dashboard/reward/total");
    if (res.success) {
      const r = res.data;
      r.nuls = transformNum({ n: r.nuls, d: configInfo.nulsDecimals });
      r.usdi = transformNum({ n: r.usdi, d: configInfo.usdiDecimals });
      this.setState({
        loading: true,
        nuls: r.nuls,
        usdi: r.usdi
      });
    }
  }
  async getList() {
    const params = {
      page: this.state.page,
      size: 10,
      type: this.state.type || "All"
    };
    const res = await get("/usdi/dashboard/reward/list", params);
    if (res.success) {
      res.data.list.map(v => {
        const decimal =
          v.type === "USDI" ? configInfo.usdiDecimals : configInfo.nulsDecimals;
        v.amount = transformNum({ n: v.amount, d: decimal });
      });
      this.setState({
        tableLoading: false,
        total: res.data.total,
        list: res.data.list
      });
    }
  }
  //下拉回调
  handleChange(v, type) {
    this.setState({
      [type]: v
    });
  }
  //输入框回调
  changeAddress(v, type) {
    this.setState({
      [type]: val
    });
  }
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
  render() {
    const {
      usdi,
      nuls,
      address,
      list = [],
      total,
      tableLoading,
      page
    } = this.state;
    const businessType = [
      { label: "全部", value: "All" },
      { label: "USDI收益", value: "USDI" },
      { label: "NULS收益", value: "NULS" }
    ];
    const columns = [
      {
        title: "交易ID",
        key: "id",
        dataIndex: "id"
      },
      {
        title: "发放地址",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "时间",
        dataIndex: "time",
        key: "time",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "业务",
        dataIndex: "type",
        key: "type",
        render: text => {
          let res;
          businessType.map(v => {
            if (v.value === text) res = v.label;
          });
          return res;
        }
      },
      {
        title: "金额",
        dataIndex: "amount",
        key: "amount"
      }
    ];
    return (
      <div className="redemption-page">
        <div className="table-search">
          <span className="search-label">记账总量：{usdi}USDI</span>
          <span className="search-label">{nuls}NULS</span>
        </div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              业务类型&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={"All"}
                onChange={v => this.handleChange(v, "type")}
              >
                {businessType.map((v, i) => (
                  <Option value={v.value} key={i}>
                    {v.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="fl address-search">
              地址&nbsp;&nbsp;&nbsp;
              <Input
                value={address}
                onChange={v => this.changeAddress(v, "address")}
                placeholder="查询地址"
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
