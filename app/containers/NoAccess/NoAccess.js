/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';

export default class NoAccess extends React.PureComponent { 
  constructor(props) {
    super(props);
    
  }

  componentDidMount() {
    
  };

  render() {
    return (
      <Grid container spacing={0} direction="column" className="not-found-page">
        <Grid item xs className="title">
          Access Denied
        </Grid>
        <div item xs className="title-break"></div>
        <Grid item xs className="content">
          You do not have access to this page. This could be due to a connection issue or a missing permission. Please logout and log back in to try again or contact your administrator.
        </Grid>
      </Grid>
    );
  }
}
