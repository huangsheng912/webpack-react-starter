import React, { Component } from "react";
import { Button, Input, message, Modal, Spin } from "antd";
const { TextArea } = Input;
import "./index.less";
import { put } from "utils/request";

class Main extends Component {
  state = {
    show: false,
    hash: "",
    loading: false
  };
  visible = () => {
    this.setState({
      show: !this.state.show
    });
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
    }
    let txData;
    try {
      txData = JSON.parse(this.state.hash);
    } catch (e) {
      message.warning("请填写正确的交易hash");
      return;
    }
    this.setState({
      loading: true
    });
    const params = {
      tx: txData.tx,
      toAddress: txData.toAddress,
      amount: txData.amount
    };
    const res = await put("/api/usdtExtract/notifyTransfer", params);
    if (res.success) {
      message.success("广播交易成功");
    } else {
      message.error(res.msg);
    }
    this.closeModal();
  };
  closeModal = () => {
    this.setState({
      hash: "",
      loading: false,
      show: false,
      toAddress: "",
      amount: ""
    });
  };

  render() {
    return (
      <Modal
        title="eth广播交易"
        visible={this.state.show}
        onCancel={this.visible}
        footer={false}
        width={"50vw"}
        className="broadcast-modal"
        afterClose={this.closeModal}
      >
        <div className="broadcast-transaction">
          {this.state.loading ? (
            <div className="loading">
              <Spin />
            </div>
          ) : null}
          <TextArea value={this.state.hash} onChange={this.hashChange} />
          <p>
            交易地址：<span>{this.state.toAddress}</span>
          </p>
          <p>交易金额：{this.state.amount}</p>
          <div className="btn-wrap">
            <Button type="primary" onClick={this.broadcast}>
              广播交易
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Main;
