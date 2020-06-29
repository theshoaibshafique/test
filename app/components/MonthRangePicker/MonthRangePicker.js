import React from 'react';
import { Grid, Menu, MenuItem } from '@material-ui/core';
import moment from 'moment/moment';

import './style.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

class MonthRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      startDate: this.props.startDate || moment().startOf('month'),
      endDate: this.props.endDate || moment().endOf('month'),
      maxDate: this.props.maxDate || moment().endOf('month')
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateRange != this.props.dateRange || prevProps.maxDate != this.props.maxDate) {
      this.setState({
        dateRange: this.props.dateRange,
        maxDate: this.props.maxDate
      })
    }
  }

  updateRange(range) {
    
    this.setState({
      dateRange: range,
    }, () => {
      this.props.updateState('dateRange', range);
    });
  }
  

  render() {
    return (
      <Grid container justify="center" alignItems="center" direction="column" className="month-range-picker">
        <Grid item xs className="report-date">
          Report Date
        </Grid>
        {/* <Grid item xs className="date-display" onClick={(e) => this.openMenu(e)}>
          WOOW
        </Grid> */}
        <DateRangePicker
          startDate={this.state.startDate}
          startDateId="your_unique_start_date_id"
          endDate={this.state.endDate}
          endDateId="your_unique_end_date_id"
          onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}

          isOutsideRange={date => date.isAfter(this.state.maxDate)}
          hideKeyboardShortcutsPanel={true}
          displayFormat="MMMM DD YYYY"
          noBorder
        />

      </Grid>
    );
  }
}

export default MonthRangePicker;