import React from "react";
import "./index.less";
import { post } from "utils/request";
import { Button, Input, Select, Modal, message, Divider } from "antd";
import moment from "moment";
import Table from "components/Table";

const { Option } = Select;
const { confirm } = Modal;

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

class Main extends React.Component {
  state = {
    tableLoading: true,
    totalScenic: 0, //景区总数
    pageNumber: 0,
    pageSize: 10,
    count: 0
  };
  componentDidMount() {
    this.getList();
  }

  async getList() {
    const params = {
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize
    };
    const res = await post("", "scenicPageList", params);
    if (res.result) {
      this.setState({
        tableLoading: false,
        total: res.result.totalCount,
        list: res.result.list
      });
    }
  }
  //添加、编辑、审核景区
  addScenic() {
    this.props.history.push("/scenicManage/scenicInfo/addScenic");
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
        pageNumber: 0
      },
      this.getList
    );
  };
  //分页
  changeSize = (page, size) => {
    this.setState(
      {
        tableLoading: true,
        pageNumber: page
      },
      this.getList
    );
  };
  toEdit = id => {
    this.props.history.push(
      "/scenicManage/scenicInfo/editScenic?id=" + id + "&edit=true"
    );
  };
  //审核
  audit = id => {
    this.props.history.push("/scenicManage/scenicInfo/auditScenic?id=" + id);
  };
  render() {
    const {
      totalScenic,
      redeem,
      key,
      list = [],
      total,
      tableLoading,
      pageNumber
    } = this.state;

    const orderStateType = [
      { label: "全部", value: "" },
      { label: "处理中", value: "Process" },
      { label: "已通知转账", value: "NotifyTransfer" },
      { label: "转账中", value: "Transfer" },
      { label: "确认中", value: "Confirming" },
      { label: "已完成", value: "Complete" },
      { label: "失败", value: "Fail" }
    ];
    //申请入驻弹窗
    function showModal(type, id) {
      const title = type === "new" ? "确定申请入驻" : "确定申请复审";
      confirm({
        title: title,
        content: "",
        onOk() {
          return new Promise((resolve, reject) => {
            post("", "applyScenic", { scenicId: id })
              .then(res => {
                if (res.result && res.result.result) {
                  message.success("已发送申请");
                  this.setState(
                    {
                      pageNumber: 1
                    },
                    this.getList
                  );
                } else {
                  message.error("发送申请失败");
                }
                resolve();
              })
              .catch(e => {
                reject(e);
              });
          }).catch(() => console.log("error"));
        },
        onCancel() {}
      });
    }
    const columns = [
      {
        title: "序号",
        key: "index",
        dataIndex: "index",
        render: (text, row, index) =>
          index + 1 + this.state.pageNumber * this.state.pageSize
      },
      {
        title: "景区名称",
        key: "scenicName",
        dataIndex: "scenicName"
      },
      {
        title: "地址",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "打卡地址数",
        dataIndex: "places",
        key: "places",
        render: (text, record) =>
          record.placeList ? record.placeList.length : 0
      },
      {
        title: "经营主体",
        dataIndex: "company",
        key: "company"
      },
      {
        title: "状态",
        dataIndex: "statusText",
        key: "statusText"
      },
      {
        title: "操作",
        dataIndex: "status",
        key: "status",
        render: (text, item) => {
          if (text === "0") {
            //未入驻
            return (
              <span>
                <a onClick={() => showModal("new", item.id)}>申请入驻</a>
                <Divider type="vertical" />
                <a onClick={() => this.toEdit(item.id)}>编辑</a>
              </span>
            );
          } else if (text === "1") {
            return (
              <span>
                <a onClick={() => this.audit(item.id)}>审核</a>
              </span>
            );
          } else if (text === "2") {
            //运营中
            return (
              <span>
                <a onClick={() => this.toEdit(item.id)}>编辑</a>
                {/*<Divider type="vertical" />
                <a onClick={()=>this.addPunchPoint(item.id)}>添加打卡点</a>*/}
              </span>
            );
          } else if (text === "3") {
            //驳回
            return (
              <span>
                <a onClick={() => showModal("old", item.id)}>重新申请</a>
                <Divider type="vertical" />
                <a onClick={() => this.toEdit(item.id)}>编辑</a>
              </span>
            );
          }
        }
      }
    ];
    return (
      <div className="scenic-info-page">
        {/*4545
        <Button onClick={()=>this.setState({count:this.state.count+1})}>{this.state.count}</Button>*/}
        <div className="table-search">
          <span className="search-label">景区总数：{total}</span>
          <span className="search-label">打卡地址数：{redeem}</span>
          <div className="fr">
            <Button type="primary" onClick={() => this.addScenic()}>
              新增景区
            </Button>
          </div>
        </div>
        <div className="bg-white">
          {/*<div className='list-search hidden'>
            <div className='fl'>
              状态&nbsp;&nbsp;&nbsp;
              <Select defaultValue={''} onChange={(v)=>this.handleChange(v,'orderState')}>
                {
                  orderStateType.map((v,i)=><Option value={v.value} key={i}>{v.label}</Option>)
                }
              </Select>
            </div>
            <div className='fl address-search'>
              地址&nbsp;&nbsp;&nbsp;
              <Input value={key} onChange={(v)=>this.changeAddress(v,'key')} placeholder='查询地址'/>
            </div>
            <div className='fr'>
              <Button type='primary' onClick={this.doSearch}>查询</Button>
            </div>
          </div>*/}
          <Table
            columns={columns}
            dataSource={list}
            loading={tableLoading}
            total={total}
            changeSize={this.changeSize}
            currentPage={pageNumber}
          />
        </div>
      </div>
    );
  }
}

export default Main;
