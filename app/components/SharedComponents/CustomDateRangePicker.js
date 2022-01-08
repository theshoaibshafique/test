/* eslint no-case-declarations: 0 */
import React from 'react';
import moment from 'moment/moment';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Menu';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerRangeController } from 'react-dates';
import useLocalStorage from '../../hooks/useLocalStorage';


const useStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 8,
    alignItems: 'center',
    border: '1px solid #ccc',
    color: 'rgba(133, 133, 133, 0.8)'
  }
});

const CustomDateRangePicker = ({ label, startDate: startDateProp, endDate: endDateProp }) => {
  const { getItemFromStore, setItemInStore } = useLocalStorage();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dates, setDates] = React.useState({
    startDate: null,
    endDate: null
  });
  const [focusedInput, setFocusedInput] = React.useState('startDate');
  const [inputLabel, setInputLabel] = React.useState('');
  const styles = useStyles();

  React.useEffect(() => {
    setDates({ startDate: startDateProp, endDate: endDateProp });
    setInputLabel(label);
  }, []);

  React.useEffect(() => {
    setItemInStore('globalFilterDates', { startDate: dates.startDate, endDate: dates.endDate });
  }, [dates]);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);


  const onDatesChange = ({ startDate, endDate }) => {
    setDates({
      startDate,
      endDate
    });
  };

  const onFocusChange = (focusedInput) => {
    setFocusedInput((prev) => (!prev ? 'startDate' : focusedInput));
  };

  const handleUpdateLabel = (label) => () => {
    switch (label) {
      case 'Most recent week':
        setDates({
          startDate: moment().subtract(1, 'weeks').startOf('week'),
          endDate: moment().subtract(1, 'weeks').endOf('week')
        });
        break;
      case 'Most recent month':
        setDates({
          startDate: moment().subtract(1, 'months').startOf('month'),
          endDate: moment().subtract(1, 'months').endOf('month'),
        });
        break;
      case 'Most recent year':
        setDates({
          startDate: moment().subtract(1, 'years').startOf('year'),
          endDate: moment().subtract(1, 'years').endOf('year'),
        });
        break;
      case 'All time':
        const { efficiency: { startDate, endDate } } = getItemFromStore('efficiencyV2');
        setDates({
          startDate,
          endDate
        });
        break;
      default:
        break;
    }
    setInputLabel(label);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} onClick={handleMenuClick} classes={{ root: styles.root }}>
          {inputLabel || 'Most Recent Week'}
          <IconButton size="small">{anchorEl ? <ArrowDropUpIcon color="#000" /> : <ArrowDropDownIcon color="#000" />}</IconButton>
        </Grid>
      </Grid>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{
          position: 'absolute',
          left: 70

        }}
      >
        <Grid container style={{ width: '600px' }}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 8px' }}>
              <div
                onClick={handleUpdateLabel('Most recent week')}
                style={{
                  backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'
                }}
              >
                Most recent week
              </div>
              <div
                onClick={handleUpdateLabel('Most recent month')}
                style={{
                  backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'
                }}
              >
                Most recent month
              </div>
              <div
                onClick={handleUpdateLabel('Most recent year')}
                style={{
                  backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'
                }}
              >
                Most recent year
              </div>
              <div
                onClick={handleUpdateLabel('All time')}
                style={{
                  backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'
                }}
              >
                All time
              </div>
              <div
                onClick={handleUpdateLabel('Custom')}
                style={{
                  backgroundColor: '#f2f2f2', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'
                }}
              >
                Custom
              </div>
            </div>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0px 8px' }}>
              <div style={{ color: '#828282', fontSize: '14px', lineHeight: '19px' }}>
                Start
              </div>
              <div style={{ color: '#828282', fontSize: '14px', lineHeight: '19px' }}>
                End
              </div>
            </div>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <DayPickerRangeController
              startDate={dates.startDate}
              focusedInput={focusedInput || 'startDate'}
              endDate={dates.endDate}
              numberOfMonths={2}
              hideKeyboardShortcutsPanel
              onDatesChange={onDatesChange}
              onFocusChange={onFocusChange}
            />
          </Grid>
        </Grid>
      </Popover>
    </React.Fragment>
  );
};

export default CustomDateRangePicker;
