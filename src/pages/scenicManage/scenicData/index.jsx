import React from "react";
import "./index.less";
import { get } from "utils/request";
// import { Card, Col, Row } from 'antd';
// import ChartSelect from "components/ChartSelect";
// import LineChart from "components/LineChart";

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

function NormalCard(props) {
  return (
    <div className="normal-card">
      <h3>{props.title}</h3>
      <ul>
        {props.cards.map((v, i) => (
          <li key={i}>
            <p className="item-title">{v.name}</p>
            {Array.isArray(v.value) ? (
              v.value.map((item, index) => (
                <p key={index} className="item-value item-balance">
                  <span>{item}</span>
                  {v.unit[index]}
                </p>
              ))
            ) : (
              <p className="item-value">
                <span>{v.value || 0}</span>
                {v.unit}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

class Main extends React.Component {
  state = {};
  componentDidMount() {
    this.getWallet();
    this.getAssetExchange();
    this.getUserAsset();
    this.getMortgage();
  }

  //冷热钱包资产看板
  async getWallet() {
    const res = await get("/api/dashboard/wallet");
    if (res.success) {
      this.setState({});
    }
  }
  //基金资金充提看板
  async getAssetExchange() {
    const res = await get("/api/dashboard/assetExchange");
    if (res.success) {
      this.setState({});
    }
  }
  //用户资产数据看板
  async getUserAsset() {
    const res = await get("/api/dashboard/userAsset");
    if (res.success) {
      this.setState({});
    }
  }
  //抵押数据看板
  async getMortgage() {
    const res = await get("/api/dashboard/mortgage");
    if (res.success) {
      this.setState({});
    }
  }

  judgeNumber(num) {
    if (!num && num !== 0) return;
    if (String(num).indexOf("-") > -1) {
      return {
        class: "negative",
        res: num
      };
    }
    return {
      class: "positive",
      res: "+" + num
    };
  }

  render() {
    const {
      hotWalletUsdtBalance,
      hotWalletEthBalance,
      hotWalletRate,
      todayRedeemBalance,
      difference,
      coldWalletUsdtBalance,
      coldWalletEthBalance,
      bigRedeemTotal,
      userCount,
      smallBalanceUserCount,
      effectiveUserCount,
      yesterdayAddUserCount,
      assetTotal,
      effectiveAssetTotal,
      yesterUsdiEarning,
      yesterNulsEarning,
      mortgateRate,
      mortgateTotal,
      nulsPrice,
      agentCount,
      outTotal,
      inTotal,
      offset,
      liabilities,
      hotAdminBalance
    } = this.state;
    const walletData = [
      {
        name: "准备金账户余额",
        value: [hotWalletEthBalance, hotWalletUsdtBalance],
        unit: ["ETH", "USDT"]
      },
      { name: "当前准备金率", value: hotWalletRate },
      { name: "今日快速提现剩余额度", value: todayRedeemBalance, unit: "USDI" },
      { name: "缺口", value: difference, unit: "USDT" },
      {
        name: "冷钱包余额",
        value: [coldWalletEthBalance, coldWalletUsdtBalance],
        unit: ["ETH", "USDT"]
      },
      // { name: '合约地址ETH余额', value: hotWalletEthBalance, unit: 'ETH'},
      { name: "待处理的大额提现数量", value: bigRedeemTotal, unit: "USDI" },
      { name: "准备金账户管理员余额", value: hotAdminBalance, unit: "NULS" }
    ];
    const userAssetsData = [
      { name: "持币总数", value: assetTotal, unit: "USDI" },
      {
        name: "产生收益账户持币总数",
        value: effectiveAssetTotal,
        unit: "USDI"
      },
      { name: "上一日发放USDI收益数", value: yesterUsdiEarning, unit: "USDI" },
      { name: "上一日发放NULS收益数", value: yesterNulsEarning, unit: "NULS" },
      { name: "持有用户数", value: userCount },
      { name: "小额用户数", value: smallBalanceUserCount },
      { name: "上一日新增用户数", value: yesterdayAddUserCount }
    ];
    const mortgageData = [
      { name: "当前抵押率", value: mortgateRate },
      { name: "抵押总数", value: mortgateTotal, unit: "NULS" },
      { name: "抵押率计算执行的单价", value: nulsPrice, unit: "USDT" },
      { name: "节点数", value: agentCount }
    ];
    const assetExchangeData = [
      { name: "总转入交易所数量", value: outTotal, unit: "USDT" },
      { name: "转回冷钱包数量", value: inTotal, unit: "USDI" },
      { name: "净转出数量", value: offset, unit: "USDI" },
      { name: "当前USDT负债数量", value: liabilities, unit: "USDT" }
    ];
    return (
      <div className="data-overview">
        <NormalCard title="冷热钱包看板" cards={walletData} />
        <NormalCard title="用户资产看板" cards={userAssetsData} />
        <NormalCard title="NULS抵押看板" cards={mortgageData} />
        <NormalCard title="项目资金交换看板" cards={assetExchangeData} />
      </div>
    );
  }
}

export default Main;
