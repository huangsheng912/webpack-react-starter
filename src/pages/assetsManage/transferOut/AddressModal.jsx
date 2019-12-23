import React, { Component } from "react";
import { Modal, Table } from "antd";

class AddressModal extends Component {
  state = {
    show: false
  };
  visible = () => {
    this.setState({
      show: !this.state.show
    });
  };
  onRowClick = v => {
    console.log(v, "----addressInfo----");
    this.props.selectAddress(v);
    this.visible();
  };
  render() {
    const columns = [
      {
        title: "名称",
        key: "title",
        dataIndex: "title"
      },
      {
        title: "地址",
        key: "address",
        dataIndex: "address"
      },
      {
        title: "标签",
        key: "tag",
        dataIndex: "tag"
      }
    ];
    return (
      <Modal
        title="转账地址"
        visible={this.state.show}
        onCancel={this.visible}
        footer={false}
        width={"50vw"}
        className="address-modal"
      >
        <Table
          columns={columns}
          dataSource={this.props.data}
          pagination={false}
          rowKey={record => record.address}
          onRow={record => ({
            onClick: this.onRowClick.bind(this, record) // 点击行
          })}
        />
      </Modal>
    );
  }
}

export default AddressModal;
