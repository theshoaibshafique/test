/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';
import facilityGraphic from './img/Surgeons_Image_Placeholder.png';

export default class Welcome extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  };

  render() {
    return (
      <div className="welcome-page">
        <div className="facility-graphic-container"></div>
        <Grid item xs className="welcome-message">
          <div className="welcome">Welcome</div>
          <div className="personal-name">{this.props.firstName} {this.props.lastName}</div>
        </Grid>
        <div className="footer subtle-subtext">Can’t find what you’re looking for? Contact your administrator for assistance.</div>
      </div>
    );
  }
}
