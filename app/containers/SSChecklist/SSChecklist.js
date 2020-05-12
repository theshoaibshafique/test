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
import LoadingOverlay from 'react-loading-overlay';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.temp = [{
      "name": null,
      "reportName": null,
      "title": "Compliance Score",
      "subTitle": "View Compliance Details",
      "body": null,
      "footer": "/complianceScore",
      "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": null,
          "subTitle": null,
          "description": null,
          "valueX": 70,
          "valueY": null,
          "valueZ": null,
          "note": null
        }
      ],
      "active": true,
      "dataDate": "0001-01-01T00:00:00",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "procedureName": null,
      "specialtyName": null
    },
    {
      "name": null,
      "reportName": null,
      "title": "Engagement Score",
      "subTitle": "View Engagement Details",
      "body": null,
      "footer": "/engagementScore",
      "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": null,
          "subTitle": null,
          "description": null,
          "valueX": 52,
          "valueY": null,
          "valueZ": null,
          "note": null
        }
      ],
      "active": true,
      "dataDate": "0001-01-01T00:00:00",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "procedureName": null,
      "specialtyName": null
    },
    {
      "name": null,
      "reportName": null,
      "title": "Quality Score",
      "subTitle": "View Quality Details",
      "body": null,
      "footer": "/qualityScore",
      "description": "Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted.",
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": null,
          "subTitle": null,
          "description": null,
          "valueX": 58,
          "valueY": null,
          "valueZ": null,
          "note": null
        }
      ],
      "active": true,
      "dataDate": "0001-01-01T00:00:00",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "procedureName": null,
      "specialtyName": null
    },
    {
      "name": null,
      "reportName": null,
      "title": "Monthly Trend",
      "subTitle": "",
      "body": null,
      "footer": "",
      "description": "",
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": "Compliance Score",
          "subTitle": "",
          "description": "",
          "valueX": "85",
          "valueY": "5",
          "note": ""
        }
      ],
      "active": true,
      "dataDate": "0001-01-01T00:00:00",
      "hospitalName": null,
      "facilityName": null,
      "departmentName": null,
      "roomName": null,
      "procedureName": null,
      "specialtyName": null
    },

    {
      "name": null,
      "reportName": "SSC_TS",
      "title": "Top 3 Specialties",
      "subTitle": "by Average Score",
      "body": null,
      "footer": null,
      "description": null,
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F",
          "subTitle": "",
          "description": "",
          "valueX": "89",
          "valueY": "",
          "valueZ": "",
          "note": ""
        },
        {
          "title": "95F656BA-06BE-4BB5-994C-3AC17FBC6DCB",
          "subTitle": "",
          "description": "",
          "valueX": "86",
          "valueY": "",
          "valueZ": "",
          "note": ""
        },
        {
          "title": "1E84E235-220B-4296-8BA2-9D6EA0FCE370",
          "subTitle": "",
          "description": "",
          "valueX": "80",
          "valueY": "",
          "valueZ": "",
          "note": ""
        }
      ],
      "active": true,
      "dataDate": "2020-05-01T00:00:00-04:00",
      "monthly": true,
      "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
      "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
      "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
      "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
      "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
      "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
    },
    {
      "name": null,
      "reportName": "SSC_CC",
      "title": null,
      "subTitle": null,
      "body": null,
      "footer": null,
      "description": "{0} Case Data based on filter criteria",
      "total": null,
      "assets": null,
      "dataPoints": [
        {
          "title": null,
          "subTitle": null,
          "description": null,
          "valueX": "1000",
          "valueY": null,
          "valueZ": null,
          "note": null
        }
      ],
      "active": true,
      "dataDate": "2020-05-01T00:00:00-04:00",
      "monthly": false,
      "hospitalName": "738D2883-5B17-454A-BD4D-9628218016F9",
      "facilityName": "FE063AF9-99AB-4A0A-BCDD-DC9E76ECF567",
      "departmentName": "19F36BB1-82AE-4473-9AFB-C3E561ACA15E",
      "roomName": "92A1D4B7-806A-4D20-9D24-3376E0584124",
      "procedureName": "823774C6-5583-47B0-8397-1B2EBDA40794",
      "specialtyName": "DEB47645-C2A2-4F96-AD89-31FFBCF5F39F"
    }
    ];

    this.state = {
      isLoading: true,
      pendingTileCount: 0,
      tileRequest: [],
      reportData: [],


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
    this.getReportLayout();
  };

  getReportLayout() {
    globalFunctions.genericFetch(process.env.SSC_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else if (result) {
          if (result.tileRequest && result.tileRequest.length > 0) {
            // result.tileRequest.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder);
            this.setState({ pendingTileCount: this.state.pendingTileCount + result.tileRequest.length, tileRequest: result.tileRequest },
              () => {
                // let x = this.groupTiles(result.tileRequest)
                result.tileRequest.map((tile, index) => {
                  this.getTile(tile, index);
                });

              });
          } else {
            //report does not exist
            this.notLoading();
          }
        } else {

        }
      });
  };

  getTile(tileRequest, index) {
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": this.state.month.startOf('month').format(),
      "endDate": this.state.month.endOf('month').format(),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "day": this.state.selectedWeekday,
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": this.state.selectedProcedure && this.state.selectedProcedure.value
    }

    globalFuncs.genericFetch(process.env.SSCTILE_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else {
          //TODO: remove hardcoded values
          result = this.temp[index];
          result.tileOrder = tileRequest.tileOrder;
          result.tileType = tileRequest.tileType;
          result.groupOrder = tileRequest.groupOrder;
          let rawData = this.state.rawData || [];
          if (true || moment(tileRequest.startDate).isSame(this.state.month, 'month') && rawData.findIndex((t) => (t.tileOrder == result.tileOrder && result.groupOrder == t.groupOrder) < 0)) {
            rawData.push(result);
          }
          this.setState({ rawData, pendingTileCount: this.state.pendingTileCount - 1 },
            () => {
              if (this.state.pendingTileCount <= 0) {
                this.notLoading();
                let reportData = this.state.rawData.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder);
                this.setState({ reportData: this.groupTiles(reportData) });
              }
            });
        }
      });
  }

  groupTiles(tileData) {
    //Group data by "Group"
    return [...tileData.reduce((hash, data) => {
      const current = hash.get(data.groupOrder) || { groupOrder: data.groupOrder, group: [] }
      current.group.push(data)
      return hash.set(data.groupOrder, current);
    }, new Map).values()];
  }

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
      this.setState({ ...recentSearchCache, month: moment(recentSearchCache.month) });
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

  renderTiles() {
    return this.state.reportData.map((tileGroup, index) => {
      return tileGroup.group.length > 1 ? (
        <Grid item xs={12} >
          <Card className="ssc-card">
            <CardContent>
              <Grid container spacing={0} alignItems="center">
                {
                  tileGroup.group.map((tile, index) => {
                    return <Grid item xs={this.getTileSize(tile.tileType)}>{this.renderTile(tile)}</Grid>
                  })
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ) : <Grid item xs={this.getTileSize(tileGroup.group[0].tileType)} key={index}>
          <Card className="ssc-card">
            <CardContent>{this.renderTile(tileGroup.group[0])}</CardContent>
          </Card>
        </Grid>
    });
  }

  renderTile(tile) {
    switch (tile.tileType) {
      case 'List':
        return <HorizontalBarChart />
      case 'InfographicText':
        return <ReportScore
          pushUrl={this.props.pushUrl}
          title="Quality Score"
          redirectDisplay="View Quality Details"
          redirectLink="/qualityScore"
          score="58"
          tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
      case 'BarChartDetailed':
        return <BarChartDetail />
      case 'InfographicParagraph':
        return <span className="ssc-info"><span style={{ fontWeight: 'bold' }}>1,000</span> Case Data based on filter criteria</span>
    }
  }

  getTileSize(tileType) {
    switch (tileType) {
      case 'List':
      case 'InfographicText':
        return 4;
      case 'BarChartDetailed':
        return 8;
      case 'InfographicParagraph':
        return 12;
    }
  }

  loading() {
    this.setState({
      isLoading: true
    });
  }

  notLoading() {
    this.setState({
      isLoading: false
    });
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
        <LoadingOverlay
          active={this.state.isLoading}
          spinner
          text='Loading your content...'
          className="Overlay"
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'none',
              color: '#000'
            }),
            spinner: (base) => ({
              ...base,
              '& svg circle': {
                stroke: 'rgba(0, 0, 0, 0.5)'
              }
            })
          }}
        >
          <Grid container spacing={3} className="ssc-main">
            {!this.state.tileRequest.length ?
              <Grid item xs={12} className="ssc-message">
                No data available this month
            </Grid> :
              this.renderTiles()}
            {/* <Grid item xs={4} >
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
            <Grid item xs={12} >
              <Card className="ssc-card">
                <CardContent>
                  <Grid container spacing={0} alignItems="center">
                    <Grid item xs={4}>
                      <ReportScore
                        pushUrl={this.props.pushUrl}
                        title="Quality Score"
                        redirectDisplay="View Quality Details"
                        redirectLink="/qualityScore"
                        score="58"
                        tooltipText="Checklist Score is scored out of 100 using current month data. It is calculated based on how each phase of the checklist is conducted." />
                    </Grid>
                    <Grid item xs={8}>
                      <BarChartDetail />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        </LoadingOverlay>
      </div>
    );
  }
}