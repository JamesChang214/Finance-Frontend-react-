import React, { Component } from "react";
import { Grid, Form, TextArea } from "semantic-ui-react";
// import ArticleEditor from "../../articleEditor/ArticleEditor";
import FroalaEditor from "../../froalaEditor/froalaEditor";

export default class Article extends Component {
  render() {
    const { handleChangeTitle, data, handleChangeStory } = this.props;
    return (
      <Grid.Row className="article">
        <p className="post-description">Post Title</p>
        <Form>
          <TextArea
            className="text-area-title"
            autoHeight
            rows={1}
            onChange={handleChangeTitle}
            value={data.title}
          />
        </Form>
        <p className="post-description">Your story</p>
        <FroalaEditor data={data} handleChangeStory={handleChangeStory} />
        {/* <ArticleEditor
          handleChangeStory={handleChangeStory}
          data={data}
          blockStyleControls
          mediaControls
        /> */}
        {/* <p className="post-description">Your story</p> */}
        {/* <Form>
          <TextArea
            className="text-area-story"
            autoHeight
            rows={25}
            onChange={handleChangeStory}
          />
        </Form> */}
      </Grid.Row>
    );
  }
}
// ReactDOM.render(<FroalaEditor />, document.getElementById('root'));
