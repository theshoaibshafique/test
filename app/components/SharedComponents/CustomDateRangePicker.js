/* eslint no-case-declarations: 0 */
import React, { useEffect } from 'react';
import moment from 'moment/moment';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Menu';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, DayPickerRangeController } from 'react-dates';
import useLocalStorage from '../../hooks/useLocalStorage';
import { FormControl } from '@material-ui/core';
import { mdiArrowRight } from '@mdi/js';
import Icon from '@mdi/react';
import { v4 as uuidv4 } from 'uuid';


const useStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
    height: 40,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 5,
    alignItems: 'center',
    border: '1px solid #ccc',
    // color: 'rgba(133, 133, 133, 0.8)'
  }
});
export const getPresetDates = (label) => {
  const { efficiency } = JSON.parse(localStorage.getItem('efficiencyV2')) ?? {};
  const { startDate, endDate } = efficiency ?? { startDate: moment(), endDate: moment() }

  switch (label) {
    case 'Most recent week':
      return {
        start: moment(endDate).subtract(1, 'weeks'),
        end: moment(endDate)
      };
    case 'Most recent month':
      return {
        start: moment(endDate).subtract(1, 'months'),
        end: moment(endDate),
      };
    case 'Most recent year':
      return {
        start: moment(endDate).subtract(1, 'years'),
        end: moment(endDate),
      };
    case 'All time':
      return {
        start: moment(startDate),
        end: moment(endDate)
      };
    default:
      const [start, end] = label?.split?.(' - ');
      return {
        start: moment(start),
        end: moment(end)
      }
  }
}
const defaultDate = 'Most recent month';
const CustomDateRangePicker = React.memo(({
  dateLabel, setDateLabel
}) => {

  //Key is only used to control rerender - (kinda hacky) - change key (force rerender) on preset click to focus selected date
  const [key, setKey] = React.useState(uuidv4())
  const [date, setDate] = React.useState(getPresetDates(dateLabel || defaultDate));

  const [lastDate, setLastDate] = React.useState({ ...date });
  const { setItemInStore, getItemFromStore } = useLocalStorage();
  const { efficiency } = getItemFromStore('efficiencyV2') ?? {};

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [focusedInput, setFocusedInput] = React.useState('endDate');
  const styles = useStyles();

  //Save the date whenever its changed
  React.useEffect(() => {
    const globalFilter = getItemFromStore('globalFilter');
    setItemInStore('globalFilter', { ...globalFilter, startDate: date.start?.format('YYYY-MM-DD'), endDate: date.end?.format('YYYY-MM-DD'), dateLabel });
    if (date.end) {
      setLastDate({ ...date, dateLabel })
    }
  }, [date.start, date.end]);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  //Update dates on label change
  React.useEffect(() => {
    const newDate = getPresetDates(dateLabel)
    if (newDate) {
      setDate(newDate)
    }
  }, [dateLabel])

  //Closing dates with any empty will revive last valid
  const handleClose = () => {
    if (!date.start || !date.end) {
      const { dateLabel, ...old } = lastDate;
      setDate(old);
      setDateLabel(dateLabel);
    }
    setAnchorEl(null)

  };

  //We manually set dates instead of only label to trigger proper rerender
  const setInputLabel = (label) => () => {
    setDate(getPresetDates(label));

    //We change the key to trigger a rerender to navigate back to relevant/focused/selected dates
    //Rerender isnt triggered on regular date change (custom)
    setKey(uuidv4())
    setFocusedInput('endDate')
    setDateLabel(label);
  };

  const onFocusChange = (fi) => {
    // Set back to start date after completion (null)
    setFocusedInput(fi ?? 'endDate')
  };

  //On custom date change
  const onDatesChange = ({ startDate, endDate }) => {
    let label = startDate?.format('YYYY-MM-DD');
    if (endDate) {
      label = `${label} to ${endDate?.format('YYYY-MM-DD')}`
    }
    setDateLabel(label);
    setDate({
      start: startDate,
      end: endDate
    });
  };

  const renderPresetTags = () => (
    <div className='subtle-subtext' style={{ display: 'flex', padding: '16px 24px 8px', borderTop: '1px solid #f2f2f2' }}>
      <div
        onClick={setInputLabel('Most recent week')}
        className='preset-tag'
      >
        Most recent week
      </div>
      <div
        onClick={setInputLabel('Most recent month')}
        className='preset-tag'
      >
        Most recent month
      </div>
      <div
        onClick={setInputLabel('Most recent year')}
        className='preset-tag'
      >
        Most recent year
      </div>
      <div
        onClick={setInputLabel('All time')}
        className='preset-tag'
      >
        All time
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <FormControl size='small' fullWidth>
        <FormLabel >Date</FormLabel>
        <Grid container>
          <Grid item xs={12} onClick={handleMenuClick} classes={{ root: styles.root }} style={dateLabel === 'All time' ? { color: 'rgba(133, 133, 133, 0.8)' } : {}}>
            {dateLabel || 'Most Recent Week'}
            <IconButton size="small">{anchorEl ? <ArrowDropUpIcon color="#000" /> : <ArrowDropDownIcon color="#000" />}</IconButton>
          </Grid>
        </Grid>
      </FormControl>
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
          left: 0
        }}
        PaperProps={{
          style: { width: 'fit-content', minWidth: 620 },
        }}
      >
        <div className='date-range-picker' >
          <div className='date-header subtle-subtext'>
            <div className={`${focusedInput === 'startDate' ? 'selected' : ''} date`} onClick={() => setFocusedInput('startDate')}>
              {date.start?.format('MMM DD YYYY') ?? 'Start Date'}
            </div>
            <div className='arrow'><Icon color="#828282" path={mdiArrowRight} size={'22px'} /></div>
            <div
              className={`${focusedInput === 'endDate' ? 'selected' : ''} date ${!date.start && 'disabled'}`}
              onClick={() => setFocusedInput('endDate')}
            >
              {date.end?.format('MMM DD YYYY') ?? 'End Date'}
            </div>
            <div className='clear link' onClick={() => setDate({ start: null, end: null }) || setFocusedInput('startDate')}> Clear Dates</div>
          </div>
          <DayPickerRangeController
            key={key}
            startDate={date.start}
            endDate={date.end}
            isOutsideRange={(date) => date.isAfter(efficiency?.endDate) || date.isBefore(efficiency?.startDate)}
            focusedInput={focusedInput}
            numberOfMonths={2}
            minimumNights={0}
            hideKeyboardShortcutsPanel
            noBorder
            renderCalendarInfo={renderPresetTags}
            onFocusChange={onFocusChange}
            onDatesChange={onDatesChange}
          />
        </div>
      </Popover>
    </React.Fragment>
  );
});

export default CustomDateRangePicker;
