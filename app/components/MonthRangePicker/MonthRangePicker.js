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
      maxDate: this.props.maxDate || moment().endOf('month'),
    }
    this.state.maxRange = this.getMaxRange(this.state.startDate);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dateRange != this.props.dateRange || prevProps.maxDate != this.props.maxDate) {
      this.setState({
        dateRange: this.props.dateRange,
        maxDate: this.props.maxDate
      })
    }
  }

  getMaxRange(startDate) {
    if (startDate) {
      return moment.min(startDate.clone().add(10, 'days'), this.state.maxDate);
    }
    return this.state.maxDate;
  }

  updateRange(startDate, endDate) {

    let maxRange = this.state.maxRange;
    //Start date changes
    if (startDate != this.state.startDate) {
      endDate = null;
      maxRange = this.getMaxRange(startDate);
    }
    this.setState({
      startDate,
      endDate,
      maxRange
    }, () => {
      // this.props.updateState('dateRange', range);
    });
  }

  onFocusChange(focusedInput) {

    //Clear maxRange when changing startDate
    if (focusedInput == "startDate") {
      this.setState({ maxRange: this.state.maxDate });
    } else if (this.state.startDate) {
      //if changing endDate and startDate is set - re-enforce maxRange
      this.setState({ maxRange: this.getMaxRange(this.state.startDate) })
    }

    this.setState({ focusedInput });
  }

  resetDates(){
    this.setState({
      startDate: null,
      endDate: null,
      maxRange: this.state.maxDate
     })
  }

  renderInfo() {
    return (
      <Grid container spacing={0} justify="space-around" style={{padding:24}}>
        <Grid item xs={8}>
          Wow what a lovely message we have here lol
        </Grid>
        <Grid item xs={4} style={{textAlign:'right'}}> 
          <a className="link" onClick={e => this.resetDates()}>Clear dates</a>
        </Grid>

      </Grid>
    )
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center" direction="column" className="month-range-picker">
        <Grid item xs className="report-date">
          Report Date
        </Grid>
        <DateRangePicker
          startDate={this.state.startDate}
          startDateId="your_unique_start_date_id"
          endDate={this.state.endDate}
          endDateId="your_unique_end_date_id"
          onDatesChange={({ startDate, endDate }) => this.updateRange(startDate, endDate)}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.onFocusChange(focusedInput)}

          isOutsideRange={date => date.isAfter(this.state.maxRange)}
          hideKeyboardShortcutsPanel={true}
          displayFormat="MMM DD YYYY"
          noBorder
          reopenPickerOnClearDates
          readOnly

          renderCalendarInfo={() => this.renderInfo()}
        />
        <div className="display-info">
          All data is based on elective hours
        </div>
      </Grid>
    );
  }
}

export default MonthRangePicker;