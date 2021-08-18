/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import GenericMessage from '../GenericMessage';

export default class NoAccess extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <GenericMessage
        title={'Access Denied'}
        message={'You do not have access to this page. This could be due to a connection issue or a missing permission. Please logout and log back in to try again or contact your administrator.'}
      />
    );
  }
}
