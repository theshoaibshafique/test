import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import LoadingOverlay from 'react-loading-overlay';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Divider, FormControl, MenuItem, Select } from '@material-ui/core';

export default class EfficiencySettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gracePeriodMinute: "00",
      gracePeriodSec: "00",
      outlierThresholdHrs: "00",
      outlierThresholdMinute: "00"
    }
  }
  updateState(key, e) {
    this.setState({ [key]: e.target.value })
  }
  reset(){

  }
  submit(){

  }

  render() {

    return (
      <section className="efficiency-settings-page">
        <div className="title">
          First Case On Time Settings
        </div>
        <div className="subtitle">
          Grace Period
        </div>
        <div className="content">
          This setting will set the standard for the hospital’s grace period for identifying if the first case within block hours was started on time. All historical data will reflect this new standard as well.
        </div>
        <div className="selectors">
          <FormControl variant="outlined" size="small" style={{ width: 85 }} >
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                  },
                },
              }}
              value={this.state.gracePeriodMinute}
              onChange={(e, v) => this.updateState("gracePeriodMinute", e)}
            >
              {globalFuncs.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit">mins</span>
          <FormControl variant="outlined" size="small" style={{ width: 85 }} >
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                  },
                },
              }}
              value={this.state.gracePeriodSec}
              onChange={(e, v) => this.updateState("gracePeriodSec", e)}
            >
              {globalFuncs.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit">secs</span>
        </div>

        <Divider light style={{ marginBottom: 24 }} />

        <div className="title">
          Turnover Time Settings
        </div>
        <div className="subtitle">
          Outlier Threshold
        </div>
        <div className="content">
          This setting will set the standard for the hospital’s outlier threshold for identifying turnovers that exceed the regular amount of time. All historical data will reflect this new standard as well.
        </div>
        <div className="selectors">
          <FormControl variant="outlined" size="small" style={{ width: 85 }} >
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                  },
                },
              }}
              value={this.state.outlierThresholdHrs}
              onChange={(e, v) => this.updateState("outlierThresholdHrs", e)}
            >
              {globalFuncs.generatePaddedDigits(0, 12, 2, 0).map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit">hrs</span>
          <FormControl variant="outlined" size="small" style={{ width: 85 }} >
            <Select
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                  },
                },
              }}
              value={this.state.outlierThresholdMinute}
              onChange={(e, v) => this.updateState("outlierThresholdMinute", e)}
            >
              {globalFuncs.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit">mins</span>
        </div>
        <div className="buttons">
          <Button disableRipple className="reset" onClick={() => this.reset()}>Reset</Button>
          <Button disableRipple variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
            {(this.state.isLoading) ? <div className="loader"></div> : 'Submit'}</Button>
        </div>
      </section>
    );
  }
}