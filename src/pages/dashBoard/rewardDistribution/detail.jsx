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
    console.log(this.props.location, "--ppp");
    this.getTotal();
    this.getList();
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    let newId = nextProps.location.search;
    const oldId = this.props.location.search;
    if (newId && newId !== oldId) {
      this.setState(
        {
          tableLoading: true,
          page: 0,
          coinType: "All",
          status: "All",
          minAmount: "",
          maxAmount: ""
        },
        () => {
          this.getTotal();
          this.getList();
        }
      );
    }
  }

  async getTotal() {
    const res = await get("/usdi/dashboard/distribution/total");
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
      coinType: this.state.coinType || "All",
      status: this.state.status || "All",
      minAmount: this.state.minAmount,
      maxAmount: this.state.maxAmount
    };
    const res = await get("/usdi/dashboard/distribution/detail", params);
    if (res.success) {
      res.data.list.map(v => {
        const decimal =
          v.coinType === "USDI"
            ? configInfo.usdiDecimals
            : configInfo.nulsDecimals;
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
    console.log(v, 111, type);
    this.setState({
      [type]: v
    });
  }
  //输入框回调
  changeMinBalance(v, type) {
    let val = v.target.value;
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
      list = [],
      total,
      minAmount,
      maxAmount,
      tableLoading,
      page
    } = this.state;
    const coinType = [
      { label: "全部", value: "All" },
      { label: "NULS", value: "NULS" },
      { label: "USDI", value: "USDI" }
    ];
    const statusType = [
      { label: "全部", value: "All" },
      { label: "已确认", value: "Confirm" },
      { label: "未确认", value: "Pending" }
    ];
    const columns = [
      {
        title: "高度",
        key: "height",
        dataIndex: "height"
      },
      {
        title: "TXID",
        dataIndex: "txId",
        key: "txId",
        width: "20%"
      },
      {
        title: "发放至地址",
        dataIndex: "address",
        key: "address",
        width: "20%"
      },
      {
        title: "时间",
        dataIndex: "time",
        key: "time",
        width: "12%",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "金额",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "币种",
        dataIndex: "coinType",
        key: "coinType",
        render: text => {
          let res;
          coinType.map(v => {
            if (v.value === text) res = v.label;
          });
          return res;
        }
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: text => {
          let res;
          statusType.map(v => {
            if (v.value === text) res = v.label;
          });
          return res;
        }
      }
    ];

    return (
      <div className="redemption-page">
        <div className="table-search">
          <span className="search-label">发放总量：{usdi}USDI</span>
          <span className="search-label">{nuls}NULS</span>
        </div>
        <div className="bg-white">
          <div className="list-search hidden">
            <div className="fl">
              币种&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={"All"}
                onChange={v => this.handleChange(v, "coinType")}
              >
                {coinType.map((v, i) => (
                  <Option value={v.value} key={i}>
                    {v.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="fl">
              状态&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={"All"}
                onChange={v => this.handleChange(v, "status")}
              >
                {statusType.map((v, i) => (
                  <Option value={v.value} key={i}>
                    {v.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="fl">
              金额范围&nbsp;&nbsp;&nbsp;
              <Input
                value={minAmount}
                onChange={v => this.changeMinBalance(v, "minAmount")}
              />
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <Input
                value={maxAmount}
                onChange={v => this.changeMinBalance(v, "maxAmount")}
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
