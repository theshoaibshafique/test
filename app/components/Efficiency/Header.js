import React from 'react';
import Grid from '@material-ui/core/Grid';

const Header = ({ onClick, children }) => (
  <Grid className="efficiency-head-container" container style={{ paddingTop: '16px' }}>
    <Grid item xs={12}>
      <div onClick={onClick} className="efficiencyOnboard-link link">What is this dashboard about?</div>
    </Grid>
    {children}
  </Grid>
);

export default Header;
