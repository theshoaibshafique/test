/*
 * Culture Survey Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import SurveyFilter from 'components/SurveyFilter';
import Grid from '@material-ui/core/Grid';
import SurveyResultCard from 'components/SurveyResultCard';
import globalFuncs from '../../global-functions';

export default class CultureSurveyDemographic extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey : Object.keys(this.props.publishedSurveys)[0],
      card1: {
        dataReceived: false
      },
      card2: {
        dataReceived: false
      },
      card3: {
        dataReceived: false
      },
      card4: {
        dataReceived: false
      },
      card5: {
        dataReceived: false
      },
      card6: {
        dataReceived: false
      },
      card7: {
        dataReceived: false
      },
    }
  }

  surveyChange(e) {

    this.setState(prevState => ({
      card1: {
          ...prevState.card,
          dataReceived: false
      }
  }))

    this.setState({
      selectedSurvey: e.target.value,
      card1: {
        dataReceived: false
      },
      card2: {
        dataReceived: false
      },
      card3: {
        dataReceived: false
      },
      card4: {
        dataReceived: false
      },
      card5: {
        dataReceived: false
      },
      card6: {
        dataReceived: false
      },
      card7: {
        dataReceived: false
      },
    }, () => {
      this.fetchContainerData();
    })
  }

  componentWillMount() {
    if (this.props.userLoggedIn)
      this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
    this.card2Data();
    this.card3Data();
    this.card4Data();
    this.card5Data();
    this.card6Data();
    this.card7Data();
  }

  card1Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSQR_QRTC', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card1: cardValue
      });
    })
  }

  card2Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DCSQR_QRSC', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card2: cardValue
      });
    })
  }

  card3Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DSCQR_QRJS', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card3: cardValue
      });
    })
  }

  card4Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DSCQR_QRSR', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card4};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card4: cardValue
      });
    })
  }

  card5Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DSCQR_QRPOM', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card5};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card5: cardValue
      });
    })
  }

  card6Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DSCQR_QRWC', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card6};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card6: cardValue
      });
    })
  }

  card7Data() {
    globalFuncs.getSurveyData(process.env.SURVEY_API, 'DSCQR_QRQATOBBS', this.props.usertoken, this.state.selectedSurvey).then((result) => {
      let cardValue = {...this.state.card7};
      cardValue['questionName'] = result.title;
      cardValue['dataReceived'] = true;
      if (result.body) {
        let mappedResponse = globalFuncs.mapValuesToProperties(result.body.PossibleValues, result.body.Answers, 'count')
        cardValue['questionValue'] = mappedResponse.map((response) => {
          return response.responses;
        })
        cardValue['totalQuestions'] = result.body.TotalQuestions;
      } else {
        cardValue['totalQuestions'] = null;
      }

      this.setState({
        card7: cardValue
      });
    })
  }

  render() {
    return (
      <section className="Culture-Survey-Results">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <Grid container spacing={24} className="Main-Dashboard-Header">
          <Grid item xs={6} className="Dashboard-Welcome dark-blue">

          </Grid>
          <Grid item xs={6} className="flex right-center">
            <SurveyFilter
              selectedSurvey={this.state.selectedSurvey}
              surveyList={this.props.publishedSurveys}
              surveyChange={(e)=>this.surveyChange(e)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card1.dataReceived}
              questionName={this.state.card1.questionName}
              questionNumber={this.state.card1.totalQuestions}
              questionValue={this.state.card1.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card2.dataReceived}
              questionName={this.state.card2.questionName}
              questionNumber={this.state.card2.totalQuestions}
              questionValue={this.state.card2.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card3.dataReceived}
              questionName={this.state.card3.questionName}
              questionNumber={this.state.card3.totalQuestions}
              questionValue={this.state.card3.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card4.dataReceived}
              questionName={this.state.card4.questionName}
              questionNumber={this.state.card4.totalQuestions}
              questionValue={this.state.card4.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card5.dataReceived}
              questionName={this.state.card5.questionName}
              questionNumber={this.state.card5.totalQuestions}
              questionValue={this.state.card5.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card6.dataReceived}
              questionName={this.state.card6.questionName}
              questionNumber={this.state.card6.totalQuestions}
              questionValue={this.state.card6.questionValue}
            />
            <SurveyResultCard
              userLoggedIn={this.props.userLoggedIn}
              dataReceived={this.state.card7.dataReceived}
              questionName={this.state.card7.questionName}
              questionNumber={this.state.card7.totalQuestions}
              questionValue={this.state.card7.questionValue}
            />

          </Grid>
        </Grid>
      </section>
    );
  }
}