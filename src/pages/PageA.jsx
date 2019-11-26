import React from 'react';
import {add,release} from 'utils/util.js'
import img1 from '../images/img1.png'
import './index.less'

export default class PageA extends React.Component {
  render(){
    return (
      <div className="content">
        我是PageAA&{add(1,2)}
        <img src={img1} alt="" />
      </div>
    )
  }
}