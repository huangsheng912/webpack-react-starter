import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleTodo } from "../store/actionCreaters/todoAction";
import "./style.less";

const mapStateToProps = state => {
  switch (state.todo.filter) {
    case "Complete":
      return { todo: [...state.todo.items.filter(v => v.complete)] };
    case "Incomplete":
      return { todo: [...state.todo.items.filter(v => !v.complete)] };
    case "All":
    default:
      return { todo: [...state.todo.items] };
  }
};
const mapDispatchToProps = {
  toggleTodo
};
@connect(mapStateToProps, mapDispatchToProps)
class TodoList extends Component {
  render() {
    const { todo, toggleTodo } = this.props;
    return (
      <div className="todo-list">
        {Array.isArray(todo) &&
          todo.map(v => (
            <div
              key={v.id}
              className={v.complete ? "item done" : "item"}
              onClick={() => toggleTodo(v.id)}
            >
              {v.value}
            </div>
          ))}
      </div>
    );
  }
}

export default TodoList;
