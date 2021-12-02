import React, { Component } from 'react';
import Dashboard from '../util/dashboard/Dashboard';
import { setPageForGoogleAnalytics } from '../util/helperFunctions';

export default class CreateArticle extends Component {
  componentDidMount() {
    setPageForGoogleAnalytics('create-article');
  }

  render() {
    return <Dashboard mode="new" />;
  }
}
