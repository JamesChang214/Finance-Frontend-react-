import React from 'react';
import { Grid, Divider, Responsive, Button, Image } from 'semantic-ui-react';
import SocialControls from './SocialControls';

const PersonSummary = ({ avatarURL, name, slug, details, description, isAuthorized, following, followers }) => {
  const { posts, comments, views, rank } = details;
  const style = { backgroundImage: `url(${avatarURL})` };
  return (
    <Grid.Row className="summary">
      <Grid.Column width="7" className="person">
        <Grid>
          <Grid.Row>
            <Grid.Column width="6" className="avatar">
              <div className="circle-border">
                <div
                  className="circle"
                  style={style}
                />
                <div className="online-mark" />
              </div>
            </Grid.Column>
            <Grid.Column width="6" className="description">
              <span className="name">{name}</span>
              <span className="nick">@{slug}</span>
              <div className="rank">
                <span>Rank:</span> <span>{rank}</span>
              </div>
              <Divider />
              <span>{description}</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>

      <div className="cz-folow-counts">
        <div className="cz-set-p cz-moni-button-hub"><div className="cz-follow-part"><b><Image src="/following.svg" />{following} Following</b> <b><Image src="/followers.svg" />{followers} Followers</b></div>
          <div className="cz-moni-button">{isAuthorized && <SocialControls />}</div>
        </div>
        <p><span>{description}</span></p>
      </div>
      <Grid.Column width="16" floated="right" className="stats">
        <Grid>
          <Grid.Row>
            <Grid.Column width="6" />
            <Grid.Column width="3">
              <Grid.Row>
                <span className="title">Posts</span>
              </Grid.Row>
              <Grid.Row>
                <span className="value">{posts}</span>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width="3">
              <Grid.Row>
                <span className="title">Comments</span>
              </Grid.Row>
              <Grid.Row>
                <span className="value">{comments}</span>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width="3">
              <Grid.Row>
                <span className="title">Views</span>
              </Grid.Row>
              <Grid.Row>
                <span className="value">{views}</span>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width="3" className="cz-dek-top-button">
              {isAuthorized && <SocialControls />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>

    </Grid.Row>
  );
};
export default PersonSummary;
