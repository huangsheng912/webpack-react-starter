import React from "react";
import "./index.less";
import { Button, Input, message, Spin } from "antd";
import { get, post, put } from "utils/request";
import moment from "moment";
import Table from "components/Table";
// import { transformNum, superLong } from "../../../utils/util";
// import BroadcastModal from "./BroadcastModal";

const { TextArea } = Input;

// const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};
class Main extends React.Component {
  state = {
    loading: true,
    hash: "",
    transferLoading: false,
    transferInLoading: false,
    page: 0
  };
  componentDidMount() {
    this.getList();
  }
  async getList() {
    this.setState({
      loading: true
    });
    const params = {
      page: this.state.page,
      size: 10
    };
    const res = await get("/api/coldWalletRecord", params);
    if (res.success) {
      /*res.data.data.map(v=>{
        v.amount = transformNum({n:v.amount,d:configInfo.usdiDecimals});
      })*/
      this.setState({
        loading: false,
        total: res.data.total,
        tableList: res.data.data
      });
    }
  }
  changeSize = page => {
    this.setState(
      {
        loading: true,
        page: page
      },
      this.getList
    );
  };
  hashChange = e => {
    const val = e.target.value;
    let amount, toAddress;
    try {
      const hash = JSON.parse(val);
      amount = hash.amount;
      toAddress = hash.toAddress;
    } catch (e) {
      console.log(e);
    }
    this.setState({
      hash: val,
      amount,
      toAddress
    });
  };
  broadcast = async () => {
    if (!this.state.hash) {
      message.warning("请填写交易hash");
      return;
    } else if (!this.state.toAddress || !this.state.amount) {
      message.warning("请填写正确的交易hash");
      return;
    }
    let txData;
    try {
      txData = JSON.parse(this.state.hash);
    } catch (e) {
      message.warning("请填写正确的交易hash");
      return;
    }
    this.setState({
      transferLoading: true
    });
    const params = {
      tx: txData.tx,
      toAddress: txData.toAddress,
      amount: txData.amount
    };
    try {
      const res = await put("/api/coldWalletRecord/outTransfer", params);
      if (res.success) {
        message.success("交易成功");
        this.setState(
          {
            hash: "",
            toAddress: "",
            amount: ""
          },
          this.getList
        );
      } else {
        message.error(res.msg);
      }
      this.setState({
        transferLoading: false
      });
    } catch (e) {
      this.setState({
        transferLoading: false
      });
    }
  };
  transferInChange = (v, type) => {
    this.setState({
      [type]: v.target.value
    });
  };
  transferIn = async () => {
    const { inHash, inAddress, inAmount } = this.state;
    if (!inHash || !inAddress || !inAmount) {
      message.warning("请完善转入信息");
      return;
    }
    this.setState({
      transferInLoading: true
    });
    const params = {
      txHash: inHash,
      toAddress: inAddress,
      amount: inAmount
    };
    try {
      const res = await post("/api/coldWalletRecord/saveTransfer", params);
      if (res.success) {
        message.success("交易成功");
        this.setState(
          {
            inHash: "",
            inAddress: "",
            inAmount: ""
          },
          this.getList
        );
      } else {
        message.error(res.msg);
      }
      this.setState({
        transferInLoading: false
      });
    } catch (e) {
      this.setState({
        transferInLoading: false
      });
    }
  };
  render() {
    const {
      total,
      tableList,
      loading,
      hash,
      toAddress,
      amount,
      transferLoading,
      inHash,
      inAddress,
      inAmount,
      transferInLoading,
      page
    } = this.state;
    const columns = [
      {
        title: "业务",
        key: "transferType",
        dataIndex: "transferType",
        render: text => (text === "IN" ? "转入" : "转出")
      },
      {
        title: "交易Hash",
        key: "txHash",
        dataIndex: "txHash",
        render: text => (
          <a href={"https://www.etherchain.org/tx/" + text} target="__blank">
            {text}
          </a>
        )
      },
      {
        title: "交易地址",
        key: "address",
        dataIndex: "address"
      },
      {
        title: "网络",
        key: "network",
        dataIndex: "network"
      },
      {
        title: "数量",
        key: "amount",
        dataIndex: "amount"
      },
      {
        title: "时间",
        key: "createdDate",
        dataIndex: "createdDate",
        render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
      }
    ];
    return (
      <div className="broadcast-page">
        <div className="transfer-operate">
          <div className="shadow bg-white">
            <div className="content">
              {transferLoading ? (
                <div className="loading">
                  <Spin />
                </div>
              ) : null}
              <h3>ETH广播交易</h3>
              <div className="item">
                <TextArea
                  style={{ minHeight: "180px" }}
                  value={hash}
                  onChange={this.hashChange}
                />
              </div>
              <div className="item">
                <span>交易地址：</span>
                {toAddress}
              </div>
              <div className="item">
                <span>交易数量：</span>
                {amount}
              </div>
              <div className="btn-wrap">
                <Button type="primary" size="large" onClick={this.broadcast}>
                  广播交易
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="transfer-operate">
          <div className="shadow bg-white">
            <div className="content">
              {transferInLoading ? (
                <div className="loading">
                  <Spin />
                </div>
              ) : null}
              <h3 style={{ marginBottom: "50px" }}>USDT资金转入</h3>
              <div className="item">
                <span>交易hash：</span>
                <Input
                  placeholder="请输入交易hash"
                  value={inHash}
                  onChange={v => this.transferInChange(v, "inHash")}
                />
              </div>
              <div className="item">
                <span>转入地址：</span>
                <Input
                  placeholder="请输入转入地址"
                  value={inAddress}
                  onChange={v => this.transferInChange(v, "inAddress")}
                />
              </div>
              <div className="item" style={{ marginBottom: "53px" }}>
                <span>到账数量：</span>
                <Input
                  placeholder="请输入到账数量"
                  value={inAmount}
                  onChange={v => this.transferInChange(v, "inAmount")}
                />
              </div>
              <div className="btn-wrap">
                <Button type="primary" size="large" onClick={this.transferIn}>
                  转入
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="transfer-list bg-white">
          {/*<Button type='primary' onClick={()=>this.broadcastModal.visible()}>广播交易</Button>*/}
          <Table
            columns={columns}
            dataSource={tableList}
            loading={loading}
            total={total}
            changeSize={this.changeSize}
            currentPage={page}
          />
        </div>
        {/*<BroadcastModal ref={v=>this.broadcastModal = v}/>*/}
      </div>
    );
  }
}

export default Main;
