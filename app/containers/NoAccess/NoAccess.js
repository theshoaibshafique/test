/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';

export default class NoAccess extends React.PureComponent { 
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    this.props.notLoading();
  };

  render() {
    return (
      <div className="no-access">
        <article className="test">
            <h1>You do not have access to Insights Products. This could be due to one of two things:</h1>
            <h1>• A connection issue has occurred. Please logout and log back in</h1>
            <h1>• Contact your adminstrator for access to the appropriate products</h1>
        </article>
      </div>
    );
  }
}
