import React from "react";
import "./index.less";
import { Button, message, Select } from "antd";
import { get, post } from "utils/request";
import moment from "moment";
import Table from "components/Table";

const { Option } = Select;

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

class Main extends React.Component {
  state = {
    loading: true,
    orderState: "All",
    page: 0
  };
  componentDidMount() {
    this.getList();
    this.getBalance();
  }
  async getList() {
    // console.log(this.state.orderState)
    const params = {
      page: this.state.page,
      size: 10
    };
    const url =
      this.state.orderState !== "All"
        ? "/api/redeem/" + this.state.orderState
        : "/api/redeem";
    const res = await get(url, params);
    if (res.success) {
      this.setState({
        loading: false,
        total: res.data.total,
        tableList: res.data.data
      });
    }
  }
  async getBalance() {
    const url = "/api/redeem/hotWalletBalance";
    const res = await get(url);
    if (res.success) {
      this.setState({
        balance
      });
    }
  }

  handleChange = type => {
    this.setState(
      {
        loading: true,
        orderState: type
      },
      this.getList
    );
  };

  handleOperate = async orderNo => {
    if (!orderNo) return;
    const res = await post("/api/redeem/" + orderNo);
    if (res.success) {
      message.success("处理成功");
      this.setState(
        {
          loading: true
        },
        this.getList
      );
    } else {
      message.error(res.msg);
    }
  };

  changeSize = (page, size) => {
    this.setState(
      {
        loading: true,
        page: page
      },
      this.getList
    );
  };
  render() {
    const { total, tableList, loading, page } = this.state;
    const orderStateType = [
      { label: "全部", value: "All" },
      { label: "处理中", value: "Process" },
      { label: "已通知转账", value: "NotifyTransfer" },
      { label: "转账中", value: "Transfer" },
      { label: "确认中", value: "Confirming" },
      { label: "已完成", value: "Complete" },
      { label: "失败", value: "Fail" }
    ];
    const businessType = [
      { label: "全部", value: "0" },
      { label: "转账交易", value: "Transaction" },
      { label: "兑换", value: "Convert" },
      { label: "赎回", value: "Redeem" },
      { label: "收益", value: "Earnings" }
    ];
    const columns = [
      {
        title: "高度",
        key: "blockHeight",
        dataIndex: "blockHeight"
      },
      {
        title: "提现地址",
        key: "innerAddress",
        dataIndex: "innerAddress"
      },
      {
        title: "TXID（NRC20）",
        dataIndex: "innerTxHash",
        key: "innerTxHash",
        width: "20%"
      },
      {
        title: "TXID（ERC20）",
        dataIndex: "outerTxHash",
        key: "outerTxHash",
        width: "20%"
      },
      {
        title: "时间",
        dataIndex: "blockDate",
        key: "blockDate",
        width: "12%",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
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
      },
      {
        title: "操作",
        key: "operate",
        render: (text, record) => (
          <Button
            type="primary"
            hidden={!this.state.balance || record.orderState !== "Process"}
            onClick={() => this.handleOperate(record.orderNo)}
          >
            处理
          </Button>
        )
      }
    ];
    return (
      <div className="redeem-page">
        <div className="transfer-list bg-white">
          <Select defaultValue="All" onChange={this.handleChange}>
            {orderStateType.map((v, i) => (
              <Option value={v.value} key={i}>
                {v.label}
              </Option>
            ))}
          </Select>
          <span className="balance-view">热钱包余额：{this.state.balance}</span>
          <Table
            columns={columns}
            dataSource={tableList}
            loading={loading}
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
