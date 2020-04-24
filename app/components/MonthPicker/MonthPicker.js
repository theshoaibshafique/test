import React from 'react';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import './style.scss';

class MonthPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: this.props.month
    }
  }


  decrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({
      month: month.subtract(1, 'month')
    }, () => {
      this.props.updateMonth(month);
    });
  };

  incrementMonth = () => {
    const month = this.state.month.clone();
    this.setState({
      month: month.add(1, 'month')
    }, () => {
      this.props.updateMonth(month);
    });
  };

  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid item xs={2}>
          <Grid container style={{ marginBottom: 10 }} className="pointer" onClick={() => this.decrementMonth()}>
            <Grid item xs={4} className="left-arrow" ></Grid>
            <Grid item xs={4}>
              Previous
                  </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} style={{ maxWidth: 325 }}>
          <span className="cases-date">{this.state.month.format('MMMM YYYY')}</span>
        </Grid>
        <Grid item xs={2}>
          {this.state.month.clone().add(1, 'hour') > moment()
            ? ''
            :
            <Grid container justify="center" alignItems="center" style={{ marginBottom: 10, marginLeft: 24 }} className="pointer" onClick={() => this.incrementMonth()}>
              <Grid item xs={3} style={{ maxWidth: 44 }}>
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