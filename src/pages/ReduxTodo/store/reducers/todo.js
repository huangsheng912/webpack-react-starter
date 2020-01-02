const initialState = {
  items: [],
  filter: "All"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "ADD_TODO": {
      return {
        ...state,
        items: [...state.items, action.preload]
      };
    }
    case "TOGGLE_TODO": {
      state.items.map(v => {
        if (v.id === action.preload.id) {
          v.complete = !v.complete;
        }
      });
      console.log(state, "-ssllslsl", action.preload.id);
      return { ...state };
    }
    case "FILTER_TODO": {
      return {
        ...state,
        filter: action.preload.type
      };
    }
    default:
      return state;
  }
}
