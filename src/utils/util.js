export function throttle(fn, delay) {
  let wait = false;
  return function() {
    let that = this,
      args = arguments;
    if (!wait) {
      wait = true;
      setTimeout(function() {
        fn.apply(that, args);
        wait = false;
      }, delay);
    }
  };
}

export function debounce(fn, delay) {
  let timer;
  return function() {
    let that = this,
      args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      fn.apply(that, args);
      timer = null;
    }, delay);
  };
}

export function getQuery(name) {
  let res = "";
  const search = window.location.href.split("?")[1];
  if (search) {
    const queryItem = search.split("&");
    let query = {};
    queryItem.map(item => {
      const key = item.split("=")[0];
      const value = item.split("=")[1];
      query[key] = value;
    });
    for (let i in query) {
      if (name === i) {
        res = query[i];
      }
    }
  }
  return res;
}
