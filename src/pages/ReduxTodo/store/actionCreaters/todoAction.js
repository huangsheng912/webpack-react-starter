export const addTodo = value => ({
  type: "ADD_TODO",
  preload: {
    id: new Date().getTime(),
    complete: false,
    value
  }
});

export const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  preload: { id }
});

export const filterTodo = type => ({
  type: "FILTER_TODO",
  preload: { type }
});

export const asyncAddTodo = value => (dispatch, getState) => {
  //可以通过getState拿到store，然后根据某些状态做一下判断
  const state = getState();
  console.log(state, "---aysnc-get-state");
  setTimeout(() => {
    dispatch(addTodo(value));
  }, 1500);
};
