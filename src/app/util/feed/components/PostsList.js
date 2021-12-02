import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import he from 'he';
import PostPreview from './PostPreview';
import './PostList.scss';
import lazyImage from '../../../../staticAssets/images/placeholder.png';
import SwiperCore, { Navigation, Scrollbar, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/pagination/pagination.min.css';

export default class PostsList extends Component {
  constructor(props) {
    SwiperCore.use([Navigation, Scrollbar, Pagination]);
    super(props);
  }

  render() {
    const { posts, clickHandler } = this.props;
    const pageName = window.location.pathname;
    //TODO : Maps warning
    return (
      <Grid>
        {pageName != '/' ?
          <Grid>
            {
              posts.map((postInfo) => {
                const {
                  id,
                  date_gmt,
                  title,
                  slug,
                  _embedded,
                  details,
                  excerpt
                } = postInfo;

                const { author } = _embedded;
                const { rating, post_comments_number } = details;
                const { rendered } = title;
                const featured_image = postInfo._embedded['wp:featuredmedia'] ? postInfo._embedded['wp:featuredmedia'][0].source_url : lazyImage;

                return (

                  <Grid.Row
                    // key={id}
                    className="post-preview"
                    onClick={() => clickHandler(postInfo)}
                  >
                    <PostPreview
                      title={he.decode(rendered)}
                      time={date_gmt}
                      name={author[0].name}
                      slug={author[0].slug}
                      url={slug}
                      articleId={id}
                      avatarURL={author[0].avatar_urls[96]}
                      rating={rating}
                      excerpt={excerpt.rendered}
                      comments={post_comments_number}
                      featured_image={featured_image}
                    />
                  </Grid.Row>
                );
              })
            }
          </Grid> :
          <Grid className="check1">
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              loop
              breakpoints={{
                1200: {
                  freemode: true,
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                768: {
                  freemode: true,
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                640: {
                  freemode: true,
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                320: {
                  freemode: true,
                  slidesPerView: 1,
                  spaceBetween: 20,
                }
              }}
              className="mySwiper"
              slideToClickedSlide
              onSwiper={swiper => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
            >
              {
                posts.map((postInfo) => {
                  const {
                    id,
                    date_gmt,
                    title,
                    slug,
                    _embedded,
                    details,
                    excerpt
                  } = postInfo;

                  const { author } = _embedded;
                  const { rating, post_comments_number } = details;
                  const { rendered } = title;
                  const featured_image = postInfo._embedded['wp:featuredmedia'] ? postInfo._embedded['wp:featuredmedia'][0].source_url : lazyImage;

                  return (
                    <SwiperSlide>
                      <PostPreview
                        title={he.decode(rendered)}
                        time={date_gmt}
                        name={author[0].name}
                        slug={author[0].slug}
                        url={slug}
                        articleId={id}
                        avatarURL={author[0].avatar_urls[96]}
                        rating={rating}
                        excerpt={excerpt.rendered}
                        comments={post_comments_number}
                        featured_image={featured_image}
                      />
                    </SwiperSlide>
                  );
                })
              }
            </Swiper>
          </Grid>
        }
      </Grid>
    );
  }
}