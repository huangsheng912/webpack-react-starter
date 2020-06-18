import React from "react";
import "./index.less";
import { upload, post } from "utils/request";
import {
  Form,
  Input,
  Icon,
  Cascader,
  Select,
  Button,
  Upload,
  DatePicker,
  message,
  Modal
} from "antd";
import provinceCity from "utils/province-city";
import moment from "moment";
import Viewer from "react-viewer";
import { getQuery } from "utils/util";
import Editor from "../../scenicInfo/editScenic/Editor";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

let cityData = [],
  nameCode = {};
provinceCity.map(province => {
  nameCode[province.code] = province.name;
  const provinceData = {
    value: province.code,
    label: province.name,
    children: []
  };
  const citys = province.cityList;
  if (citys.length) {
    citys.map(city => {
      nameCode[city.code] = city.name;
      provinceData.children.push({
        value: city.code,
        label: city.name
      });
    });
  }
  cityData.push(provinceData);
});

function PicWrap({ src, remove, previewImage }) {
  return (
    <div className="pic-wrap" onClick={previewImage}>
      <img src={src} alt="" />
      <Icon type="close" onClick={remove} />
    </div>
  );
}

@Form.create()
class Main extends React.Component {
  state = {
    scenicList: [],
    pictures: [], //景点照片
    previewImgs: [],
    activeIndex: 0,
    visible: false, //预览图片
    defaultValue: {},
    showEditorError: false
  };
  componentDidMount() {
    this.getScenic();
    const id = getQuery("id");
    if (id) {
      this.getInfo(id);
    }
    console.log(this.props, "==props");
  }
  async getScenic() {
    const params = {
      pageNumber: 0,
      pageSize: 100
    };
    const res = await post("", "scenicPageList", params);
    if (res.result) {
      this.setState({
        scenicList: res.result.list
      });
    }
  }
  async getInfo(id) {
    const res = await post("", "getPlaceById", { id });
    if (res.result) {
      this.editor.editor.txt.html(res.result.introduce);
      this.setState({
        defaultValue: res.result,
        pictures: res.result.pictures
      });
      this.props.form.setFieldsValue({ pictures: res.result.pictures });
    }
  }

  beforeUpload = (file, name) => {
    console.log(file, name, 55);
    this.myUpload(file, name);
    return false;
  };
  //上传图片
  myUpload = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await upload("/upload/image", formData);
    if (res.result) {
      this.setState(
        state => ({
          [name]: [...state[name], res.result.url]
        }),
        () => {
          this.props.form.setFieldsValue({ [name]: this.state[name] });
        }
      );
    }
  };
  //预览图片
  previewImage = (pics, index) => {
    console.log(1);
    const images = pics.map(pic => ({ src: pic }));
    this.setState(
      {
        previewImgs: images,
        activeIndex: index,
        visible: true
      },
      () => {
        console.log(this.state.previewImgs);
      }
    );
  };
  //删除图片
  removeImg = (e, pic, name) => {
    e.stopPropagation();
    const img = [...this.state[name]];
    const index = img.indexOf(pic);
    if (index > -1) {
      img.splice(index, 1);
      this.setState({
        [name]: img
      });
    }
  };
  //创建打卡点
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(
        values,
        "=====valus",
        this.editor.editor.txt.html(),
        11,
        this.editor.editor.txt.text()
      );
      if (this.editor.editor.txt.text()) {
        this.setState({
          showEditorError: false
        });
      } else {
        this.setState({
          showEditorError: true
        });
        return;
      }
      if (!err) {
        const params = {
          id: getQuery("id"),
          introduce: this.editor.editor.txt.html(),
          ...values
        };
        if (!getQuery("id")) {
          delete params.id;
        }
        const method = getQuery("edit") ? "editPlace" : "newPlace";
        post("", method, params).then(res => {
          if (res.result) {
            this.props.history.goBack();
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      scenicList,
      pictures,
      visible,
      previewImgs,
      activeIndex,
      defaultValue,
      showEditorError
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    return (
      <div className="edit-scenic-page">
        <Form {...formItemLayout} style={{ maxWidth: "700px" }}>
          <Form.Item label="所属景区">
            {getFieldDecorator("scenicId", {
              initialValue: defaultValue.scenicId,
              rules: [{ required: true, message: "请选择所属景区" }]
            })(
              <Select>
                {scenicList.map(scenic => (
                  <Option key={scenic.id} value={scenic.id}>
                    {scenic.scenicName}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="打卡景点名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入景点名称" }],
              initialValue: defaultValue.name
            })(<Input />)}
          </Form.Item>
          <Form.Item label="景点介绍" className="editor-item">
            <Editor ref={v => (this.editor = v)} />
            <div className="ant-form-explain">
              {showEditorError ? "请输入景点介绍" : ""}
            </div>
          </Form.Item>

          <Form.Item label="景点图片">
            {getFieldDecorator("pictures", {
              // valuePropName: 'fileList',
              // getValueFromEvent: this.normFile,
              rules: [{ required: true, message: "请上传景点图片" }]
            })(
              <Upload
                name="scenicPic"
                // listType="picture"
                accept="image/*"
                beforeUpload={e => this.beforeUpload(e, "pictures")}
              >
                <Button>
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            )}
            <div>
              {pictures.map((pic, index) => (
                <PicWrap
                  key={pic}
                  remove={e => this.removeImg(e, pic, "pictures")}
                  previewImage={() => this.previewImage(pictures, index)}
                />
              ))}
            </div>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
          </Form.Item>
        </Form>
        <Viewer
          visible={visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
          images={previewImgs}
          activeIndex={activeIndex}
          drag={false}
          zoomable={false}
          scalable={false}
          downloadable={false}
          attribute={false}
          noNavbar
        />
      </div>
    );
  }
}

export default Main;
