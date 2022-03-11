/* eslint radix: 0 */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { StyledSelect } from '../../SharedComponents/SharedComponents';

const minutes = [
  {
    id: 1,
    value: '00'
  },
  {
    id: 2,
    value: '30'
  }
];

const GracePeriod = ({ config }) => {
  const [time, setTime] = React.useState({
    hours: '05',
    gracePeriodMinutes: '00',
    minutes: '00'
  });

  const { getItemFromStore, setItemInStore } = useLocalStorage();
  const handleTimeChange = (e) => {
    setTime((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  React.useEffect(() => {
    const { hours, minutes } = time;

    const globalFilter = getItemFromStore('globalFilter');
    // const { turnoverThreshold: otsThreshold, fcotsThreshold } = getItemFromStore('efficiencyV2')?.efficiency;
    setItemInStore('globalFilter', {
      ...globalFilter,
      otsThreshold: parseInt(hours) * 3600,
      fcotsThreshold: parseInt(minutes) * 60
    });
  }, [time]);

  React.useEffect(() => {
    setTime((prev) => ({
      ...prev,
      hours: moment.duration(getItemFromStore('efficiencyV2')?.efficiency?.turnoverThreshold, 'seconds').hours().toString(),
      gracePeriodMinutes: '00',
      minutes: '00'
    }));
  }, []);

  const renderLabelText = () => {
    if (config.gracePeriod) {
      return <FormLabel>Grace Period</FormLabel>;
    }
    return <FormLabel>Outlier Threshold <b>(hh:mm)</b></FormLabel>;
  };

  const renderValue = (value) => {
    const id = uuidv4();
    const val = value.toString().padStart(2, 0);
    return (
      <MenuItem name={id} key={id} value={val}>{val}</MenuItem>
    );
  };

  return (
    <Grid container >
      {renderLabelText()}
      {config?.threshold && (
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row', paddingRight:4 }}>
          <FormControl size='small' variant="outlined" fullWidth >
            <StyledSelect
              name="hours"
              onChange={handleTimeChange}
              value={time.hours}
            >
              {[...Array(12).keys()].map(renderValue)}
            </StyledSelect>
          </FormControl>
        </Grid>
      )}
      {config?.threshold && (
        <Grid item xs={6} fullWidth>
          <FormControl size='small' variant="outlined" style={{ borderRadius: 0,paddingLeft:4 }} fullWidth>
            <StyledSelect name="minutes" onChange={handleTimeChange} value={time.minutes}>
              {minutes.map(({ id, value }) => (
                <MenuItem name={id} key={id} value={value}>{value}</MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </Grid>
      )}
      {config?.gracePeriod && (
        <Grid item xs={12}>
          <FormControl size='small' variant="outlined" style={{ borderRadius: 0 }} fullWidth>
            <StyledSelect name="gracePeriodMinutes" onChange={handleTimeChange} value={time.gracePeriodMinutes}>
              {[...Array(60).keys()].map(renderValue)}
            </StyledSelect>
          </FormControl>
        </Grid>
      )}
      
      <Grid item xs={12}>
        <FormHelperText>UCI standard: 5 {config?.ontime ? 'min' : 'hr'}</FormHelperText>
      </Grid>
    </Grid>
  );
};

export default GracePeriod;
