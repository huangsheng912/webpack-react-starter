export function add(a, b) {
  return a + b;
}

export function release(a, b) {
  return a - b;
}

export function throttle(fn, delay) {
  let wait = false;
  return function() {
    const that = this;
    const args = arguments;
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
    const that = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      fn.apply(that, args);
      timer = null;
    }, delay);
  };
}
