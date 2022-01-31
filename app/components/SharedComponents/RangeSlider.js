import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const equalProps = (props, prevProps) => props === prevProps;

const RangeSlider = React.memo(({
  value, onChange, startLabel, endLabel, ...rest
}) => (
  <React.Fragment>
    <Grid container>
      <Grid item xs={2} style={{ textAlign: 'center', marginRight: 12 }}>
        <Typography>{startLabel}</Typography>
      </Grid>
      <Grid item xs={7}>
        <Slider
          value={value}
          onChange={onChange}
          {...rest}
        />
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center', marginLeft: 12 }}>
        <Typography>{endLabel}</Typography>
      </Grid>
    </Grid>
  </React.Fragment>
), equalProps);

export default RangeSlider;
