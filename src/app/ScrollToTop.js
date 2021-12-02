import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      document.querySelector(".app-body").scrollTo(0, 0)
    }
  }

  render() {
    return false;
  }
}
export default withRouter(ScrollToTop);