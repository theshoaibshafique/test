import React from 'react';
import { Grid, Paper } from '@material-ui/core';

const CheckListData = (props) => {
  let { data, data : { dataPoints } } = props;

  const getCheckListData = () => {
    if (data.title == "Missed Items") {
      return <div className="checklist-data-list main-text">
                {
                  dataPoints.map((dataPoint, index) => {
                  return <div>{index + 1}. <span>{dataPoint.valueX}</span></div>
                  })
                }
              </div>
    } else {
      return <div
                className="checklist-data-value"
                style={(data.title == "Phase") ? {color: '#004F6E'} : {}}
              >
                {dataPoints[0].valueX}</div>
    }
  }

  return (
    <div className="checklist-data-container">
      <div className="checklist-data-title main-text">{data.title}</div>
      {getCheckListData()}
    </div>
  )
}

const ChecklistAnalysis = (props) => {
  const { checklistData : {title, subTitle, enhancedMMData} } = props;

  return (
    <Paper className="checklist-data">
      <h3 className="main-text center-align">{title}</h3>
      <h5 className="main-text center-align"><em>{subTitle}</em></h5>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <CheckListData data={enhancedMMData[0]} />
          <CheckListData data={enhancedMMData[1]} />
          <CheckListData data={enhancedMMData[2]} />
        </Grid>
        <Grid item xs={6}>
          <CheckListData data={enhancedMMData[3]} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ChecklistAnalysis;