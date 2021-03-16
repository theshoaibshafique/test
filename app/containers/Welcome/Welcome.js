/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';
import logo from 'images/SST-Product_Insights_sketch.png';

export default class Welcome extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <div className="welcome-page">
        <Grid container spacing={0} direction="column" justify="center" className="welcome-grid">
          <Grid item xs className="logo">
            <img src={logo} />
          </Grid>
          <Grid item xs className="message">
            Welcome {this.props.firstName} {this.props.lastName}
          </Grid>
          <div className="title-break"></div>
        </Grid>
        <div className="footer subtle-subtext">Can’t find what you’re looking for? Contact your administrator for assistance.</div>
      </div>
    );
  }
}
