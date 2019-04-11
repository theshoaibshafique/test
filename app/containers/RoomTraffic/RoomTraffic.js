/*
 * Distractions Page
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import InsightDate from 'components/InsightDate';
import ProcedureFilter from 'components/ProcedureFilter';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import ORHeadCount from 'components/ORHeadCount';
import globalFuncs from '../../global-functions';

export default class RoomTraffic extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentProcedure: 'All',
      numberOfCase: 66,
      numberOfHours: 133,
      card1: {
        doorOpenInstance: 40,
        doorOpenTotal: 3492,
        hoursOfSurgery: 133,
        dataBar : [
          {name: 'Storage Door', instances: 13},
          {name: 'Sterile Door', instances: 2},
          {name: 'Patient Door', instances: 9},
          {name: 'Hallway Door', instances: 16}
        ],
      },
      card2: {
        numberOfProcedures: 44,
        changeOverInstance: 2,
      },
      card3: {
        missingInstance: 99,
        numberOfProcedures: 77,
      },
      card4: {
        averageHeadCount: 6,
      },
      card5: {
        hoursOfSurgery: 44,
        changeOverTotal: 25,
        dataBar : [
          {participant: 'Nurses', instances: 40},
          {participant: 'Anesthesiologist', instances: 11},
          {participant: 'Surgeons', instances: 0},
        ]
      }
    }
  }

  componentWillMount() {
    this.fetchContainerData();
  }

  fetchContainerData() {
    this.card1Data();
    this.card2Data();
    this.card3Data();
    this.card4Data();
    this.card5Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'DRT_HODADOAI', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card1};
      cardValue['doorOpenInstance'] = Math.round(result.body.Average);
      cardValue['doorOpenTotal'] = Math.round(result.body.Total);
      cardValue['numberOfHours'] = Math.round(result.body.Duration);
      cardValue['dataBar'] = result.body.GroupItems.map((item) => {
        return {'name' : item.doorName, 'instances': Math.round(item.average)}
      });
      this.setState({
        card1: cardValue
      });
    })
  }

  card2Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'DRT_CDCS', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card2};
      cardValue['changeOverInstance'] = Math.round(result.body.Average);
      cardValue['numberOfProcedures'] = Math.round(result.body.TotalItems);
      this.setState({
        card2: cardValue
      });
    })
  }

  card3Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'DRT_MDCS', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card3};
      cardValue['missingInstance'] = Math.round(result.body.Average);
      cardValue['numberOfProcedures'] = Math.round(result.body.TotalItems);
      this.setState({
        card3: cardValue
      });
    })
  }

  card4Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'DRT_AHC', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card4};
      cardValue['averageHeadCount'] = Math.round(result.body.Average);
      this.setState({
        card4: cardValue
      });
    })
  }

  card5Data() {
    globalFuncs.getInsightData(process.env.ROOMTRAFFIC_API, 'DRT_CODP', this.props.usertoken).then((result) => {
      let cardValue = {...this.state.card5};
      cardValue['hoursOfSurgery'] = Math.round(result.body.Duration);
      cardValue['changeOverTotal'] = Math.round(result.body.Total);
      cardValue['dataBar'] = result.body.GroupItems.map((item) => {
        return {'participant' : item.item1, 'instances': Math.round(item.item2)}
      });
      this.setState({
        card5: cardValue
      });
    })
  }

  procedureChange(e) {
    this.setState({
      currentProcedure: e.target.value
    })
  }

  render() {
    return (
      <section className="Room-Traffic">
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
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">How Often Does A Door Open After Incision?</h3>
                <hr />
                <Grid container spacing={0}>
                  <Grid item xs={6} className="flex vertical-center" style={{height: '300px'}}>
                  <div className="center-align larger">
                    Door Open Count <br />
                    <span className="highlight purple bold">{this.state.card1.doorOpenInstance} instances</span> <br />
                    per surgery
                  </div>
                  </Grid>
                  <Grid item xs={6} className="center-align">
                    <div className="larger">
                      <span className="highlight purple bold">{this.state.card1.doorOpenTotal}</span><br />
                      Instances of door open when observe in<br />
                      <span className="purple bold">{this.state.card1.hoursOfSurgery} hours of surgery</span>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={this.state.card1.dataBar}>
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="instances" fill="#592d82" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24} className="ROOM-TRAFFIC-DASHBOARD dashboard-even-height">
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Changeover During Critical Steps</h3>
                <hr />
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <div className="dark-grey bold smaller">{this.state.card2.numberOfProcedures} procedure types</div>
                  </Grid>
                </Grid>
                <div className="center-align larger">
                  <FontAwesomeIcon icon="exclamation-triangle" color="#c1272c" size="4x" style={{margin: '25px 0'}} /><br />
                  <h1 className="highlight purple bold" style={{margin: '15px 0'}}>{this.state.card2.changeOverInstance} Instances</h1>
                </div>
                <div className="center-align grey">
                  When a key team member was missing during a critical step
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Missing During Critical Steps</h3>
                <hr />
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <div className="dark-grey bold smaller">{this.state.card3.numberOfProcedures} procedure types</div>
                  </Grid>
                </Grid>
                <div className="center-align larger">
                  <FontAwesomeIcon icon="exclamation-triangle" color="#c1272c" size="4x" style={{margin: '25px 0'}} /><br />
                  <h1 className="highlight purple bold" style={{margin: '15px 0'}}>{this.state.card3.missingInstance} Instances</h1>
                </div>
                <div className="center-align grey">
                  When a key team member was missing during a critical step
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Average Head Count</h3>
                <hr />
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <div className="dark-grey bold smaller">Room Density</div>
                  </Grid>
                </Grid>
                <div className="center-align">
                  <ORHeadCount headCount={this.state.card4.averageHeadCount} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Change Over During Procedure</h3>
                <hr />
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={this.state.card5.dataBar} layout="vertical" margin={{left:80}}>
                        <YAxis dataKey="participant" type="category"/>
                        <XAxis type="number" />
                        <Tooltip />
                        <Bar dataKey="instances" fill="#592d82" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid item xs={7} className="flex vertical-center larger center-align">
                    <div>
                      <span className="highlight purple bold">{this.state.card5.changeOverTotal}</span><br />
                      <span className="highlight purple bold">Change Overs</span><br />
                      <span className="dark-blue bold">during</span> <span className="purple bold">{this.state.card5.hoursOfSurgery} </span><span className="dark-blue bold">hours of surgery</span><br />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </section>
    );
  }
}