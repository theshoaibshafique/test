import React from 'react';
import { Grid, Paper } from '@material-ui/core';

const CheckListData = (props) => {
  const { data, data : { dataPoints }, isPeopleEqual, showInRed } = props;

  const getCheckListData = () => {
    if (data.title == "Missed Items") {
      return <div className="checklist-data-list">
                {
                  (dataPoints.length == 0) ?
                    <div className="no-missed-item">No Missed Item</div>
                  :
                  dataPoints.map((dataPoint, index) => {
                    return <div className="main-text" key={`missedItem${index}`}>{index + 1}. <span>{dataPoint.valueX}</span></div>
                  })
                }
              </div>
    } else {
      return <div
                className={`checklist-data-value ${(showInRed) && 'red-text'}`}
                style={(data.title == "Phase" || isPeopleEqual) ? {color: '#004F6E'} : {}}
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
  const { checklistData } = props;

  return (
    <div>
      {
        checklistData.map((checklist, index) => {
          const title = checklist.title;
          const subTitle = checklist.subTitle
          const enhancedMMData = checklist.enhancedMMData;
          const isPeopleEqual = enhancedMMData[1].dataPoints[0].valueX == enhancedMMData[2].dataPoints[0].valueX;
          const isBriefing = (title.indexOf('Briefing') >= 0);
          const isTimeout = (title.indexOf('Time Out') >= 0);
          const isDebrief = (title.indexOf('Postop Debrief') >= 0);
          const checkListPhase = enhancedMMData[0].dataPoints[0].valueX;
          const showInRed = (((isBriefing || isTimeout) && checkListPhase == "After skin incision") || (isDebrief &&(checkListPhase == 'Before skin closing' || checkListPhase == 'During skin closing')))

          return <Paper
                  key={`checklistData${index}`}
                  className="checklist-data">
                  <h3 className="main-text center-align">{title}</h3>
                  <h5 className="main-text subtle-subtext center-align"><em>{subTitle}</em></h5>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                      <CheckListData data={enhancedMMData[0]} showInRed={showInRed} />
                      <CheckListData data={enhancedMMData[1]} isPeopleEqual={isPeopleEqual}/>
                      <CheckListData data={enhancedMMData[2]} isPeopleEqual={isPeopleEqual}/>
                    </Grid>
                    <Grid item xs={6}>
                      <CheckListData data={enhancedMMData[3]} />
                    </Grid>
                  </Grid>
                </Paper>
        })
      }

    </div>

  )
}

export default ChecklistAnalysis;