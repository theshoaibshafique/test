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
import Hallway from './img/Hallway.jpg';
import Layout from './img/layout1.jpg';
import { Link } from 'react-router-dom';
import globalFuncs from '../../global-functions';

export default class Distractions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      currentProcedure: 'All',
      numberOfCase: 66,
      numberOfHours: 133,
      numberOfDistractions: 45,
      mostDistractionCategory: 'Door Closing',
      mostDistractionProcedure: 'Gastric Sleeve',
      mostDistractionOR: 'Room #6',
      distractionTime: 5,
      columnSize: 4,
      columnHidden: ''
    }
  }

  componentWillMount() {
    this.fetchContainerData();
  }

  procedureChange(e) {
    this.setState({
      currentProcedure: e.target.value
    })
  }

  fetchContainerData() {
    this.card1Data();
    this.card2Data();
    this.card3Data();
    this.card4Data();
    this.card5Data();
  }

  card1Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DD_ESODAU', this.props.usertoken).then((result) => {
      this.setState({
        distractionTime: Math.round(result.body.Average)
      });
    })
  }

  card2Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DD_HMIODDYTF', this.props.usertoken).then((result) => {
      this.setState({
        numberOfDistractions: Math.round(result.body.Average)
      });
    })
  }

  card3Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DD_SBC', this.props.usertoken).then((result) => {
      this.setState({
        mostDistractionCategory: result.body.TopItem
      });
    })
  }

  card4Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DD_SBPT', this.props.usertoken).then((result) => {
      this.setState({
        mostDistractionProcedure: result.body.TopItem
      });
    })
  }

  card5Data() {
    globalFuncs.getInsightData(process.env.DISTRACTIONS_API, 'DD_SBOR', this.props.usertoken).then((result) => {
      console.log(result)
      // this.setState({
      //   numberOfDistractions: Math.round(result.body.Average)
      // });
    })
  }

  render() {
    return (
      <section className="Distractions dashboard-even-height">
        <Helmet>
          <title>Distractions</title>
          <meta name="description" content="SST Insights" />
        </Helmet>
        <button onClick={() => this.fetchContainerData()}>Fetch</button>
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
          <Grid item xs={6}>
            <Card className="Card flex vertical-center">
              <CardContent className="dark-blue">
                <a href="https://www.facs.org/about-acs/statements/89-distractions" target="_blank"  style={{textDecoration: 'none', display: 'block'}}>
                  <h3 className="Card-Header large center-align">Statement on Distrations in the Operating Room</h3>
                  <div className="grey center-align padding20">
                    by the American College of Surgeons (ACS) Committee on Perioperative Care and approved by the ACS Board of Regents at its June 2016 meeting.
                    <br /><FontAwesomeIcon icon="external-link-alt" color="#999999" size="2x" />
                  </div>
                </a>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">Every second of distraction adds up</h3>
                <hr />
                <div className="dark-grey bold smaller">{this.state.numberOfCase} cases captured</div>
                <div className="card-content center-align">
                  Distraction time in your hospital is <br />
                  <span className="large purple bold">{this.state.distractionTime} minutes</span><br />
                  per operation
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className="Card">
              <CardContent className="dark-blue">
                <h3 className="Card-Header">How many instances of distractions does your team face?</h3>
                <hr />
                <Grid container spacing={24}>
                  <Grid item xs={6}>
                    <div className="dark-grey bold smaller">{this.state.numberOfCase} cases captured</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="right-align dark-grey bold smaller">{this.state.numberOfHours} hours captured</div>
                  </Grid>
                </Grid>
                <div className="card-content center-align">
                  In your hospital, there are<br />
                  <span className="large purple bold">{this.state.numberOfDistractions} distractions</span><br />
                  per<br />
                  <span className="large purple bold">1 hour or surgery</span><br />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={this.state.columnSize}>
            <Link to="./distractions/category" style={{textDecoration: 'none'}}>
              <Card className="Card">
                <CardContent className="dark-blue">
                  <h3 className="Card-Header">Search by Categories</h3>
                  <hr />
                  <div className="dark-grey bold smaller">4 categories</div>
                  <div className="card-content card-content-small center-align">
                    <img src={Hallway} style={{width: '85px'}} />
                    <h5 className="medium purple bold">{this.state.mostDistractionCategory}</h5>
                    <p>is the category with the highest number of distractions per minute</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={4} className={this.state.columnHidden}>
            <Link to="./distractions/procedure" style={{textDecoration: 'none'}}>
              <Card className="Card">
                <CardContent className="dark-blue">
                  <h3 className="Card-Header">Search by Procedure Type</h3>
                  <hr />
                  <div className="dark-grey bold smaller">10 procedure types</div>
                  <div className="card-content card-content-small center-align">
                    <FontAwesomeIcon icon="exclamation-triangle" color="#c1272c" size="4x" style={{marginBottom: '14px'}} />
                    <h5 className="medium purple bold">{this.state.mostDistractionProcedure}</h5>
                    <p>The procedure with the highest number of distractions per minute</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={this.state.columnSize}>
            <Link to="./distractions/room" style={{textDecoration: 'none'}}>
              <Card className="Card">
                <CardContent className="dark-blue">
                  <h3 className="Card-Header">Search by Operating Room</h3>
                  <hr />
                  <div className="dark-grey bold smaller">3 Operating rooms</div>
                  <div className="card-content card-content-small center-align">
                    <img src={Layout} />
                    <h5 className="medium purple bold">{this.state.mostDistractionOR}</h5>
                    <p>Operating Room with the highest inefficiency</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </section>
    );
  }
}