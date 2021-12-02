/* eslint-disable import/order */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import StyleButton from './StyleButton';
import { EditorState, RichUtils, convertToRaw, ContentState } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
//import { stateFromHTML } from 'draft-js-import-html';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from 'draft-js-mention-plugin';
import { ItalicButton, BoldButton, UnderlineButton } from 'draft-js-buttons';
import ImageAdd from './imageAdd/ImageAdd';
import VideoAdd from './videoAdd/VideoAdd';
import buttonStyles from './ButtonStyles.module.scss';
//import "draft-js-linkify-plugin/lib/plugin.css";
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-alignment-plugin/lib/plugin.css';
//import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import 'draft-js-hashtag-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { getMentionSuggestions } from '../dashboard/EditorActions';
import alignmentToolStyles from './AlignmentToolStyles.module.scss';
// // Require Editor JS files.
// import 'froala-editor/js/froala_editor.pkgd.min.js';

// // Require Editor CSS files.
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/css/froala_editor.pkgd.min.css';

// // Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';

// import FroalaEditor from 'react-froala-wysiwyg';
const linkPlugin = createLinkPlugin({
  placeholder: 'http://…'
});
const videoPlugin = createVideoPlugin();
const linkifyPlugin = createLinkifyPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin({
  theme: {
    alignmentToolStyles,
    buttonStyles
  }
});
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [linkPlugin.LinkButton]
});
const { InlineToolbar } = inlineToolbarPlugin;
const hashtagPlugin = createHashtagPlugin();
const mentionPlugin = createMentionPlugin();
const plugins = [
  blockDndPlugin,
  linkPlugin,
  videoPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  inlineToolbarPlugin,
  linkifyPlugin,
  hashtagPlugin,
  mentionPlugin
];

class ArticleEditor extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      editorState: props.data.content
        ? ArticleEditor.htmlToContent(props.data.content)
        : EditorState.createEmpty(),
      suggestions: []
    };
    this.focus = () => this.editor.focus();
    this.onChange = editorState => this.contentToHtml(editorState);
    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.onTab = e => this._onTab(e);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.stoggleInlineStyle = style => this._toggleInlineStyle(style);
    this.createLink = data => this._createLink(data);
  }

  componentDidMount = () => {
    const { getMentionsSuggestions, userInfo } = this.props;
    getMentionsSuggestions({ userId: userInfo.id });
  };

  static htmlToContent(content) {
    const blocksFromHTML = htmlToDraft(content, (nodeName, node) => {
      console.log(nodeName, node);
      if (nodeName === 'iframe') {
        return {
          type: 'draft-js-video-plugin-video',
          mutability: 'IMMUTABLE',
          data: {
            src: node.getAttribute('src')
          }
        };
      }
    });
    if (!blocksFromHTML.contentBlocks) {
      return EditorState.createEmpty();
    }
    const editorState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    //EditorState.createWithContent(stateFromHTML(props.data.content))
    return EditorState.createWithContent(editorState);
  }

  static performEmbeddUrl(url) {
    const YOUTUBEMATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const VIMEOMATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;

    const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
    const VIMEO_PREFIX = 'https://player.vimeo.com/video/';

    const isVimeo = string => VIMEOMATCH_URL.test(string);
    const isYouTube = string => YOUTUBEMATCH_URL.test(string);
    if (isYouTube(url)) {
      const src = url.match(YOUTUBEMATCH_URL)[1];
      return YOUTUBE_PREFIX + src;
    }

    if (isVimeo(url)) {
      const src = url.match(VIMEOMATCH_URL)[3];
      return VIMEO_PREFIX + src;
    }

    return url;
  }

  contentToHtml(editorState) {
    // const options = {
    //   inlineStyles: {
    //     BOLD: { element: 'b' },
    //     ITALIC: { element: 'i' }
    //   },
    //   entityStyleFn: entity => {
    //     const entityType = entity.get('type').toLowerCase();
    //     console.log(entityType, entity);
    //     if (
    //       entityType === 'draft-js-video-plugin-video'
    //       || entityType === 'embedded_link'
    //     ) {
    //       const data = entity.getData();
    //       return {
    //         element: 'iframe',
    //         attributes: {
    //           src: data.src
    //         },
    //         style: {
    //           // Put styles here...
    //         }
    //       };
    //     }
    //   }
    // };
    // const htmlContent = stateToHTML(
    //   this.state.editorState.getCurrentContent(),
    //   options
    // );
    const { handleChangeStory } = this.props;
    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent()), null, null, (entity) => {
        console.log(editorState.getCurrentContent())
        const entityType = entity.type.toLowerCase();
        console.log(entityType, entity);
        if (
          entityType === 'draft-js-video-plugin-video'
          || entityType === 'embedded_link'
        ) {
          return `<iframe src="${ArticleEditor.performEmbeddUrl(
            entity.data.src
          )}"></iframe>`;
        }
      }
    );
    console.log(htmlContent)
    // <ArticleEditor htmlContent={htmlContent} />
    // localStorage.setItem('htmlContent', htmlContent)
    this.setState({ editorState });
    handleChangeStory(htmlContent);
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const { editorState } = this.state;
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  onSearchChange = ({ value }) => {
    const { mentionSuggestions } = this.props;
    console.log('onSearch: ', mentionSuggestions);
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentionSuggestions)
    });
  };

  //TODO: Links
  render() {
    const { MentionSuggestions } = mentionPlugin;
    const { editorState, suggestions } = this.state;
    const { blockStyleControls, mediaControls, onAddMention } = this.props;
    const className = 'RichEditor-editor';
    return (
      <div className="RichEditor-root">
        <div className="RichEditor-controls-wrapper">
          {/* <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          /> */}
          {blockStyleControls && (
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
          )}
          {mediaControls && (
            <div className="media-controls">
              <ImageAdd
                editorState={editorState}
                onChange={this.onChange}
                modifier={imagePlugin.addImage}
              />
              <VideoAdd
                editorState={editorState}
                onChange={this.onChange}
                modifier={videoPlugin.addVideo}
              />
            </div>
          )}
        </div>
        <div
          className={className}
          onKeyPress={({ key }) => key === 'Enter' && this.focus()}
          role="textbox"
          tabIndex={0}
          onClick={this.focus}
        >
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={(element) => {
              this.editor = element;
            }}
            plugins={plugins}
            spellCheck
          />
          {
            <InlineToolbar>
              {// may be use React.Fragment instead of div to improve perfomance after React 16
                externalProps => (
                  <div>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <linkPlugin.LinkButton {...externalProps} />
                  </div>
                )}
            </InlineToolbar>
          }
          {<AlignmentTool />}
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={suggestions}
            onAddMention={onAddMention}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      userInfo: state.user.userInfo,
      mentionSuggestions: state.editor.mentionSuggestions
    }),
    dispatch => ({
      getMentionsSuggestions: (params) => {
        dispatch(getMentionSuggestions(params));
      }
    })
  )(ArticleEditor)
);

const getBlockStyle = (contentBlock) => {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
};

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: <i className="fas fa-quote-right" />, style: 'blockquote' },
  { label: <i className="fal fa-list-ul" />, style: 'unordered-list-item' },
  { label: <i className="fal fa-list-ol" />, style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

// const INLINE_STYLES = [
//   { label: <i className="fas fa-bold" />, style: 'BOLD' },
//   { label: <i className="fas fa-italic" />, style: 'ITALIC' },
//   { label: <i className="fas fa-underline" />, style: 'UNDERLINE' }
// ];

// const InlineStyleControls = props => {
//   const currentStyle = props.editorState.getCurrentInlineStyle();
//   console.log(props);
//   return (
//     <div className="RichEditor-controls">
//       {INLINE_STYLES.map((type, index) => (
//         <StyleButton
//           key={index}
//           active={currentStyle.has(type.style)}
//           label={type.label}
//           onToggle={props.onToggle}
//           style={type.style}
//         />
//       ))}
//     </div>
//   );
// };