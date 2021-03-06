import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Divider, FormControl, MenuItem, Select } from '@material-ui/core';
import { SaveAndCancel } from '../../../components/SharedComponents/SharedComponents';

export default class EfficiencySettings extends React.PureComponent {
  constructor(props) {
    super(props);
    const otsThreshold = this.props.otsThreshold || 0;
    const fcotsThreshold = this.props.fcotsThreshold || 0;
    const turnoverThreshold = this.props.turnoverThreshold || 0;
    this.state = {
      otsThreshold: Math.floor((otsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
      outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.otsThreshold != prevProps.otsThreshold || this.props.fcotsThreshold != prevProps.fcotsThreshold || this.props.turnoverThreshold != prevProps.turnoverThreshold) {
      const otsThreshold = this.props.otsThreshold || 0;
      const fcotsThreshold = this.props.fcotsThreshold || 0;
      const turnoverThreshold = this.props.turnoverThreshold || 0;
      this.setState({
        otsThreshold: Math.floor((otsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
        gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
        outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
        outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      })
    }
  }
  updateState(key, e) {
    const { logger } = this.props;
    logger?.manualAddLog('onchange', `eff-settings-${key}`, e.target.value);
    this.setState({ [key]: e.target.value })
  }
  reset() {
    const otsThreshold = this.props.otsThreshold || 0;
    const fcotsThreshold = this.props.fcotsThreshold || 0;
    const turnoverThreshold = this.props.turnoverThreshold || 0;
    const { logger } = this.props;
    logger?.manualAddLog('click', `eff-settings-reset`);

    this.setState({
      otsThreshold: Math.floor((otsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      gracePeriodMinute: Math.floor((fcotsThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
      outlierThresholdHrs: Math.floor(turnoverThreshold / 3600).toString().padStart(2, 0) || "00",
      outlierThresholdMinute: Math.floor((turnoverThreshold % 3600) / 60).toString().padStart(2, 0) || "00",
    })
  }
  async submit() {
    const newFCOTThreshold = parseInt(this.state.gracePeriodMinute) * 60;
    const newOThreshold = parseInt(this.state.otsThreshold) * 60;
    const newOutlierThreshold = parseInt(this.state.outlierThresholdHrs) * (60 * 60) + parseInt(this.state.outlierThresholdMinute) * 60;
    let updates = [];
    if (this.props.hasEMR) {
      updates.push({ "name": "fcotsThreshold", "value": `${newFCOTThreshold}` });
      updates.push({ "name": "otsThreshold", "value": `${newOThreshold}` });
    }
    updates.push({ "name": "turnoverThreshold", "value": `${newOutlierThreshold}` });
    let jsonBody = {
      "facilityName": this.props.facilityName,
      "updates": updates
    }
    const { logger } = this.props;
    logger?.manualAddLog('click', `eff-settings-submit`);
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
          Case On-Time Start Settings
        </div>
        <div className="no-emr subtle-subtext">Settings are unavailable without case schedule data.</div>
        <div className="grace-period">
          <div className="subtitle subtle-subtext">
            Grace Period
          </div>
          <div className="content subtle-subtext">
            Grace Period is how long after a cases scheduled it can begin without before it is considered to have started late. Changes to Grace Period will be reflected in historical data.
          </div>
          <div className='flex' style={{ marginTop: 8 }}>
            <div className="selectors" style={{ marginRight: 44 }}>
              <div className='subtle-subtext' style={{ marginBottom: 4 }}>First Case</div>
              <FormControl variant="outlined" size="small" style={{ width: 85 }} >
                <Select
                  id="grace-mins"
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
            <div className="selectors">
              <div className='subtle-subtext' style={{ marginBottom: 4 }}>Non-First Case</div>
              <FormControl variant="outlined" size="small" style={{ width: 85 }} >
                <Select
                  id="grace-mins"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 250,
                      },
                    },
                  }}
                  value={this.state.otsThreshold}
                  onChange={(e, v) => this.updateState("otsThreshold", e)}
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

        </div>
        <Divider light style={{ marginBottom: 24 }} />

        <div className="title">
          Turnover Time Settings
        </div>
        <div className="subtitle subtle-subtext">
          Cutoff Threshold
        </div>
        <div className="content subtle-subtext">
          Cutoff Threshold sets the maximum turnover time that will be considered for Turnover Time analytics. Changes in Cutoff Threshold will be reflected in historical data.
        </div>
        <div className="selectors">
          <FormControl variant="outlined" size="small" style={{ width: 85 }} >
            <Select
              id="outlier-hrs"
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
              id="outlier-minute"
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
              {["00", "30"].map((index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="unit normal-text">min</span>
        </div>
        {this.renderSaveWarning()}
        <SaveAndCancel
          handleSubmit={() => { this.submit() }}
          handleCancel={() => { this.reset() }}
          isLoading={this.state.isLoading}
          disabled={this.state.isLoading}
          cancelText={'Reset'}
          submitText={'Save'}
        />
      </section>
    );
  }
}