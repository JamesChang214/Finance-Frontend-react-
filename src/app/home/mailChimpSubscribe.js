import React from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe";
import {Form, Button} from 'semantic-ui-react';

const MailchimpFormContainer = ({email, handleOnChangeEmail, handleSendEmail})  => {
  const postUrl = `https://finance.us5.list-manage.com/subscribe/post?u=14e48a53fd6c25b1cf54e2b8a&id=968f03d15b`;
  return (
    <Form action={postUrl} method="post">
    <Form.Field>
        <input type="email" onChange={({target})=>handleOnChangeEmail(target.value)} autoCapitalize="off" autoCorrect="off" placeholder="Enter your email here" name="MERGE0" id="MERGE0" value={email} />
      </Form.Field>
  <Button type="submit" onClick={()=>handleSendEmail(email)} name="submit" >Subscribe</Button>
   </Form>
   )
}

export default MailchimpFormContainer;