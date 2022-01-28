import React from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import useLocalStorage from '../../../hooks/useLocalStorage';

const hours = [
  {
    id: 1,
    value: '00'
  },
  {
    id: 2,
    value: '01'
  },
  {
    id: 3,
    value: '02'
  },
  {
    id: 4,
    value: '03'
  },
  {
    id: 5,
    value: '04'
  },
  {
    id: 6,
    value: '05'
  },
  {
    id: 7,
    value: '06'
  },
  {
    id: 8,
    value: '07'
  },
  {
    id: 9,
    value: '08'
  },
  {
    id: 10,
    value: '09'
  },
  {
    id: 11,
    value: '10'
  },
  {
    id: 12,
    value: '11'
  },
];

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
      minutes: '00'
    }));
  }, []);

  const renderLabelText = () => {
    if (config?.gracePeriod && !config?.threshold) {
      return <span>Grace Period</span>;
    }
    return <span>Outlier Threshold <b>(hh:mm)</b></span>;
  };

  return (
    <Grid container>
      <FormLabel style={{ paddingTop: '2px', paddingBottom: '4px' }}>
        {renderLabelText()}
      </FormLabel>
      {config?.threshold && (
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row' }}>
          <FormControl variant="outlined" style={{ backgroundColor: '#fff', width: '90%' }}>
            <Select
              name="hours"
              onChange={handleTimeChange}
              value={time.hours}
            >
              {hours.map(({ id, value }) => (
                <MenuItem name={id} key={id} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {config?.gracePeriod && (
        <Grid item xs={config.gracePeriod && !config.threshold ? 12 : 6}>
          <FormControl variant="outlined" style={{ backgroundColor: '#fff', borderRadius: 0, width: '90%' }}>
            <Select name="minutes" onChange={handleTimeChange} value={time.minutes}>
              {minutes.map(({ id, value }) => (
                <MenuItem name={id} key={id} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <FormHelperText>UCI standard: 5 hr</FormHelperText>
      </Grid>
    </Grid>
  );
};

export default GracePeriod;
