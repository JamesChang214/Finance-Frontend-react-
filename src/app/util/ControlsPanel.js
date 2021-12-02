import React from 'react';
import { Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ControlsPanel = ({ avatarURL, name, username }) => (
  <div className="controls-panel">
    <Link to="/profile/">
      <div className="control-btn user">
        <Image
          src={avatarURL}
          avatar
          circular
          onError={(e) => { e.target.onerror = null; e.target.src='http://guidancegroup.co.in/img/mentors/default.jpg'; }}
        />
        <p className="user-info">
          <span className="name">{name}</span>
          <span className="username">@{username}</span>
        </p>
      </div>
    </Link>
  </div>
);
export default ControlsPanel;
