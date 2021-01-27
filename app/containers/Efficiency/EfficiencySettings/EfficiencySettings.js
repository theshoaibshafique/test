import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Divider, FormControl, MenuItem, Select } from '@material-ui/core';
import globalFunctions from '../../../utils/global-functions';

export default class EfficiencySettings extends React.PureComponent {
  constructor(props) {
    super(props);
    const fcotsThreshold = this.props.fcotsThreshold || 0;
    const turnoverThreshold = this.props.turnoverThreshold || 0;
    this.state = {
      gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      gracePeriodSec: Math.floor(fcotsThreshold % 3600 % 60).toString().padStart(2, 0) || "00",
      outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
      outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.fcotsThreshold != prevProps.fcotsThreshold || this.props.turnoverThreshold != prevProps.turnoverThreshold) {
      const fcotsThreshold = this.props.fcotsThreshold || 0;
      const turnoverThreshold = this.props.turnoverThreshold || 0;
      this.setState({
        gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
        gracePeriodSec: Math.floor(fcotsThreshold % 3600 % 60).toString().padStart(2, 0) || "00",
        outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
        outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      })
    }
  }
  updateState(key, e) {
    this.setState({ [key]: e.target.value })
  }
  reset() {
    const fcotsThreshold = this.props.fcotsThreshold || 0;
    const turnoverThreshold = this.props.turnoverThreshold || 0;

    this.setState({
      gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      gracePeriodSec: Math.floor(fcotsThreshold % 3600 % 60).toString().padStart(2, 0) || "00",
      outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
      outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
    })
  }
  async submit() {
    const newFCOTThreshold = parseInt(this.state.gracePeriodMinute) * 60 + parseInt(this.state.gracePeriodSec);
    const newOutlierThreshold = parseInt(this.state.outlierThresholdHrs) * (60 * 60) + parseInt(this.state.outlierThresholdMinute) * 60;
    let updates = [];
    if (this.props.hasEMR){
      updates.push({ "name": "fcotsThreshold", "value": `${newFCOTThreshold}` });
    }
    updates.push({ "name": "turnoverThreshold", "value": `${newOutlierThreshold}` });
    let jsonBody = {
      "facilityName": this.props.facilityName,
      "updates": updates
    }
    this.setState({ isLoading: true }, () => {
      this.props.submit(jsonBody).then(() => {
        this.setState({ isLoading: false })
      })
    })

  }


  renderSaveWarning() {
    const newFCOTThreshold = parseInt(this.state.gracePeriodMinute) * 60 + parseInt(this.state.gracePeriodSec);
    const newOutlierThreshold = parseInt(this.state.outlierThresholdHrs) * (60 * 60) + parseInt(this.state.outlierThresholdMinute) * 60;
    const fcotsThreshold = this.props.fcotsThreshold;
    const turnoverThreshold = this.props.turnoverThreshold;
    if ((newFCOTThreshold != fcotsThreshold && this.props.hasEMR) || newOutlierThreshold != turnoverThreshold) {
      return <div className="warning">If you leave without saving, changes will be discarded</div>
    }
    return <div></div>
  }

  render() {

    return (
      <section className={`efficiency-settings-page ${this.props.hasEMR && 'has-emr'}`}>
        <div className="title">
          First Case On-Time Settings
        </div>
        <div className="no-emr">Settings are not available without EMR Data.</div>
        <div className="grace-period">
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
        {this.renderSaveWarning()}
        <div className="buttons">
          <Button disableRipple className="reset" onClick={() => this.reset()}>Reset</Button>
          <Button disableRipple variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
            {(this.state.isLoading) ? <div className="loader"></div> : 'Submit'}</Button>
        </div>
      </section>
    );
  }
}