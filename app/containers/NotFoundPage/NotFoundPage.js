/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import GenericMessage from '../GenericMessage';

export default class NotFoundPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <GenericMessage title={'Page Not Found'} message={'The page you are looking for might have been removed, had its name changed, or temporarily unavailable. Contact your administrator or go back to the previous page.'}/>
    );
  }
}
