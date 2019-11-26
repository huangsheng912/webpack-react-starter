import React from 'react';
import {release} from 'utils/util.js'
import './index.less'
import {Button} from 'antd'

export default class PageC extends React.Component {
  render(){
    return (
      <div className="content">
        我是PageC&{release(10,2)}
        <Button>xxx</Button>
      </div>
    )
  }
}