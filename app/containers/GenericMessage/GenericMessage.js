/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';

export default class GenericMessage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    const {title, message } = this.props;

  return (
    <div className="generic-message">
        <Grid container spacing={0} direction="column" justify="center">
          <Grid item xs className="title">
            {title}
        </Grid>
          <div item xs className="title-break"></div>
          <Grid item xs className="content normal-text">
            {message}
        </Grid>
        </Grid>
      </div>
  )
  }
}
