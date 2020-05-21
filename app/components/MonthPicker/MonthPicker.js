import React from 'react';
import { Grid, Input } from '@material-ui/core';
import moment from 'moment/moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import './style.scss';
import DateFnsUtils from '@date-io/date-fns';

class MonthPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: this.props.month
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.month != this.props.month){
      this.setState({month:this.props.month})
    }
  }


  decrementMonth = () => {
    const month = this.state.month.clone().subtract(1, 'month');
    this.setState({
      month: month
    }, () => {
      this.props.updateMonth(month);
    });
  };

  incrementMonth = () => {
    const month = this.state.month.clone().add(1, 'month');
    this.setState({
      month: month
    }, () => {
      this.props.updateMonth(month);
    });
  };

  updateMonth(month) {
    month = moment(month)
    this.setState({
      month: month,
    }, () => {
      this.props.updateMonth(month);
    });
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={2}>
          <Grid container className="pointer" onClick={() => this.decrementMonth()}>
            <Grid item xs={4} className="left-arrow" ></Grid>
            <Grid item xs={4} className="previous">
              Previous
                  </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ maxWidth: 325 }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <DatePicker
              variant="inline"
              openTo="year"
              className="cases-date"
              InputProps={{
                disableUnderline: true,
               }}
              views={["year", "month"]}
              disableFuture
              error={false}
              helperText={null}
              value={this.state.month}
              onChange={(month) => this.updateMonth(month)}
              autoOk
            /> 
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={2}>
          {moment().isSameOrBefore(this.state.month.clone(),'month')
            ? ''
            :
            <Grid container justify="center" alignItems="center" style={{ marginLeft: 24 }} className="pointer" onClick={() => this.incrementMonth()}>
              <Grid item xs={3} style={{ maxWidth: 44,marginRight:8}} className="next">
                Next
                      </Grid>
              <Grid item xs={4} className="right-arrow" ></Grid>

            </Grid>
          }

        </Grid>
      </Grid>
    );
  }
}

export default MonthPicker;