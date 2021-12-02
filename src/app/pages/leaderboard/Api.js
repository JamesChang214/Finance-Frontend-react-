import axios from 'axios';
import catchAxiosError from '../../util/catchAxiosError';

export async function getAcfInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/leaderboard`
    ).catch(catchAxiosError);
  return result.data;
}

export async function getCommentInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/leaderboard/comments`
    ).catch(catchAxiosError);
  return result.data;
}

export async function getRatingsInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/leaderboard/ratings`
    ).catch(catchAxiosError);
  return result.data;
}

export async function getAuthorInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/leaderboard/authors`
    ).catch(catchAxiosError);
  return result.data;
}

export async function getEngagementInfo() {
  const result = await axios
    .get(`https://${process.env.REACT_APP_TRYBE_WP}/wp-json/trybe/v1/leaderboard/engagements`
    ).catch(catchAxiosError);
  return result.data;
}
