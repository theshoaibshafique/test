import React from 'react';
import './style.scss';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SurveyResultGraph from '../SurveyResultGraph/SurveyResultGraph';

class SurveyResultCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {

    let nullRender = null;
    let thisComponent = <Card className="Card Survey-Result">
                          <CardContent className="dark-blue">
                            <h3 className="Card-Header">Question Results: {this.props.questionName}</h3>
                            <hr />
                            <Grid container spacing={0} className="flex vertical-center">
                              <Grid item xs={6} className="Question-Name dark-blue larger center-align">
                                <span className="bold">{this.props.questionName}</span><br />
                                (Based on {this.props.questionNumber} questions)
                              </Grid>
                              <Grid item xs={6} className="Question-Result">
                                <SurveyResultGraph
                                  questionValue={this.props.questionValue}
                                  questionNA={this.props.questionNA}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>;

    let renderedComponent = (this.props.questionName === null) ? nullRender : thisComponent;

    return (
      <div>
        {renderedComponent}

      </div>
    );
  }
}

export default SurveyResultCard;
