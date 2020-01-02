import React, { Component } from "react";
import { connect } from "react-redux";
import { addTodo, asyncAddTodo } from "../store/actionCreaters/todoAction";
import { Input } from "antd";

@connect(null, { addTodo, asyncAddTodo })
class AddTodo extends Component {
  state = {
    value: ""
  };
  change = v => {
    this.setState({
      value: v
    });
  };
  handleTodo = () => {
    if (!this.state.value) return;
    this.props.asyncAddTodo(this.state.value);
    this.setState({
      value: ""
    });
  };
  render() {
    return (
      <div>
        <Input
          type="text"
          value={this.state.value}
          onChange={v => this.change(v.target.value)}
        />
        <button onClick={this.handleTodo}>Add Todo</button>
      </div>
    );
  }
}

export default AddTodo;
