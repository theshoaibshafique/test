import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import { LightTooltip } from './SharedComponents';

const equalProps = (props, prevProps) => props === prevProps;
const SSTSlider = withStyles({
  root: {
    color: '#028CC8',
    height: 8,
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: '#004F6E',
    marginTop: -6,
    marginLeft: -8,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    '&.Mui-disabled':{
      height: 16,
      width: 16,
      backgroundColor: '#BDBDBD',
      marginTop: -6,
      marginLeft: -8,
    }

  },


  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
    backgroundColor: '#BDBDBD',
    opacity: 1
  },
})(Slider);
const Label = (props) => <div className='subtle-text' style={{ color: '#4F4F4F' }} {...props} />
/*
* @param {(string|number)} value - The value the slider is expecting to use
* @param {Function} onChange - The change handler function
* @param {(string|number)} startLabel - The beginning label
* @param {(string|number)} endLabel - The end label
* @param {object} rest - The rest of the props, to be passed to the slider component
*/
const RangeSlider = React.memo(({
  value, onChange, startLabel, endLabel, disabled, ...rest
}) => (
  <React.Fragment>
    <Grid container>
      <Grid item xs={2} style={{ textAlign: 'end', paddingRight: 24, paddingTop: 6 }}>
        {!disabled && <Label >{startLabel}</Label>}
      </Grid>
      <Grid item xs={8}>
        <SSTSlider
          value={value}
          onChange={onChange}
          ValueLabelComponent={ValueLabelComponent}
          disabled={disabled}
          {...rest}
        />
      </Grid>
      <Grid item xs={2} style={{ paddingLeft: 24, paddingTop: 6 }}>
        {!disabled && <Label>{endLabel}</Label>}
      </Grid>
    </Grid>
  </React.Fragment>
), equalProps);
function ValueLabelComponent(props) {
  const { children, open, value } = props;
  return (
    <LightTooltip open={open} enterTouchDelay={0} arrow placement="top" title={value}>
      {children}
    </LightTooltip>
  );
}
export default RangeSlider;
