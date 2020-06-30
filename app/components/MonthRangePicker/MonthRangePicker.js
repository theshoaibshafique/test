import React from 'react';
import { Grid, Menu, MenuItem, Divider } from '@material-ui/core';
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
    if (prevProps.startDate != this.props.startDate || prevProps.endDate != this.props.endDate || prevProps.maxDate != this.props.maxDate) {
      this.setState({
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        maxDate: this.props.maxDate
      })
    }
  }

  getMaxRange(startDate) {
    if (startDate) {
      return moment.min(startDate.clone().add(6, 'months'), this.state.maxDate);
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
      this.props.updateState('startDate', startDate);
      this.props.updateState('endDate', endDate);
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

  resetDates() {
    this.setState({
      startDate: null,
      endDate: null,
      maxRange: this.state.maxDate
    })
  }

  renderInfo() {
    return (
      <Grid container spacing={0} direction="column" >
        <Grid item xs style={{ textAlign: 'right', padding: '0 16px 16px' }}>
          <a className="link" onClick={e => this.resetDates()}>Clear dates</a>
        </Grid>
        <Divider style={{ backgroundColor: '#C8C8C8' }} />
        <Grid item xs className="display-warning">
          {this.props.displayWarning || "Each month’s data will become available on the 15th of the following month."}
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
          startDateId="startDateID"
          endDate={this.state.endDate}
          endDateId="endDateID"
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