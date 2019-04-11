import React from 'react';
import './style.scss';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class ProcedureFilter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let currentSurveys = this.props.surveyList;
    let surveyMenuItems = Object.keys(currentSurveys).map(function(key, index) {
      return <MenuItem key={key} value={key}>{currentSurveys[key]}</MenuItem>
    });

    return (
      <div className="Procedure-Filter dark-blue">
        Select survey:<br />
        <FormControl className="no-border bold">
          <Select
            value={this.props.selectedSurvey}
            onChange={this.props.surveyChange}
            inputProps={{
              name: 'survey-select',
            }}
          >
            {surveyMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default ProcedureFilter;
