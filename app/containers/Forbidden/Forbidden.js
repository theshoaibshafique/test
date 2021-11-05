/**
 * Foridden
 *
 * This is the page we show when the user is deactivated
 */

import React from 'react';
import GenericMessage from '../GenericMessage';

export default class Forbidden extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <GenericMessage
        title={'Access Denied'}
        message={'Your account has been deactivated by your facility administrator.'}
      />
    );
  }
}
