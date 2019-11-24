import React from 'react';
import {add} from '@src/utils/util.js'
import './index.less'

export default class PageA extends React.Component {
  render(){
    return (
      <div className="content">我是PageA&{add(1,2)}</div>
    )
  }
}