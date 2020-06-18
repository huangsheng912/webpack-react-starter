import React, { Component } from "react";
import { Table, Pagination } from "antd";

class CommonTable extends Component {
  render() {
    const {
      dataSource = [],
      total,
      changeSize,
      currentPage,
      ...rest
    } = this.props;
    return (
      <div className="common-table">
        <Table
          // columns={columns}
          dataSource={dataSource}
          rowKey={record => Math.random() * 1000}
          pagination={false}
          // loading={loading}
          {...rest}
        />
        <Pagination
          total={total}
          showTotal={total => `共 ${total} 条记录`}
          hideOnSinglePage
          onChange={page => changeSize(page - 1)}
          current={currentPage + 1}
        />
      </div>
    );
  }
}

export default CommonTable;
