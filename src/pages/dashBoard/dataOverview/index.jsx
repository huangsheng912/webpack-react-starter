import React from "react";
import "./index.less";
import { get } from "utils/request";
// import { Card, Col, Row } from 'antd';
// import ChartSelect from "components/ChartSelect";
// import LineChart from "components/LineChart";
import { transformNum } from "utils/util";

const configInfo = JSON.parse(localStorage.getItem("configInfo")) || {};

function NormalCard(props) {
  return (
    <div className="normal-card">
      <h3>{props.title}</h3>
      <ul>
        {props.cards.map((v, i) => (
          <li key={i}>
            <p className="item-title">{v.name}</p>
            <p className="item-value">
              <span>{v.value || 0}</span>
              {v.unit}
            </p>
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
      this.setState({
        hotWalletUsdtBalance: transformNum({
          n: res.data.hotWalletUsdtBalance,
          d: configInfo.usdiDecimals
        }), //热钱包（准备金账户）usdt余额
        hotWalletEthBalance: res.data.hotWalletEthBalance, //热钱包eth余额
        hotWalletRate: transformNum({
          n: res.data.hotWalletRate,
          d: configInfo.rateDecimals,
          p: true
        }), //当前准备金率
        todayRedeemBalance: transformNum({
          n: res.data.todayRedeemBalance,
          d: configInfo.usdiDecimals
        }), //今日快速提现剩余额度---
        difference: transformNum({
          n: res.data.difference,
          d: configInfo.usdiDecimals
        }), //快速提现资金缺口--
        coldWalletUsdtBalance: transformNum({
          n: res.data.coldWalletUsdtBalance,
          d: configInfo.usdiDecimals
        }), //冷钱包usdt余额
        coldWalletEthBalance: res.data.coldWalletEthBalance, //冷钱包eth余额
        bigRedeemTotal: transformNum({
          n: res.data.bigRedeemTotal,
          d: configInfo.usdiDecimals
        }) //剩余待处理的大额提现总额
      });
    }
  }
  //基金资金充提看板
  async getAssetExchange() {
    const res = await get("/api/dashboard/assetExchange");
    if (res.success) {
      this.setState({
        outTotal: transformNum({
          n: res.data.outTotal,
          d: configInfo.usdiDecimals
        }), //总转入基金账户usdt数量
        inTotal: transformNum({
          n: res.data.inTotal,
          d: configInfo.usdiDecimals
        }), //总提取基金账户usdt数量
        offset: transformNum({
          n: res.data.offset,
          d: configInfo.usdiDecimals
        }), //净转入基金账户usdt数量
        liabilities: transformNum({
          n: res.data.liabilities,
          d: configInfo.usdiDecimals
        }) //项目当前负债
      });
    }
  }
  //用户资产数据看板
  async getUserAsset() {
    const res = await get("/api/dashboard/userAsset");
    if (res.success) {
      this.setState({
        userCount: res.data.userCount, //持币用户总数
        smallBalanceUserCount: res.data.smallBalanceUserCount, //小额持币用户总数
        effectiveUserCount: res.data.effectiveUserCount, //参与收益计算的用户总数
        yesterdayAddUserCount: res.data.yesterdayAddUserCount, //今日新增用户数
        assetTotal: transformNum({
          n: res.data.assetTotal,
          d: configInfo.usdiDecimals
        }), //usdi流通量
        effectiveAssetTotal: transformNum({
          n: res.data.effectiveAssetTotal,
          d: configInfo.usdiDecimals
        }), //参与收益计算的usdi数量
        yesterUsdiEarning: transformNum({
          n: res.data.yesterUsdiEarning,
          d: configInfo.usdiDecimals
        }), //昨日发放usdi收益总数
        yesterNulsEarning: transformNum({
          n: res.data.yesterNulsEarning,
          d: configInfo.usdiDecimals
        }) //昨日发放nuls共识总数
      });
    }
  }
  //抵押数据看板
  async getMortgage() {
    const res = await get("/api/dashboard/mortgage");
    if (res.success) {
      this.setState({
        mortgateRate: transformNum({
          n: res.data.mortgateRate,
          d: configInfo.rateDecimals,
          p: true
        }), //当前抵押率
        mortgateTotal: transformNum({
          n: res.data.mortgateTotal,
          d: configInfo.usdiDecimals
        }), //当前抵押总数
        nulsPrice: transformNum({
          n: res.data.nulsPrice,
          d: configInfo.nulsDecimals
        }), //抵押率计算执行的nuls单价
        agentCount: res.data.agentCount //节点数量
      });
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
      liabilities
    } = this.state;
    const walletData = [
      { name: "准备金账户余额", value: hotWalletUsdtBalance, unit: "USDT" },
      { name: "当前准备金率", value: hotWalletRate },
      { name: "今日快速提现剩余额度", value: todayRedeemBalance, unit: "USDI" },
      { name: "待处理的大额提现数量", value: bigRedeemTotal, unit: "USDI" },
      { name: "缺口", value: difference, unit: "USDT" },
      { name: "冷钱包余额", value: coldWalletUsdtBalance, unit: "USDT" },
      { name: "合约地址ETH余额", value: hotWalletEthBalance, unit: "ETH" }
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
      { name: "上一日增长数量", value: yesterdayAddUserCount, unit: "USDI" }
    ];
    const mortgageData = [
      { name: "当前抵押率", value: mortgateRate },
      { name: "抵押总数", value: mortgateTotal, unit: "USDI" },
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
