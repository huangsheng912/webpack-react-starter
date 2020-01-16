import React, { Component } from "react";
import AddTodo from "./component/AddTodo";
import TodoList from "./component/TodoList";
import TodoFilter from "./component/TodoFilter";
import img1 from "src/images/img1.png";
import img2 from "src/images/img2.png";
import img3 from "src/images/img3.png";
import { throttle } from "../../utils/util";

import html2canvas from "html2canvas";
import QRCode from "qrcode";
class Index extends Component {
  constructor(props) {
    super(props);
    this.throttle = throttle(this.lazyLoad, 500);
  }
  async componentDidMount() {
    //将页面生成二维码，qrcodejs2，qrcode
    await this.testQRCode();

    //将页面部分区域转化为canvas图片
    this.testHtml2Canvas();
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
  componentWillUnmount() {
    document.removeEventListener("scroll", this.throttle);
  }
  testHtml2Canvas = async () => {
    //根据window.devicePixelRatio获取像素比
    function DPR() {
      if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio;
      }
      return 1;
    }
    //将传入值转为整数
    function parseValue(value) {
      return parseInt(value, 10);
    }
    async function drawCanvas(selector) {
      // 获取想要转换的 DOM 节点
      const dom = document.querySelector(selector);
      const box = window.getComputedStyle(dom);
      // DOM 节点计算后宽高
      const width = parseValue(box.width);
      const height = parseValue(box.height);
      // 获取像素比
      const scaleBy = DPR();
      // 创建自定义 canvas 元素
      const canvas = document.createElement("canvas");
      // // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      canvas.width = width * scaleBy;
      canvas.height = height * scaleBy;
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // 获取画笔
      const context = canvas.getContext("2d");
      // 将所有绘制内容放大像素比倍
      context.scale(scaleBy, scaleBy);
      // 将自定义 canvas 作为配置项传入，开始绘制
      return await html2canvas(dom, { canvas });
    }
    const pic = await drawCanvas("div.html-canvas-test");
    const app = document.getElementById("test-page");
    app.insertBefore(pic, this.htmlCanvas);
    /*html2canvas(this.htmlCanvas).then(canvas => {
      console.log(canvas);
      const app = document.getElementById("test-page");
      app.insertBefore(canvas, this.htmlCanvas);
    });*/
  };
  testQRCode = async () => {
    const url = location.href;
    const src = await QRCode.toDataURL(url);
    this.img.src = src;
  };
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
    this.testHtml2Canvas();
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
      <div style={{ width: "600px", margin: "200px auto" }} id="test-page">
        <div className="html-canvas-test" ref={v => (this.htmlCanvas = v)}>
          <img alt="" ref={v => (this.img = v)} style={{ width: "132px" }} />
          <AddTodo />
          <TodoList />
          <TodoFilter />
        </div>
        <div>
          {imgs.map((v, i) => (
            <img
              className="img-test"
              data-src={v}
              src={img3}
              key={i}
              loading="lazy"
              style={{ width: "400px", height: "230px", marginRight: "40px" }}
            />
          ))}
        </div>

        <button onClick={this.removeListener}>取消监听</button>
      </div>
    );
  }
}

export default Index;
