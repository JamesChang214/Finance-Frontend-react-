import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Grid, Image, Label, Card } from 'semantic-ui-react';
import LazyImage from './LazyLoad';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/pagination/pagination.min.css';

const PostPreview = ({
  title,
  name,
  slug,
  avatarURL,
  time,
  rating,
  comments,
  featured_image,
  url,
  excerpt
}) => {
  const style = { backgroundImage: `url(${featured_image})`, height: '100%' };
  // const boldStyle = { fontSize: '1em', fontWeight: 'bold' };
  const style1 = { fontSize: '1.5em', color: 'var(--green)' };
  const style2 = { fontSize: '1.5em' };
  const pageName = window.location.pathname;
  return (
    // <Grid className="check2">
    <React.Fragment>
      {pageName != '/'
        ? (
          <React.Fragment>
            <LazyImage src={featured_image} size="large" url={`../${url}`} />
            <Grid.Column className="post-preview-info cz-new-card" width={8}>
              <Grid as={url && Link} to={`../../${url}/`} className="noselect" style={{ padding: '15px' }}>
                <Grid.Row verticalAlign="top">
                  <Grid.Column width={2}>
                    <Image
                      className="post-preview-avatar"
                      circular
                      rounded
                      src={avatarURL}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'http://guidancegroup.co.in/img/mentors/default.jpg'; }}
                    />
                  </Grid.Column>
                  <Grid.Column width={9}>
                    <Grid.Row>{name}</Grid.Row>
                    <Grid.Row className="dark-text" style={{ fontSize: '1.2em', color: 'var(--green)' }}>@{slug}</Grid.Row>
                  </Grid.Column>
                  <Grid.Column className="dark-text" floated="right" width={3}>
                    {moment
                      .utc(time)
                      .local()
                      .fromNow()
                      .replace(/\w+[.!?]?$/, '')}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="middle">
                  <Grid.Column>
                    <h4 className="post-preview-title" style={{ marginBottom: '0' }}>
                      {title.length > 90 ? title.substr(0, 80) + '...' : title}
                    </h4>
                    <p className="dark-text" style={{ fontSize: '1.1em' }} dangerouslySetInnerHTML={{ __html: excerpt }} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="bottom">
                  <Grid.Column className="dark-text" style={style2}>
                    <Label><Image className="icon_img" src="/img/bomb.png" wrapped ui={false} /> {rating}</Label>
                    <Label><Image className="icon_img" src="/img/cheet.png" wrapped ui={false} /> {comments} Comments</Label>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>


          </React.Fragment>
        )
        : (
          <Card as={url && Link} to={`../${url}`}>
            <Image src={featured_image} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{name}</Card.Header>
              <Card.Description>
                {title.length > 50 ? title.substr(0, 50) + '...' : title}
              </Card.Description>
              <Card.Meta>
                <Image src={avatarURL} alt="" />
                <span className="date">{moment
                  .utc(time)
                  .local()
                  .fromNow()
                  .replace(/\w+[.!?]?$/, '')}
                </span>
              </Card.Meta>
            </Card.Content>
          </Card>
        )
      }
    </React.Fragment>
  );
};

export default PostPreview;
