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
import Editor from "./Editor";

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
    pictures: [], //景区照片
    credentials: [], //工商营业执照&组织结构代码证&税务登记证
    previewImgs: [],
    activeIndex: 0,
    visible: false, //预览图片
    disabled: false, //是否禁用编辑
    defaultValue: {},
    showAudit: false,
    auditType: "pass",
    rejectReason: "",
    showEditorError: false
  };
  componentDidMount() {
    const id = getQuery("id");
    const edit = getQuery("edit");
    console.log(id, edit, 897999);
    if (id) {
      this.getInfo(id);
      if (!edit) {
        this.setState({
          disabled: true
        });
      }
    }
    console.log(this.props, "==props");
  }
  async getInfo(id) {
    const res = await post("", "getScenicInfo", { scenicId: id });
    if (res.result) {
      res.result.companyCreateDate = moment(
        res.result.companyCreateDate,
        "YYYY-MM-DD"
      );
      this.editor.editor.txt.html(res.result.introduce);
      this.setState({
        defaultValue: res.result,
        pictures: res.result.pictures,
        credentials: res.result.credentials
      });
      this.props.form.setFieldsValue({ pictures: res.result.pictures });
      this.props.form.setFieldsValue({ credentials: res.result.credentials });
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
    if (this.state.disabled) return;
    const img = [...this.state[name]];
    const index = img.indexOf(pic);
    if (index > -1) {
      img.splice(index, 1);
      this.setState({
        [name]: img
      });
    }
  };
  //创建景区
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
        const { time, province, ...rest } = values;
        const params = {
          companyCreateDate: moment(time).format("YYYY-MM-DD"),
          provinceName: nameCode[province[0]],
          provinceCode: province[0],
          cityName: nameCode[province[1]],
          cityCode: province[1],
          introduce: this.editor.editor.txt.html(),
          id: getQuery("id"),
          ...rest
        };
        if (!getQuery("id")) {
          delete params.id;
        }
        const method = getQuery("edit") ? "editScenic" : "newScenic";
        post("", method, params).then(res => {
          if (res.result) {
            this.props.history.goBack();
          }
        });
      }
    });
  };
  showModal = type => {
    this.setState({
      showAudit: true,
      auditType: type
    });
  };
  handleChange = e => {
    this.setState({
      rejectReason: e.target.value
    });
  };
  handleAudit = async () => {
    const params = {
      scenicId: this.state.defaultValue.id,
      pass: this.state.auditType === "pass" ? true : false,
      rejectReason: this.state.rejectReason
    };
    const res = await post("", "reviewScenicApplication", params);
    if (res.result) {
      this.props.history.goBack();
    }
  };

  normFile = e => {
    /* console.log('Upload event:', e);
   if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;*/
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      pictures,
      credentials,
      visible,
      previewImgs,
      activeIndex,
      disabled,
      defaultValue,
      showAudit,
      auditType,
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
    const cLabel = (
      <span>
        工商营业执照&组织结构代码证&nbsp;&nbsp;
        <br />
        &税务登记证
      </span>
    );

    return (
      <div className="edit-scenic-page">
        <Form {...formItemLayout} style={{ maxWidth: "700px" }}>
          <Form.Item label="景区名称">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入景区名称" }],
              initialValue: defaultValue.scenicName
            })(<Input disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="景区等级">
            {getFieldDecorator("level", {
              initialValue: defaultValue.scenicLevel,
              rules: [{ required: true, message: "请选择景区等级" }]
            })(
              <Select disabled={disabled}>
                <Option value="AAA">AAA</Option>
                <Option value="AAAA">AAAA</Option>
                <Option value="AAAAA">AAAAA</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="景区所属省市">
            {getFieldDecorator("province", {
              initialValue: defaultValue.provinceCode
                ? [defaultValue.provinceCode, defaultValue.cityCode]
                : "",
              rules: [
                { type: "array", required: true, message: "请选择景区所属省市" }
              ]
            })(<Cascader options={cityData} disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="景区地址">
            {getFieldDecorator("address", {
              rules: [{ required: true, message: "请输入景区地址" }],
              initialValue: defaultValue.address
            })(<Input disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="景区介绍" className="editor-item">
            {/*{getFieldDecorator('introduce', {
              initialValue: defaultValue.introduce,
              rules: [{required: true, message: '请输入景区介绍',}],
            })(<TextArea disabled={disabled} />)}*/}
            <Editor ref={v => (this.editor = v)} />
            <div className="ant-form-explain">
              {showEditorError ? "请输入景区介绍" : ""}
            </div>
          </Form.Item>

          <Form.Item label="景区图片">
            {getFieldDecorator("pictures", {
              // valuePropName: 'fileList',
              // getValueFromEvent: this.normFile,
              rules: [{ required: true, message: "请上传景区图片" }]
            })(
              <Upload
                name="scenicPic"
                // listType="picture"
                accept="image/*"
                beforeUpload={e => this.beforeUpload(e, "pictures")}
              >
                <Button disabled={disabled}>
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
          <Form.Item label="运营主体公司">
            {getFieldDecorator("company", {
              initialValue: defaultValue.company,
              rules: [{ required: true, message: "请输入运营主体公司" }]
            })(<Input disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="成立日期">
            {getFieldDecorator("time", {
              initialValue: defaultValue.companyCreateDate,
              rules: [{ required: true, message: "请选择公司成立日期" }]
            })(<DatePicker disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="统一社会信用代码">
            {getFieldDecorator("creditCode", {
              initialValue: defaultValue.creditCode,
              rules: [{ required: true, message: "请输入统一社会信用代码" }]
            })(<Input disabled={disabled} />)}
          </Form.Item>
          <Form.Item label="公司类型">
            {getFieldDecorator("companyType", {
              initialValue: defaultValue.companyType,
              rules: [{ required: true, message: "请选择公司类型" }]
            })(
              <Select disabled={disabled}>
                <Option value="私企">私企</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label={cLabel}>
            {getFieldDecorator("credentials", {
              rules: [
                {
                  required: true,
                  message: "请上传工商营业执照&组织结构代码证&税务登记证"
                }
              ]
            })(
              <Upload
                name="credentialsPic"
                // listType="picture"
                accept="image/*"
                beforeUpload={e => this.beforeUpload(e, "credentials")}
              >
                <Button disabled={disabled}>
                  <Icon type="upload" />
                  添加
                </Button>
              </Upload>
            )}
            <div>
              {credentials.map((pic, index) => (
                <PicWrap
                  key={pic}
                  remove={e => this.removeImg(e, pic, "pictures")}
                  previewImage={() => this.previewImage(credentials, index)}
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {disabled ? (
              <div>
                <Button
                  type="primary"
                  onClick={() => this.showModal("pass")}
                  style={{ marginRight: "30px" }}
                >
                  通过
                </Button>
                <Button onClick={() => this.showModal("reject")}>驳回</Button>
              </div>
            ) : (
              <Button type="primary" onClick={this.handleSubmit}>
                保存
              </Button>
            )}
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
        <Modal
          title={auditType === "pass" ? "即将更新设置" : "驳回理由"}
          visible={showAudit}
          onOk={this.handleAudit}
          onCancel={() => this.setState({ showAudit: false })}
        >
          {auditType === "pass" ? (
            "更新内容将于次日0:00生效"
          ) : (
            <TextArea
              value={this.state.rejectReason}
              onChange={this.handleChange}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default Main;
