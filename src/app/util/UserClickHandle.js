import React from 'react';
import { withRouter } from 'react-router-dom';

export const UserClickHOC = (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.propTypes = {};

  return withRouter(hocComponent);
};

//export default WrapperComponent => withRouter(UserClickHOC(WrapperComponent));
