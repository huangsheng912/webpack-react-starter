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
    tableLoading: true
  };
  componentDidMount() {
    this.getTotal();
    this.getList();
  }
  async getTotal() {
    const res = await get("/api/exchange/total");
    if (res.success) {
      const r = res.data;
      r.convert = transformNum({ n: r.convert, d: configInfo.usdiDecimals });
      r.redeem = transformNum({ n: r.redeem, d: configInfo.usdiDecimals });
      this.setState({
        convert: r.convert,
        redeem: r.redeem
      });
    }
  }
  async getList() {
    const params = {
      page: this.state.page || 0,
      size: 10,
      orderState: this.state.orderState || "",
      key: this.state.key
    };
    const res = await get("/api/exchange/list", params);
    if (res.success) {
      res.data.data.map(v => {
        v.amount = transformNum({ n: v.amount, d: configInfo.usdiDecimals });
      });
      this.setState({
        tableLoading: false,
        total: res.data.total,
        list: res.data.data
      });
    }
  }
  //下拉回调
  handleChange(v, type) {
    console.log(v, 111, type);
    this.setState({
      [type]: v
    });
  }
  //输入框回调
  changeAddress(v, type) {
    let val = v.target.value;
    this.setState({
      [type]: val
    });
  }
  //列表查询
  doSearch = () => {
    const { type, status, minAmount, maxAmount } = this.state;
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
    const { convert, redeem, key, list = [], total, tableLoading } = this.state;
    const businessType = [
      { label: "全部", value: "All" },
      { label: "兑换", value: "Convert" },
      { label: "赎回", value: "Redeem" }
    ];
    const statusType = [
      { label: "全部", value: "All" },
      { label: "已确认", value: "Confirm" },
      { label: "未确认", value: "Pending" }
    ];
    const orderStateType = [
      { label: "全部", value: "" },
      // {label:'处理中',value:'Process'},
      // {label:'已通知转账',value:'NotifyTransfer'},
      // {label:'转账中',value:'Transfer'},
      // {label:'确认中',value:'Confirming'},
      { label: "已完成", value: "Complete" },
      { label: "失败", value: "Fail" }
    ];
    const columns = [
      {
        title: "高度",
        key: "blockHeight",
        dataIndex: "blockHeight"
      },
      {
        title: "地址",
        key: "innerAddress",
        dataIndex: "innerAddress",
        width: "20%"
      },
      {
        title: "TXID（NRC20）",
        dataIndex: "innerTxHash",
        key: "innerTxHash",
        width: "20%",
        render: text => (
          <a
            href={"https://nulscan.io/transaction/info?hash=" + text}
            target="__blank"
          >
            {text}
          </a>
        )
      },
      {
        title: "TXID（ERC20）",
        dataIndex: "outerTxHash",
        key: "outerTxHash",
        width: "20%",
        render: text => (
          <a href={"https://www.etherchain.org/tx/" + text} target="__blank">
            {text}
          </a>
        )
      },
      {
        title: "时间",
        dataIndex: "blockDate",
        key: "blockDate",
        width: "12%",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "业务",
        dataIndex: "exchangeType",
        key: "exchangeType",
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
      },
      {
        title: "状态",
        dataIndex: "orderState",
        key: "orderState",
        render: text => {
          let res;
          orderStateType.map(v => {
            if (v.value === text) res = v.label;
          });
          return res;
        }
      }
    ];
    return (
      <div className="redemption-page">
        <div className="table-search">
          <span className="search-label">兑换总量：{convert}</span>
          <span className="search-label">赎回总量：{redeem}</span>
        </div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              状态&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={""}
                onChange={v => this.handleChange(v, "orderState")}
              >
                {orderStateType.map((v, i) => (
                  <Option value={v.value} key={i}>
                    {v.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="fl address-search">
              地址&nbsp;&nbsp;&nbsp;
              <Input
                value={key}
                onChange={v => this.changeAddress(v, "key")}
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
          />
        </div>
      </div>
    );
  }
}

export default Main;
