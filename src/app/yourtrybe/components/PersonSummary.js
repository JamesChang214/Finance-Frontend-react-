import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Responsive, Button, Container, Image, Divider } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import Engagement from '../engagement/engagement';
import Following from '../following/Following';
import MyArticles from '../my-articles/MyArticles';
import Settings from '../settings/Settings';
import Notifications from '../notifications/Notifications';
import SideControl from './SideControl';

const PersonSummary = ({ avatarURL, name, slug, details, followers, following, description, refUrl }) => {
  const { posts, comments, views, balance, rank } = details;
  const pageName = window.location.pathname;
  const [copySuccess, setCopySuccess] = useState('false');
  function copyToClipboard(e) {
    setCopySuccess('true');
    setTimeout(() => {
      setCopySuccess('false')
    }, 200)
  };
  return (
    <Grid className="page-wrapper">
      <Helmet>
        <title>Loop Finance{pageName == '/profile/' ? ' | Profile' : ''}{pageName == '/profile/my-articles/' ? ' | My Article' : ''}{pageName == '/profile/following/' ? ' | Following' : ''}{pageName == '/profile/notifications/' ? ' | Notifications' : ''}{pageName == '/profile/settings/' ? ' | Settings' : ''}</title>
      </Helmet>
      <SideControl />
      <Container className="cz-profile-container">
        <Grid.Row className="person-summary">
          {/* phones & tablets */}
          {/* <Responsive
            as={Grid.Column}
            className="person"
            width="16"
            minWidth={Responsive.onlyMobile.minWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width="16" className="avatar">
                  <div className="circle-border">
                    <div
                      className="circle"
                      style={{ backgroundImage: `url(${avatarURL})` }}
                    />
                    <div className="online-mark" />
                  </div>
                </Grid.Column>
                <Grid.Column width="16" className="description">
                  <span className="name">{name}</span>
                  <span className="nick">@{slug}</span>
                  <div className="rank">
                    <span>Rank:</span> <span>{rank}</span>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Responsive> */}
          {/* computers */}
          <Responsive
            as={Grid.Column}
            className="person"
            width="7"
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width="4" className="avatar cz-profile-avtar">
                  <div className="circle-border">
                    <div
                      className="circle"
                      style={{ backgroundImage: `url(${avatarURL})` }}
                    />
                    <div className="online-mark" />
                  </div>
                </Grid.Column>
                <Grid.Column width="12" className="description cz-decription">
                  <span className="name">{name}</span>

                  <span className="nick">@{slug}</span>
                  <div className="rank">
                    <span>Rank:</span> <span>{rank}</span>
                  </div>

                  <div className="total-events-cz">
                    <Grid>
                      <Grid><span className="title">Token balance:</span> <span className="value">{balance ? balance : 0}</span></Grid>
                      <Grid><span className="title">Posts:</span> <span className="value">{posts}</span></Grid>
                      <Grid><span className="title">Comments:</span> <span className="value">{comments}</span></Grid>
                      <Grid><span className="title">Views:</span> <span className="value">{views}</span></Grid>
                    </Grid>
                  </div>
                </Grid.Column>
                <div className="cz-folow-counts">
                  <div className="cz-set-p"><div className="cz-follow-part"><b><Image src="/following.svg" />{following} Following</b> <b><Image src="/followers.svg" />{followers} Followers</b></div>
                    {/* <Button><b>+</b>FOLLOW</Button> */}
                  </div>
                  <p>{description}</p>
                </div>
                <div className="total-events-cz cz-mob-new-follow">
                  <Grid>
                    <Grid><span className="title">Posts:</span> <span className="value">{posts}</span></Grid>
                    <Grid><span className="title">Comments:</span> <span className="value">{comments}</span></Grid>
                    <Grid><span className="title">Views:</span> <span className="value">{views}</span></Grid>
                    <Grid><span className="title">Token balance:</span> <span className="value">{balance ? balance : 0}</span></Grid>
                  </Grid>
                </div>
                <div className="copyLink">
                  <span style={{ color: 'var(--pink)', marginTop: '1rem', display: 'block', textAlign: 'center' }}><b style={{ color: '#fff' }}>Referral Link:</b> {refUrl}
                  </span>
                  <div className="copied" id="copiedTooltip"><b className={copySuccess != 'false' ? '' : 'copiedTooltip'}>Copied</b><Image src="/copy-icon.svg" className="copyIcon" onClick={() => { navigator.clipboard.writeText(refUrl), copyToClipboard} } /></div>
                </div>
              </Grid.Row>
            </Grid>
          </Responsive>

          {/* <Responsive
            as={Grid.Column}
            width="16"
            floated="right"
            className="stats"
            minWidth={Responsive.onlyMobile.minWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
          >
            <Grid>
              <Grid.Row width="16">
                <Grid.Column width="16">
                  <Link to="../profile/my-articles" className="green-bordered-button">
                    <Button fluid style={{ background: `${pageName == '/profile/my-articles' ? 'var(--green)' : 'transparent'}`, color: 'var(--text-color)' }}>My Articles</Button>
                  </Link>
                </Grid.Column>
                <Grid.Column width="16">
                  <Link to="../profile/following" className="green-bordered-button">
                    <Button fluid style={{ background: `${pageName == '/profile/following' ? 'var(--green)' : 'transparent'}`, color: 'var(--text-color)' }}>Follows</Button>
                  </Link>
                </Grid.Column>
                <Grid.Column width="16">
                  <Link to="../profile/settings" className="green-bordered-button">
                    <Button fluid style={{ background: `${pageName == '/profile/settings' ? 'var(--green)' : 'transparent'}`, color: 'var(--text-color)' }}>Settings</Button>
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Responsive> */}
        </Grid.Row>
        <Grid className="cz-tabs-profile">
          <Grid.Row width="16">
            <Grid.Column width="4">
              <Link to="../my-articles/" className="green-bordered-button">
                <Button fluid className={pageName == '/profile/my-articles/' ? 'active-tab-cz-new' : ''}>Articles</Button>
              </Link>
            </Grid.Column>
            <Grid.Column width="4">
              <Link to="../engagement/" className="green-bordered-button">
                <Button fluid className={pageName == '/profile/engagement/' ? 'active-tab-cz-new' : ''}>Engagement</Button>
              </Link>
            </Grid.Column>
            <Grid.Column width="4">
              <Link to="../following/" className="green-bordered-button">
                <Button fluid className={pageName == '/profile/following/' ? 'active-tab-cz-new' : ''}>Following</Button>
              </Link>
            </Grid.Column>
            {/* <Grid.Column width="4">
              <Link to="../notifications/" className="green-bordered-button">
                <Button fluid className={pageName == '/profile/notifications' ? 'active-tab-cz-new' : ''}>Notifications</Button>
              </Link>
            </Grid.Column> */}
            <Grid.Column width="4">
              <Link to="../settings/" className="green-bordered-button">
                <Button fluid className={pageName == '/profile/settings/' ? 'active-tab-cz-new' : ''}>Settings</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {pageName == '/profile/my-articles/' ? <MyArticles /> : null}
        {pageName == '/profile/engagement/' ? <Engagement /> : null}
        {pageName == '/profile/following/' ? <Following /> : null}
        {pageName == '/profile/settings/' ? <Settings /> : null}
        {pageName == '/profile/notifications/' ? <Notifications /> : null}
      </Container>
    </Grid>
  );
};
export default PersonSummary;
