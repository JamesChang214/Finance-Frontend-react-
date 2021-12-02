import React, { PureComponent } from 'react';
import { Form, Button, Grid, Divider, Message, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Avatar from 'react-avatar-edit';
import * as actions from '../settingsActions';

class General extends PureComponent {
  constructor(props) {
    super(props);
    const { userInfo } = props;
    const { name, description } = userInfo;
    const { twitter } = userInfo?.meta;
    this.state = {
      name,
      description,
      twitter,
      preview: null,
      src: null,
      hideError: true
    };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBeforeFileLoad = General.onBeforeFileLoad.bind(this);
  }

  componentDidMount() {
    const { cookies, getRef, userInfo } = this.props;
    const token = cookies.get('trybe_jwt');
    const { id } = userInfo;
    getRef({ token, userId: id });
  }

  onClose() {
    this.setState({ preview: null });
    this.setState({ hideError: true })
  }

  onCrop(preview) {
    this.setState({ preview });
  }

  static onBeforeFileLoad(elem) {
    this.setState({ src: elem.target.files[0] });
    const file = elem.target.files[0];
    const scope = this;
    // var img = new Image();
    var img = React.createElement("img", {
      src: window.URL.createObjectURL(file),
    });
    // img.src = window.URL.createObjectURL(file);
    // img.onload = function () {
    var width = img.naturalWidth, height = img.naturalHeight;
    window.URL.revokeObjectURL(img.src);
    if (width < 200 && height < 200) {
      scope.setState({ hideError: false });
    }
    // };
    if (file.size > 716800) {
      alert('File is too big!');
      elem.target.value = '';
    }
  }

  onSubmit = () => {
    const { userInfo, updateUser, cookies, updateAvatar } = this.props;
    const { name, description, twitter, preview, src } = this.state;
    const params = { name, description, meta: { twitter } };
    const token = cookies.get('trybe_jwt', { path: '/' });
    updateUser({ id: userInfo.id, params, token });
    preview && updateAvatar({ file: src, token, user_id: userInfo.id });
  };

  handleChange = (e, { id, value }) => {
    this.setState({ [id]: value });
  };

  render() {
    const { name, description, twitter, src, preview, hideError } = this.state;
    const { userInfo } = this.props;
    const ref = `${window.location.protocol}//${window.location.hostname}?ref=${userInfo.id}`;
    return (
      <Form class="cz-settin-tab-form" onSubmit={this.onSubmit}>

        <Form.Field>
          <label htmlFor="display_name">Display name</label>
          <Form.Input onChange={this.handleChange} id="name" value={name} />
        </Form.Field>
        <Form.Field>
          <label htmlFor="display_name">About me:</label>
          <Form.TextArea
            onChange={this.handleChange}
            id="description"
            value={description}
            rows="10"
            cols="50"
          />
        </Form.Field>
        <Form.Field>
          <Message
            hidden={hideError}
            compact
            header={"Error!"}
            content="Image must be at least 200x200, It's recommanded to use a Square or Round Image."
          />
          <label htmlFor="profile-picture">Avatar</label>
          <Grid>
            <span class="image-reolution">Images must be larger than 200x200</span>
            <Grid.Column width={8}>
              <Avatar
                width={150}
                height={150}
                imageWidth={150}
                onCrop={this.onCrop}
                onClose={this.onClose}
                onBeforeFileLoad={this.onBeforeFileLoad}
                src={src}
                labelStyle={{ color: 'white' }}
              />
            </Grid.Column>
            <Grid.Column className="priveiw-profile" width={8}>
              {preview && (
                <img src={preview} width={100} height={100} alt="Preview" />
              )}
            </Grid.Column>
          </Grid>
        </Form.Field>
        <Form.Field>
          <label>Twitter</label><Form.Input placeholder="Example: https://twitter.com/loop_finance" onChange={this.handleChange} id="twitter" value={twitter} />
        </Form.Field>
        <Form.Field>
          <label>Your referal link:</label><Image className="icon-copy" src="/copy-icon.svg"></Image><Form.Input onChange={this.handleChange} id="ref" value={ref} />
        </Form.Field>
        <Divider />
        <Form.Field className="cz-form-setting" />
        <Button type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}
export default withCookies(
  withRouter(
    connect(
      (state, ownProps) => ({
        userInfo: state.user.userInfo,
        cookies: ownProps.cookies,
        ref: state.settings.ref
      }),
      dispatch => ({
        updateAvatar: params => dispatch(actions.updateAvatar(params)),
        updateUser: params => dispatch(actions.updateUser(params)),
        getRef: params => dispatch(actions.getRefId(params))
      })
    )(General)
  )
);
