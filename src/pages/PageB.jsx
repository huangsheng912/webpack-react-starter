import React from 'react';
import {add,release} from 'utils/util.js'

import './index.less'

export default class PageB extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      a:111
    }
  }
  render(){
    return (
      <div className="content">我是PageBb-x--{this.state.a}
        <button onClick={()=>{this.setState({a:555})}}>DDD</button>
        {add(2,3)+release(5,3)}
      </div>
    )
  }
}