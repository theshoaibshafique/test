import React from 'react';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';

class SurveyDemographicGeneral extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let gridContent, gridContent2;

    if (this.props.data) {
      let questionTypeArray, questionPercentageArray;
      questionTypeArray = this.props.data.map((dataPoint) => {
        return dataPoint.name;
      })
      questionPercentageArray = this.props.data.map((dataPoint) => {
        return dataPoint.responses;
      })

      let columnWidth = 12 / questionTypeArray.length;
      gridContent = questionTypeArray.map((question) => {
        let questionType;
        switch(question) {
          case 'Male':
            questionType = <FontAwesomeIcon icon="male" color="#999999" size="5x" />
            break;
          case 'Female':
            questionType = <FontAwesomeIcon icon="female" color="#999999" size="5x" />
            break;
          default:
            questionType = <div className="larger grey bold">{question}</div>
            break;
        }


        return <Grid key={question} item xs={columnWidth} className="center-align" style={{alignSelf: 'flex-end'}}>
                  {questionType}
               </Grid>;
      });
      gridContent2 = questionPercentageArray.map((questionPercentage, index) => {
        return <Grid key={index} item xs={columnWidth} className="center-align">
                  <div className="larger purple bold">{questionPercentage}<sup>%</sup></div>
               </Grid>;
      });
    }

    return (
      <Grid container spacing={24} className="flex">
        {gridContent}
        {gridContent2}
      </Grid>
    );
  }
}

export default SurveyDemographicGeneral;
