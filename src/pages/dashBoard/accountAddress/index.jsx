import React from "react";
import "./index.less";
import { get } from "utils/request";
import { Button, Input } from "antd";
import Table from "components/Table";
import { transformNum } from "../../../utils/util";

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
    const res = await get("/usdi/dashboard/accountaddress/total");
    if (res.success) {
      this.setState({
        loading: true,
        totalAddress: res.data.totalAddress,
        largeAmountAddress: res.data.largeAmountAddress
      });
    }
  }
  async getList() {
    const params = {
      page: this.state.page,
      size: 10,
      minBalance: this.state.minBalance,
      maxBalance: this.state.maxBalance,
      minIncome: this.state.minIncome,
      maxIncome: this.state.maxIncome,
      address: this.state.address
    };
    const res = await get("/usdi/dashboard/accountaddress/list", params);
    if (res.success) {
      res.data.list.map(v => {
        v.balance = transformNum({ n: v.balance, d: configInfo.usdiDecimals });
        v.totalIncome = transformNum({
          n: v.totalIncome,
          d: configInfo.usdiDecimals
        });
        v.totalOutpay = transformNum({
          n: v.totalOutpay,
          d: configInfo.usdiDecimals
        });
        v.totalProfit = transformNum({
          n: v.totalProfit,
          d: configInfo.usdiDecimals
        });
      });
      this.setState({
        tableLoading: false,
        total: res.data.total,
        list: res.data.list
      });
    }
  }

  changeMinBalance(v, type) {
    let val = v.target.value;
    this.setState({
      [type]: val
    });
  }
  doSearch = () => {
    const { minBalance, maxBalance, minIncome, maxIncome } = this.state;
    this.setState(
      {
        page: 0,
        tableLoading: true
      },
      this.getList
    );
  };
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
      totalAddress,
      largeAmountAddress,
      list = [],
      total,
      minBalance,
      maxBalance,
      minIncome,
      maxIncome,
      address,
      tableLoading,
      page
    } = this.state;
    const columns = [
      {
        title: "序号",
        key: "index",
        render: (text, record, index) => index + 1
      },
      {
        title: "地址",
        dataIndex: "address",
        key: "address"
        // width: '18%'
      },
      {
        title: "余额",
        dataIndex: "balance",
        key: "balance"
      },
      {
        title: "总收入",
        dataIndex: "totalIncome",
        key: "totalIncome"
      },
      {
        title: "总支出",
        dataIndex: "totalOutpay",
        key: "totalOutpay"
      },
      {
        title: "总收益",
        dataIndex: "totalProfit",
        key: "totalProfit"
      }
    ];
    return (
      <div className="account-address">
        <div className="table-search">
          <span className="search-label">地址总数：{totalAddress}</span>
          <span className="search-label">
            非小额地址数：{largeAmountAddress}
          </span>
        </div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              余额&nbsp;&nbsp;&nbsp;
              <Input
                value={minBalance}
                onChange={v => this.changeMinBalance(v, "minBalance")}
              />
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <Input
                value={maxBalance}
                onChange={v => this.changeMinBalance(v, "maxBalance")}
              />
            </div>
            <div className="fl">
              总收益&nbsp;&nbsp;&nbsp;
              <Input
                value={minIncome}
                onChange={v => this.changeMinBalance(v, "minIncome")}
              />
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <Input
                value={maxIncome}
                onChange={v => this.changeMinBalance(v, "maxIncome")}
              />
            </div>
            <div className="fl address-search">
              地址&nbsp;&nbsp;&nbsp;
              <Input
                value={address}
                onChange={v => this.changeMinBalance(v, "address")}
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
            total={total}
            loading={tableLoading}
            changeSize={this.changeSize}
            currentPage={page}
          />
        </div>
      </div>
    );
  }
}

export default Main;
