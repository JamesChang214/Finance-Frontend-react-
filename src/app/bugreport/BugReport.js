import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
class BugReport extends Component {
  constructor(props) {
    super(props);
    const theme = window.localStorage.getItem('trybe_theme') ? window.localStorage.getItem('trybe_theme') : 'light';
  }

  render() {
    return (
      <a href="https://loopfinance.zendesk.com/hc/en-us/community/topics" target="_blank">
        <div className="bugBoxDesign bugSidebar">
          {/* <Image src="bug.png" alt="" /> */}
          <p className="bugText">BUGS & FEEDBACK</p>
        </div>
      </a>
    )
  }
}

export default BugReport
