import React, { Component } from "react";
import AddTodo from "./component/AddTodo";
import TodoList from "./component/TodoList";
import TodoFilter from "./component/TodoFilter";

class Index extends Component {
  render() {
    return (
      <div style={{ width: "600px", margin: "200px auto" }}>
        <AddTodo />
        <TodoList />
        <TodoFilter />
      </div>
    );
  }
}

export default Index;
