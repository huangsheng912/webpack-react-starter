import React from "react";
import "./index.less";
import { Button, Input, Select, Modal } from "antd";
import { get } from "utils/request";
import moment from "moment";
import AddressModal from "./AddressModal";
import Table from "components/Table";
import { transformNum } from "../../../utils/util";

const { Option } = Select;

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};
class Main extends React.Component {
  state = {
    loading: true
  };
  componentDidMount() {
    this.getList();
    this.getAddressList();
  }
  async getList() {
    const params = {
      page: this.state.page || 0,
      size: 10,
      type: this.state.type || "All"
    };
    const res = await get("/usdi/assets/out/list", params);
    if (res.success) {
      res.data.list.map(v => {
        v.number = transformNum({ n: v.number, d: configInfo.usdiDecimals });
        v.balance = transformNum({ n: v.balance, d: configInfo.usdiDecimals });
      });
      this.setState({
        loading: false,
        total: res.data.total,
        tableList: res.data.list
      });
    }
  }
  async getAddressList() {
    const res = await get("/usdi/assets/address/list");
    if (res.success) {
      this.setState({
        addressList: res.data.list
      });
    }
  }
  selectAddress = item => {
    this.setState({
      addressInfo: item
    });
  };
  handleChange = type => {
    this.setState(
      {
        loading: true,
        type: type
      },
      this.getList
    );
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
    const {
      total,
      tableList,
      addressList,
      addressInfo = {},
      loading
    } = this.state;
    const transferType = [
      { label: "全部", value: "All" },
      { label: "转入", value: "转入" },
      { label: "转出", value: "转出" }
    ];
    const columns = [
      {
        title: "资产",
        key: "assets",
        dataIndex: "assets"
      },
      {
        title: "业务",
        key: "type",
        dataIndex: "type",
        render: text => (text === "In" ? "转入" : "转出")
      },
      {
        title: "TxID",
        key: "TxID",
        dataIndex: "TxID"
      },
      {
        title: "时间",
        key: "time",
        dataIndex: "time",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "数量",
        key: "number",
        dataIndex: "number"
      },
      {
        title: "余额",
        key: "balance",
        dataIndex: "balance"
      },
      {
        title: "状态",
        key: "status",
        dataIndex: "status"
      }
    ];
    return (
      <div className="transfer-out">
        <div className="transfer-operate">
          <div className="shadow bg-white">
            <h3 className="tc font24 mb_20">资金转出</h3>
            <div className="assets-type mb_20">
              <p className="name">资产类型</p>
              <span className="gray">USDT</span>
            </div>
            <div className="payment-address mb_20">
              <p className="name ">
                收款地址&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  type="primary"
                  size={"small"}
                  onClick={() => this.modal.visible()}
                >
                  选择
                </Button>
              </p>
              {addressInfo.address ? (
                <div className="address-info ">
                  <div className="address-type">
                    <p className="name">名称</p>
                    <p className="gray">{addressInfo.title}</p>
                  </div>
                  <div className="address">
                    <p className="name">地址</p>
                    <p className="gray">{addressInfo.address}</p>
                  </div>
                  <div className="tag">
                    <p className="name">标签（Tag）</p>
                    <p className="gray">{addressInfo.tag}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="transfer-amount mb_20">
              <p className="name">
                转账金额
                <span>
                  <span className="gray fr">可转出金额：273.39</span>
                </span>
              </p>
              <Input placeholder="最小提现数量0.1" />
            </div>
            <div className="transfer-fee mb_20 hidden">
              <p className="name fl">
                手续费&nbsp;&nbsp;&nbsp;<span className="gray">0.001USDT</span>
              </p>
              <p className="name fr">
                到账数量&nbsp;&nbsp;&nbsp;
                <span className="gray">223.93 USDT</span>
              </p>
            </div>
            <div className="tc">
              <Button type="primary" size="large">
                转出
              </Button>
            </div>
          </div>
        </div>
        <div className="transfer-list bg-white">
          <Select defaultValue="All" onChange={this.handleChange}>
            {transferType.map((v, i) => (
              <Option value={v.value} key={i}>
                {v.label}
              </Option>
            ))}
          </Select>
          <Table
            columns={columns}
            dataSource={tableList}
            loading={loading}
            total={total}
            changeSize={this.changeSize}
          />
        </div>
        <AddressModal
          ref={v => (this.modal = v)}
          data={addressList}
          selectAddress={this.selectAddress}
        />
      </div>
    );
  }
}

export default Main;
