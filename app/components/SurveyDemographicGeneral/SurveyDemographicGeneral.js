import React from 'react';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';

class SurveyDemographicGeneral extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    let columnWidth = 12 / this.props.questionValue.length;
    let gridContent = this.props.questionValue.map((question) => {
      let questionType;
      switch(question) {
        case 'MaleIcon':
          questionType = <FontAwesomeIcon icon="male" color="#999999" size="5x" />
          break;
        case 'FemaleIcon':
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
    let gridContent2 = this.props.questionPercentage.map((questionPercentage) => {
      return <Grid key={questionPercentage} item xs={columnWidth} className="center-align">
                <div className="larger purple bold">{questionPercentage}<sup>%</sup></div>
             </Grid>;
    });

    return (
      <Grid container spacing={24} className="flex">
        {gridContent}
        {gridContent2}
      </Grid>
    );
  }
}

export default SurveyDemographicGeneral;
