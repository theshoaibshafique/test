import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import './style.scss';

export function GenericInformationPage(props) {
  const {content, title} = props;
  return (
    <div className="generic-information-page">
      <Grid container spacing={0} direction="column" justify="center">
        <Grid item xs className="title">
          {title}
        </Grid>
        <div item xs className="title-break"></div>
        <Grid item xs className="content normal-text">
          {content}
        </Grid>
      </Grid>
    </div>
  )
}