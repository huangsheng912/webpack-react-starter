import React, { Component } from "react";
import { connect } from "react-redux";
import { filterTodo } from "../store/actionCreaters/todoAction";

const filter = {
  ALL: "All",
  COMPLETE: "Complete",
  INCOMPLETE: "Incomplete"
};

@connect(null, { filterTodo })
class TodoFilter extends Component {
  state = { type: "All" };
  filterTodo = type => {
    this.setState({
      type
    });
    this.props.filterTodo(type);
  };
  render() {
    const { filterTodo } = this.props;
    const { type } = this.state;
    return (
      <div>
        {Object.keys(filter).map(v => (
          <span
            key={v}
            className={
              type === filter[v] ? "filter-item active-filter" : "filter-item"
            }
            onClick={() => this.filterTodo(filter[v])}
          >
            {filter[v]}
          </span>
        ))}
      </div>
    );
  }
}

export default TodoFilter;
