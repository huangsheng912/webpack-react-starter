import React from 'react';
import './index.less'

export default class PageA extends React.Component {
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
      </div>
    )
  }
}