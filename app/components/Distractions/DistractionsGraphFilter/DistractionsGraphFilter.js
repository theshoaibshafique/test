import React from 'react';
import './style.scss';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class DistractionsGraphFilter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="Distractions-Graph-Filter dark-blue relative">
        <FormGroup row className="flex flex vertical-center">
          <FormControlLabel
            control={
              <Switch
                checked={this.props.filter.external}
                onChange={this.props.changeFilter}
                name="external"
                className="external"
              />
            }
            label="External Communication"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.props.filter.alerts}
                onChange={this.props.changeFilter}
                name="alerts"
                className="alerts"
              />
            }
            label="Alerts/Alarms"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.props.filter.door}
                onChange={this.props.changeFilter}
                name="door"
                className="door"
              />
            }
            label="Door Open"
          />
        </FormGroup>
      </div>
    );
  }
}

export default DistractionsGraphFilter;
