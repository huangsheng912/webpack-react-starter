import loadable from "@loadable/component";

const DataOverview = loadable(() => import("page/dashBoard/dataOverview"));
const AccountAddress = loadable(() => import("page/dashBoard/accountAddress"));
const Redemption = loadable(() => import("page/dashBoard/redemption"));
const RewardDetail = loadable(() => import("page/dashBoard/rewardDetail"));
const RewardDistribution = loadable(() =>
  import("page/dashBoard/rewardDistribution")
);
const RewardDistributionDetail = loadable(() =>
  import("page/dashBoard/rewardDistribution/detail")
);

const TransferOut = loadable(() => import("page/assetsManage/transferOut"));
const Broadcast = loadable(() => import("page/assetsManage/broadcast"));
const Redeem = loadable(() => import("page/assetsManage/redeem"));

const Parameter = loadable(() => import("page/configurationManage/parameter"));

const AccountManage = loadable(() => import("page/systemManage/accountManage"));

const config = [
  {
    title: "数据看板",
    icon: "dashboard",
    value: "dashBoard",
    children: [
      {
        title: "数据概览",
        value: "/dashBoard/dataOverview",
        component: DataOverview
      },
      {
        title: "账户地址",
        value: "/dashBoard/accountAddress",
        component: AccountAddress
      },
      {
        title: "兑换赎回",
        value: "/dashBoard/redemption",
        component: Redemption
      },
      {
        title: "奖励明细",
        value: "/dashBoard/rewardDetail",
        component: RewardDetail
      },
      {
        title: "奖励发放",
        value: "/dashBoard/rewardDistribution",
        component: RewardDistribution
      },
      {
        title: "奖励发放明细",
        value: "/dashBoard/rewardDistribution/detail",
        component: RewardDistributionDetail,
        hide: true
      }
    ]
  },
  {
    title: "资产管理",
    icon: "account-book",
    value: "assetsManage",
    children: [
      {
        title: "资金转出",
        value: "/assetsManage/transferOut",
        component: TransferOut
      },
      {
        title: "冷钱包交易记录",
        value: "/assetsManage/broadcast",
        component: Broadcast
      },
      {
        title: "大额赎回处理",
        value: "/assetsManage/redeem",
        component: Redeem
      }
    ]
  },
  {
    title: "配置管理",
    icon: "database",
    value: "configurationManage",
    children: [
      {
        title: "参数配置",
        value: "/configurationManage/parameter",
        component: Parameter
      }
    ]
  },
  {
    title: "系统管理",
    icon: "setting",
    value: "systemManage",
    children: [
      {
        title: "账号管理",
        value: "/systemManage/accountManage",
        component: AccountManage
        /*title: '系统管xxx理',
        icon: 'setting',
        value:'2',
        children:[
          {
            title: '系统管xaaxx理',
            icon: 'setting',
            value:'3',
            children:[
              {
                title: '系统管xssxx理',
                value: '/systemManage/2/3/accountManage',
                component: AccountManage
              }
            ]
          }
        ]*/
      }
    ]
  }
  // {
  //   title: '广播交易',
  //   value:'/broadcast',
  //   icon: 'notification',
  //   component: Broadcast
  // },
];

export default config;
