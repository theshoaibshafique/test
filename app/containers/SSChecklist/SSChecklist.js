import React from 'react';

import 'c3/c3.css';
import './style.scss';

import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card } from '@material-ui/core';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from '../../components/Report/ReportScore/ReportScore';
import globalFunctions from '../../utils/global-functions';
import HorizontalBarChart from '../../components/Report/HorizontalBarChart/HorizantalBarChart';
import BarChartDetail from '../../components/Report/BarChartDetail/BarChartDetail';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      month: moment(),
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: ""
    }

  }

  componentDidMount() {
    this.loadFilter();
    this.setLayout();
  };

  setLayout() {
    globalFunctions.genericFetch(process.env.SSC_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else if (result) {
          if (result.tileRequest && result.tileRequest.length > 0) {

          } else {
            //report does not exist
          }
        } else {

        }
      });
  };
  updateMonth(month) {
    this.setState({
      month: month,
      // isLoading: true
    }, () => {
      // this.setTileRequestDates();
      this.saveFilter();
    });
  }

  updateState(key, value) {
    this.setState({
      [key]: value,
      // isLoading: true
    }, () => {
      this.saveFilter();
      // this.setTileRequestDates();
    });
  }

  loadFilter() {
    if (localStorage.getItem('sscFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('sscFilter-' + this.props.userEmail));
      this.setState({ ...recentSearchCache, month:moment(recentSearchCache.month) });
    }
  }

  saveFilter() {
    localStorage.setItem('sscFilter-' + this.props.userEmail,
      JSON.stringify({
        month: this.state.month,
        selectedOperatingRoom: this.state.selectedOperatingRoom,
        selectedWeekday: this.state.selectedWeekday,
        selectedSpecialty: this.state.selectedSpecialty,
        selectedProcedure: this.state.selectedProcedure
      }));
  }

  redirect(requestId) {
    this.props.pushUrl('/emm/' + requestId);
  }

  render() {
    return (
      <div className="ssc-page">
        <Grid container spacing={0} className="ssc-picker-container" >
          <Grid item xs={12} className="ssc-picker">
            <div style={{ maxWidth: 800, margin: 'auto' }}><MonthPicker month={this.state.month} updateMonth={(month) => this.updateMonth(month)} /></div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
          <Grid item xs={12} className="ssc-picker">
            <UniversalPicker
              specialties={this.props.specialties}
              userFacility={this.props.userFacility}
              userToken={this.props.userToken}
              defaultState={this.state}
              updateState={(key, value) => this.updateState(key, value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
        </Grid>
        <Grid container spacing={3} className="ssc-main">
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Compliance Score"
                  redirectDisplay="View Compliance Details"
                  redirectLink="/complianceScore"
                  score="70"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Engagement Score"
                  redirectDisplay="View Engagement Details"
                  redirectLink="/engagementScore"
                  score="52"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <ReportScore
                  pushUrl={this.props.pushUrl}
                  title="Quality Score"
                  redirectDisplay="View Quality Details"
                  redirectLink="/qualityScore"
                  score="58"
                  tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card className="ssc-card">
              <CardContent>
                <BarChartDetail />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} >
            <Card className="ssc-card">
              <CardContent>
                <HorizontalBarChart />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <span className="ssc-info"><span style={{ fontWeight: 'bold' }}>1,000</span> Case Data based on filter criteria</span>
          </Grid>
        </Grid>
      </div>
    );
  }
}