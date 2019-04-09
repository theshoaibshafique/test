import React from 'react';
import './style.scss';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class ProcedureFilter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="Procedure-Filter dark-blue">
        Procedure type:<br />
        <FormControl className="no-border bold">
          <Select
            value={this.props.currentProcedure}
            onChange={this.props.procedureChange}
            inputProps={{
              name: 'procedure-select',
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Cholecystectomy">Cholecystectomy</MenuItem>
            <MenuItem value="Roux-Y Gastric Bypass">Roux-Y Gastric Bypass</MenuItem>
            <MenuItem value="Low Anterior Resection">Low Anterior Resection</MenuItem>
            <MenuItem value="Ventral Hernia Repair">Ventral Hernia Repair</MenuItem>
          </Select>
        </FormControl>
        <span className="light-blue inline case-hours">({this.props.caseNo} cases | {this.props.hoursNo} hours)</span>
      </div>
    );
  }
}

export default ProcedureFilter;
