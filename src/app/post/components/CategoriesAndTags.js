import React from 'react';
import he from 'he';
import { Link } from 'react-router-dom';
import {
  Grid,
  Responsive,
} from 'semantic-ui-react';

const CategoriesAndTags = ({ categories }) => {
  return (
    <div>
      <Responsive
        as={Grid.Column}
        width="16"
        minWidth={Responsive.onlyComputer.minWidth}
      >
        <div className="post-categories-n-tags">
          <div className="post-categories">
            {categories && categories.slice(0, 8).map(({ name, id }) => (
              <div className="post-category" key={id}>
                <Link to={`../category/${he.decode(name).replace(/\s+/g, '-').toLowerCase()}`}>{he.decode(name)}</Link>
              </div>
            ))}
          </div>
          {/* <div className="post-tags">
            {tags.map(({ name }) => (
              <div className="post-tag">{name}</div>
            ))}
          </div> */}
        </div>
      </Responsive>
      <Responsive
        as={Grid.Column}
        width="16"
        minWidth={Responsive.onlyMobile.minWidth}
        maxWidth={Responsive.onlyTablet.minWidth}
      >
        <div className="post-categories-n-tags">
          <div className="post-categories">
            {categories && categories.slice(0, 1).map(({ name, id }) => (
              <div className="post-category" key={id}>
                <Link to={`../category/${he.decode(name).replace(/\s+/g, '-').toLowerCase()}`}>{he.decode(name)}</Link>
              </div>
            ))}
          </div>
          {/* <div className="post-tags">
            {tags.map(({ name }) => (
              <div className="post-tag">{name}</div>
            ))}
          </div> */}
        </div>
      </Responsive>
    </div>
  );
};

export default CategoriesAndTags;
