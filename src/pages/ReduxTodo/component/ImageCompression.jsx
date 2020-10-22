import React, { Component } from "react";
import axios from "axios";

export default class ImageCompression extends Component {
  state = {
    base64: ""
  };
  clickUpload = () => {
    this.uploadInput.click();
  };
  handleUpload = e => {
    e.persist();
    const reader = new FileReader(),
      img = new Image();
    // 读取上传的图片的信息(lastModified, lastModifiedDate, name, size, type等)
    const file = e.target.files[0];
    // 记下上传的图片的类型, 后面会用到
    const fileType = file.type;
    // 生成canvas画布
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // MDN: 该方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，
    // readyState 会变成已完成（DONE），并触发 loadend 事件，
    // 同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
    // 也就是说, 将File对象转化为base64位字符串
    reader.readAsDataURL(file);
    // 上一步是异步操作, 读取完成后会执行onload事件, 而base64的字符串在e.target.rusult中
    reader.onload = function(e) {
      // 获得图片dom
      img.crossOrigin = "Anonymous"; //网络图片设置允许跨域
      img.src = e.target.result;
      console.log(e.target.result);
    };
    img.onload = () => {
      // 图片原始尺寸
      const originWidth = img.width;
      const originHeight = img.height;
      // 最大尺寸限制
      const maxWidth = 800,
        maxHeight = 800;
      // 目标尺寸
      let targetWidth = originWidth,
        targetHeight = originHeight;
      // 图片尺寸超过800x800的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }
      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 将图片划到canvas上
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
      this.wrap.appendChild(canvas);
      // 把canvas转成base64格式并去除头
      const base64 = canvas
        .toDataURL(fileType, 0.5)
        .replace(/^data:image\/(jpeg|jpg|png|gif);base64,/, "");
      console.log(canvas.toDataURL(fileType), 555);
      this.setState({
        base64: canvas.toDataURL(fileType, 0.5)
      });
    };
  };
  render() {
    return (
      <div onClick={this.clickUpload} ref={v => (this.wrap = v)}>
        <input
          ref={v => (this.uploadInput = v)}
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={e => this.handleUpload(e)}
        />
        <button>上传</button>
        {this.state.base64 ? <img src={this.state.base64} alt="" /> : null}
      </div>
    );
  }
}
