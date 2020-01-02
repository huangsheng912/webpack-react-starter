import React from "react";
import "./index.less";
import { get } from "utils/request";
import { Button, DatePicker } from "antd";
import moment from "moment";
import Table from "components/Table";
import { transformNum } from "../../../utils/util";
import { observer, inject } from "mobx-react";

const { RangePicker } = DatePicker;
const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

@inject("configStore")
@observer
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
    const res = await get("/api/earnings/total");
    if (res.success) {
      const r = res.data;
      r.nuls = transformNum({
        n: r.nuls,
        d: configInfo.nulsDecimals
      });
      r.usdi = transformNum({
        n: r.usdi,
        d: configInfo.usdiDecimals
      });
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
      start: this.state.start,
      end: this.state.end
    };
    const res = await get("/api/earnings/queryCollectList", params);
    if (res.success) {
      res.data.data.map(v => {
        v.nulsSettlementNumber = transformNum({
          n: v.nulsSettlementNumber,
          d: configInfo.nulsDecimals
        }); //nuls当日发放收益量
        v.nulsClearNumber = transformNum({
          n: v.nulsClearNumber,
          d: configInfo.nulsDecimals
        }); //nuls当日产生收益量
        v.usdiClearNumber = transformNum({
          n: v.usdiClearNumber,
          d: configInfo.usdiDecimals
        }); //usdi当日产生收益量
        v.usdiSettlementNumber = transformNum({
          n: v.usdiSettlementNumber,
          d: configInfo.usdiDecimals
        }); //usdi当日发放收益量
      });
      this.setState({
        tableLoading: false,
        total: res.data.total,
        list: res.data.data
      });
    }
  }

  onTimeChange = (value, dateString) => {
    console.log(value[0].$d.getTime(), "time");
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    const start = value[0].$d.getTime();
    const end = value[1].$d.getTime();
    this.setState({
      start,
      end
    });
  };

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
  changeSize = page => {
    this.setState(
      {
        tableLoading: true,
        page
      },
      this.getList
    );
  };
  toDetail = id => {
    this.props.configStore.changeRoute(
      "/dashBoard/rewardDistribution/detail?id=" + id
    );
    this.props.history.push({
      pathname: "/dashBoard/rewardDistribution/detail",
      /*query: {
        id: 456
      },*/
      search: "?id=" + id
    });
  };

  render() {
    const { usdi, nuls, list = [], total, tableLoading, page } = this.state;
    const columns = [
      {
        key: "date",
        dataIndex: "date",
        title: "日期",
        render: text => moment(text).format("YYYY-MM-DD")
      },
      {
        key: "usdiSettlementNumber",
        dataIndex: "usdiSettlementNumber",
        title: "USDI发放收益"
      },
      {
        key: "nulsSettlementNumber",
        dataIndex: "nulsSettlementNumber",
        title: "NULS发放收益"
      },
      {
        key: "usdiClearNumber",
        dataIndex: "usdiClearNumber",
        title: "USDI产生收益"
      },
      {
        key: "nulsClearNumber",
        dataIndex: "nulsClearNumber",
        title: "NULS产生收益"
      },
      {
        key: "settlementCount",
        dataIndex: "settlementCount",
        title: "发放地址数"
      }
      /*{
        key: 'operate',
        dataIndex: 'operate',
        title: '操作',
        render: (text, record) => <a onClick={() => this.toDetail(record.date)}>查看明细</a>
      },*/
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
              日期范围&nbsp;&nbsp;&nbsp;
              <RangePicker
                // showTime={{ format: 'HH:mm' }}
                // format="YYYY-MM-DD HH:mm"
                placeholder={["开始时间", "截止时间"]}
                onChange={this.onTimeChange}
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
