import React from 'react';
import { Input } from 'semantic-ui-react';
const PostsSearch = () => (
  <div className="search-input">
    <Input inverted action={{ icon: "search" }} placeholder="Search..." />
  </div>
);
export default PostsSearch;
