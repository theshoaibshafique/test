import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const equalProps = (props, prevProps) => props === prevProps;

/*
* @param {(string|number)} value - The value the slider is expecting to use
* @param {Function} onChange - The change handler function
* @param {(string|number)} startLabel - The beginning label
* @param {(string|number)} endLabel - The end label
* @param {object} rest - The rest of the props, to be passed to the slider component
*/
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
