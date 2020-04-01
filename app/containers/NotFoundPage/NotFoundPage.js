/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { AzureAD, LoginType, MsalAuthProviderFactory } from 'react-aad-msal';

export default class NotFoundPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    
  };

  render() {
    return (
      <article>
          Page not found
      </article>
    );
  }
}
