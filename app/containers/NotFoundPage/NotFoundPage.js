/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';

export default class NotFoundPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <div className="not-found-page">
        <Grid container spacing={0} direction="column" justify="center">
          <Grid item xs className="title">
            Page Not Found
        </Grid>
          <div item xs className="title-break"></div>
          <Grid item xs className="content">
            The page you are looking for might have been removed, had its name changed, or temporarily unavailable. Contact your administrator or go back to the previous page.
        </Grid>
        </Grid>
      </div>
    );
  }
}
