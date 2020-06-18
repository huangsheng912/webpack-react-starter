import React from "react";
import E from "wangeditor";
import { upload } from "../../../../utils/request";
import { message } from "antd";

class Editor extends React.Component {
  state = {};
  componentDidMount() {
    this.initEditor();
  }

  initEditor() {
    const elem = this.editorElem;
    const editor = new E(elem);
    this.editor = editor;
    editor.customConfig.zIndex = 100;
    /*let url = "/test";
    editor.customConfig.uploadImgServer = url;*/
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.customUploadImg = async (files, insert) => {
      // files 是 input 中选中的文件列表
      console.log(files);
      if (files[0]) {
        const url = await this.handleUpload(files[0]);
        if (url) {
          insert(url);
        } else {
          message.error("插入图片失败");
        }
      }
    };
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      // 'fontName', // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      // 'backColor', // 背景颜色
      // "link", // 插入链接
      // "list", // 列表
      "justify", // 对齐方式
      // "quote", // 引用
      // 'emoticon', // 表情
      "image", // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editor.create();
  }
  handleUpload = async file => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await upload("/upload/image", formData);
      if (res.result) {
        return res.result.url;
      }
      return "";
    } catch (e) {
      return "";
    }
  };
  render() {
    return (
      <div
        className="editor-wrap"
        ref={v => (this.editorElem = v)}
        style={{ backgroundColor: "#fff" }}
      ></div>
    );
  }
}

export default Editor;
