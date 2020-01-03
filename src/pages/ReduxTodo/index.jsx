import React, { Component } from "react";
import AddTodo from "./component/AddTodo";
import TodoList from "./component/TodoList";
import TodoFilter from "./component/TodoFilter";
import img1 from "src/images/img1.png";
import img2 from "src/images/img2.png";
import img3 from "src/images/img3.png";
import { throttle } from "../../utils/util";

class Index extends Component {
  constructor(props) {
    super(props);
    this.throttle = throttle(this.lazyLoad, 500);
  }
  componentDidMount() {
    //图片懒加载
    //1.IntersectionObserver  ie兼容不好
    /*const imgs = document.querySelectorAll("img.img-test");
    const observer = new IntersectionObserver(changes => {
      changes.forEach(change => {
        if (change.isIntersecting) {
          const img = change.target;
          // console.log(img.clientWidth);
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    imgs.forEach(img => {
      observer.observe(img);
    });*/
    //2. Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置 top,left,right,bottom
    this.lazyLoad();
    document.addEventListener("scroll", this.throttle);
  }
  componentWillMount() {
    document.removeEventListener("scroll", this.throttle);
  }
  lazyLoad = () => {
    const imgs = document.querySelectorAll("img.img-test");
    imgs.forEach(img => {
      if (
        img.getBoundingClientRect().top < document.documentElement.clientHeight
      ) {
        img.src = img.dataset.src;
      }
    });
  };
  removeListener = () => {
    document.removeEventListener("scroll", this.throttle);
  };

  render() {
    let imgs = [],
      i = 0;
    while (i < 10) {
      imgs.push(img1, img2);
      i++;
    }
    return (
      <div style={{ width: "600px", margin: "200px auto" }}>
        <AddTodo />
        <TodoList />
        <TodoFilter />
        <img className="iii" alt="" />
        <img className="iii" alt="" />
        {imgs.map((v, i) => (
          <img
            className="img-test"
            ref={v => (this.img = v)}
            data-src={v}
            src={img3}
            key={i}
            loading="lazy"
            style={{ width: "400px", height: "230px", marginRight: "40px" }}
          />
        ))}
        <button onClick={this.removeListener}>取消监听</button>
      </div>
    );
  }
}

export default Index;
