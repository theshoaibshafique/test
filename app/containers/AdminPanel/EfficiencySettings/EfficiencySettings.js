import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Divider, FormControl, MenuItem, Select } from '@material-ui/core';

export default class EfficiencySettings extends React.PureComponent {
  constructor(props) {
    super(props);
    const fcotsThreshold = this.props.fcotsThreshold || 0;
    const turnoverThreshold = this.props.turnoverThreshold || 0;
    this.state = {
      gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
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
      outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
      outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
    })
  }
  async submit() {
    const newFCOTThreshold = parseInt(this.state.gracePeriodMinute) * 60 ;
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
    const newFCOTThreshold = parseInt(this.state.gracePeriodMinute) * 60;
    const newOutlierThreshold = parseInt(this.state.outlierThresholdHrs) * (60 * 60) + parseInt(this.state.outlierThresholdMinute) * 60;
    const fcotsThreshold = this.props.fcotsThreshold;
    const turnoverThreshold = this.props.turnoverThreshold;
    if ((newFCOTThreshold != fcotsThreshold && this.props.hasEMR) || newOutlierThreshold != turnoverThreshold) {
      return <div className="warning subtle-subtext">If you leave without saving, changes will be discarded</div>
    }
    return <div></div>
  }

  render() {

    return (
      <section className={`efficiency-settings-page ${this.props.hasEMR && 'has-emr'}`}>
        <div className="title normal-text">
          First Case On-Time Settings
        </div>
        <div className="no-emr subtle-subtext">Settings are unavailable without case schedule data.</div>
        <div className="grace-period">
          <div className="subtitle subtle-subtext">
            Grace Period
          </div>
          <div className="content subtle-subtext">
          Grace Period is applied to the case start time when classifying a first case as on-time. Changes in Grace Period will be reflected in historical data.
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
            <span className="unit normal-text">min</span>
          </div>
        </div>
        <Divider light style={{ marginBottom: 24 }} />

        <div className="title">
          Turnover Time Settings
        </div>
        <div className="subtitle subtle-subtext">
          Outlier Threshold
        </div>
        <div className="content subtle-subtext">
          Outlier Threshold sets the cut-off for whether a turnover is considered for Turnover Time analytics. Changes in Outlier Threshold will be reflected in historical data.
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
          <span className="unit normal-text">hr</span>
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
              {["00","30"].map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit normal-text">min</span>
        </div>
        {this.renderSaveWarning()}
        <div className="buttons">
          <Button disableRipple className="reset" onClick={() => this.reset()}>Reset</Button>
          <Button disableRipple variant="outlined" className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
            {(this.state.isLoading) ? <div className="loader"></div> : 'Save'}</Button>
        </div>
      </section>
    );
  }
}