import React from "react";
import "./index.less";
import { Select, Input, Button, TimePicker } from "antd";
import { get } from "utils/request";
import moment from "moment";
const { Option } = Select;

class Main extends React.Component {
  state = {
    disabled: true
  };
  componentDidMount() {
    this.getParameter();
  }
  async getParameter() {
    const res = await get("/usdi/configuration/parameter");
    if (res.success) {
      this.setState({
        parameters: res.data
      });
    }
  }
  renderContent(item) {
    const formatTime = moment(item.val2).format("HH:mm");
    return (
      <div className="item-content mb_20" key={item.label}>
        <span className="label">
          {item.label}
          <span className="fr">{item.prefix}</span>
        </span>
        <Select
          value={item.val1}
          onChange={v => item.onSelect(v, item.sVal1)}
          disabled={item.disabled}
        >
          {item.typeEnum.map(v => (
            <Option value={v.value} key={v.value}>
              {v.label}
            </Option>
          ))}
        </Select>
        {item.label === "收益发放频次" ? (
          <TimePicker
            value={moment(formatTime, "HH:mm")}
            onChange={v => item.onChange(v, item.sVal2)}
            format={"HH:mm"}
            disabled={item.disabled}
          />
        ) : (
          <Input
            onChange={v => item.onChange(v.target.value, item.sVal2)}
            disabled={item.disabled}
            value={item.val2}
          />
        )}
        {item.suffix}
      </div>
    );
  }
  onSelect = (v, type) => {
    const newParameter = { ...this.state.parameters, ...{ [type]: v } };
    this.setState({
      parameters: newParameter
    });
  };
  onChange = (v, type) => {
    const newParameter = { ...this.state.parameters, ...{ [type]: v } };
    this.setState({
      parameters: newParameter
    });
  };
  changeDisabled = () => {
    this.setState({
      disabled: !this.state.disabled
    });
  };
  doSave = () => {
    const obj = { ...this.state.parameters };
    obj.SYFFPCValue = moment(obj.SYFFPCValue).format("HH:mm");
    console.log(this.state, "---obj", obj);
  };
  render() {
    const { disabled, parameters = {} } = this.state;
    const type1 = [
      { label: "大于", value: "大于" },
      { label: "大于等于", value: "大于等于" },
      { label: "等于", value: "等于" },
      { label: "小于等于", value: "小于等于" },
      { label: "小于", value: "小于" }
    ];
    const type2 = [
      { label: "天", value: "天" },
      { label: "周一", value: "周一" },
      { label: "周二", value: "周二" },
      { label: "周三", value: "周三" },
      { label: "周四", value: "周四" },
      { label: "周五", value: "周五" },
      { label: "周六", value: "周六" },
      { label: "周日", value: "周日" }
    ];
    const itemArr = [
      {
        label: "单用户日赎回限额",
        prefix: "",
        suffix: "USDI",
        typeEnum: type1,
        val1: parameters.DYHRSHXEType,
        val2: parameters.DYHRSHXEValue,
        sVal1: "DYHRSHXEType",
        sVal2: "DYHRSHXEValue",
        disabled: disabled,
        onSelect: this.onSelect,
        onChange: this.onChange
      },
      {
        label: "平台日赎回总限额",
        prefix: "",
        suffix: "USDI",
        typeEnum: type1,
        val1: parameters.PTRSHXEType,
        val2: parameters.PTRSHXEValue,
        sVal1: "PTRSHXEType",
        sVal2: "PTRSHXEValue",
        disabled: disabled,
        onSelect: this.onSelect,
        onChange: this.onChange
      },
      {
        label: "收益发放频次",
        prefix: "每",
        suffix: "",
        typeEnum: type2,
        val1: parameters.SYFFPCType,
        val2: parameters.SYFFPCValue,
        sVal1: "SYFFPCType",
        sVal2: "SYFFPCValue",
        disabled: disabled,
        onSelect: this.onSelect,
        onChange: this.onChange
      },
      {
        label: "准备金率",
        prefix: "",
        suffix: "%",
        typeEnum: type1,
        val1: parameters.ZBJLType,
        val2: parameters.ZBJLValue,
        sVal1: "ZBJLType",
        sVal2: "ZBJLValue",
        disabled: disabled,
        onSelect: this.onSelect,
        onChange: this.onChange
      }
    ];
    return (
      <div className="parameter-manage">
        <div className="content shadow bg-white">
          {itemArr.map(v => this.renderContent(v))}
          {disabled ? (
            <div className="btn-wrap">
              <Button onClick={this.changeDisabled} type="primary">
                编辑
              </Button>
            </div>
          ) : (
            <div className="btn-wrap">
              <Button type="primary" onClick={this.doSave}>
                保存
              </Button>
              <Button onClick={this.changeDisabled}>取消</Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Main;
