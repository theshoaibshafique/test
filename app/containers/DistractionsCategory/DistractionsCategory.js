/*
 * Distractions by Category Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import InsightDate from 'components/InsightDate';
import ProcedureFilter from 'components/ProcedureFilter';
import GenericCard from 'components/GenericCard';
import Computer from './img/computer.jpg'
import Hallway from './img/hallway.jpg'
import Speechbubble1 from './img/speechbubble1.jpg'
import Speechbubble2 from './img/speechbubble2.jpg'
import IconDoor from './img/icon-door.jpg'
import TargetSmall from './img/target-small.jpg'
import TargetLarge from './img/target-large.jpg'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import globalFuncs from '../../global-functions';

export default class DistractionsCategory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentProcedure: 'All',
      numberOfCase: 66,
      numberOfHours: 133,
      card1: {
        lowPercentage: null,
        highPercentage: null,
        alertInstance: null,
        alertDuration: null,
        dataReceived: false
      },
      card2: {
        externalDuration: null,
        externalInstance: null,
        externalLongest: null,
        dataReceived: false
      },
      card3 : {
        enterExitCount: null,
        doorInstanceHour: null,
        doorDuration: null,
        dataReceived: false
      }
    }
  }

  componentWillMount() {
    if (this.props.userLoggedIn)
      this.fetchContainerData();
  }

  procedureChange(e) {
    // this.setState({
    //   currentProcedure: e.target.value
    // })
  }

  fetchContainerData() {
    this.card1Data();
    this.card2Data();
    this.card3Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DDC_AIAANFSD', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['lowPercentage'] = result.body.TopItem;
      cardValue['highPercentage'] = result.body.BottomItem;
      cardValue['alertInstance'] = Math.round(result.body.Average);
      cardValue['alertDuration'] = Math.round(result.body.Duration);
      cardValue['dataReceived'] = true;
      this.setState({
        card1: cardValue
      });
    })
  }

  card2Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DDC_ECICFOTOACTINRTTC', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['externalDuration'] = Math.round(result.body.Duration);
      cardValue['externalInstance'] = Math.round(result.body.Average);
      cardValue['externalLongest'] = Math.round(result.body.MaxDuration);
      cardValue['dataReceived'] = true;
      this.setState({
        card2: cardValue
      });
    })
  }

  card3Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DDC_DOIEADIIODTP', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['enterExitCount'] = Math.round(result.body.Average);
      cardValue['doorInstanceHour'] = Math.round(result.body.Duration);
      cardValue['doorDuration'] = Math.round(result.body.Average2);
      cardValue['dataReceived'] = true;
      this.setState({
        card3: cardValue
      });
    })
  }

  render() {
    return (
      <section className="Distractions-Category">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <Grid container spacing={24} className="Main-Dashboard-Header">
          <Grid item xs={6} className="Dashboard-Welcome dark-blue">
            <ProcedureFilter
              currentProcedure={this.state.currentProcedure}
              caseNo={this.state.numberOfCase}
              hoursNo={this.state.numberOfHours}
              procedureChange={(e) => this.procedureChange(e)}
            />
          </Grid>
          <Grid item xs={6} className="flex right-center">
            <InsightDate
              quarter={1}
              year={2019}
            />
          </Grid>
        </Grid>
        <div className="Package-Section Distractions-Category">
        <Card className="Card Distraction-Category-Card">
          <CardContent className="dark-blue">
            <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card1.dataReceived}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <h3 className="Card-Header">Alerts include alarms and noise from surgical devices</h3>
                  <hr />
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={0} className="flex vertical-center">
                    <Grid item xs={6} className="center-align">
                      <img src={TargetSmall} /> <br />
                      <span className="Alert-Alarm-Stat dark-blue bold">{this.state.card1.lowPercentage}</span><br />
                      has the lowest percentage<br />
                      of Alerts/Alarms instances <br /><br />
                      <img src={TargetLarge} /> <br />
                      <span className="Alert-Alarm-Stat dark-blue bold">{this.state.card1.highPercentage}</span><br />
                      has the highest percentage<br />
                      of Alerts/Alarms instances
                    </Grid>
                    <Grid item xs={6} className="center-align">
                      <img src={Computer} style={{width: '200px'}}/>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={0} className="flex vertical-center" style={{height: '100%', fontSize: '1.5rem'}}>
                      <Grid item xs={12} className="center-align">
                        On average, there are <br />
                        <span style={{fontSize: '4rem', fontWeight: 'bold'}}>{this.state.card1.alertInstance} instances</span><br />
                        of <span className="pink">ALERTS</span> per case<br />
                        <span className="grey">(The duration average, is {this.state.card1.alertDuration} minutes per case)</span>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </GenericCard>
          </CardContent>
        </Card>

        <Card className="Card Distraction-Category-Card">
          <CardContent className="dark-blue">
            <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card2.dataReceived}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <h3 className="Card-Header">External Communication include calls from outside the OR and communications that is not relevent to the case</h3>
                  <hr />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} className="flex vertical-center">
                    <Grid item xs={6} className="center-align" style={{height: '100%', fontSize: '1.5rem'}}>
                      On average, there are<br />
                      <span className="bold extra-large">{this.state.card2.externalDuration} minutes</span><br />
                      of EXTERNAL COMMUNICATION<br />
                      per case<br />
                      (On average, {this.state.card2.externalInstance} instances per case)
                    </Grid>
                    <Grid item xs={6} className="center-align">
                      <img src={Speechbubble1} />
                      <p>
                        <img src={Speechbubble2} style={{width: '75px'}} /> longest instance of external communciation was {this.state.card2.externalLongest} minutes.
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </GenericCard>
          </CardContent>
        </Card>

        <Card className="Card Distraction-Category-Card">
          <CardContent className="dark-blue">
            <GenericCard userLoggedIn={this.props.userLoggedIn} dataReceived={this.state.card3.dataReceived}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <h3 className="Card-Header">Door Opening include everytime a door is open during the procedure</h3>
                  <hr />
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={0} className="flex vertical-center">
                    <Grid item xs={6} className="center-align">
                      <img src={Hallway} />
                    </Grid>
                    <Grid item xs={6} className="center-align">
                      <img src={IconDoor} /><br />
                      On average, people enter and exit the OR {this.state.card3.enterExitCount} times per hour of surgery.
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={0} className="flex vertical-center" style={{height: '100%', fontSize: '1.5rem'}}>
                      <Grid item xs={12} className="center-align">
                        On average, there are <br />
                        <span className="bold extra-large">{this.state.card3.doorInstanceHour} minutes</span><br />
                        of <span className="brown">OPEN DOOR</span> per case<br />
                        <span className="grey">(The average, {this.state.card3.doorDuration} instances per case)</span>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </GenericCard>
          </CardContent>
        </Card>
      </div>
      </section>
    );
  }
}