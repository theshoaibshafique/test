import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';
import SscOnboard from './img/SSC_ONBOARD.png';
import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card, Modal, DialogContent, IconButton, Button } from '@material-ui/core';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from '../../components/Report/ReportScore/ReportScore';
import globalFunctions from '../../utils/global-functions';
import HorizontalBarChart from '../../components/Report/HorizontalBarChart/HorizantalBarChart';
import BarChartDetailed from '../../components/Report/BarChartDetailed/BarChartDetailed';
import LoadingOverlay from 'react-loading-overlay';
import InfographicParagraph from '../../components/Report/InfographicParagraph/InfographicParagraph';
import AreaChart from '../../components/Report/AreaChart/AreaChart';
import BarChart from '../../components/Report/BarChart/BarChart';
import ListDetailed from '../../components/Report/ListDetailed/ListDetailed';
import StackedBarChart from '../../components/Report/StackedBarChart';
import Checklist from '../../components/Report/Checklist';
import ChecklistDetail from '../../components/Report/ChecklistDetail/ChecklistDetail';
import CloseIcon from '@material-ui/icons/Close';
import { COMPLIANCE } from '../../constants';
import TimeSeriesChart from '../../components/Report/TimeSeriesChart/TimeSeriesChart';
import MultiDonutChart from '../../components/Report/MultiDonutChart/MultiDonutChart';
import MonthRangePicker from '../../components/MonthRangePicker/MonthRangePicker';
import ScatterPlot from '../../components/Report/ScatterPlot/ScatterPlot';

export default class SSChecklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ONBOARD_TYPE = "SSChecklist";
    this.state = {

      isOpen: false,
      isOnboardModalOpen: false,
      reportType: this.props.reportType,
      isLoading: true,
      pendingTileCount: 0,
      tileRequest: [],
      reportData: [],
      chartColours: ['#004F6E', '#FF7D7D', '#FFDB8C', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD', '#A7E5FD', '#97E7B3'],
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      hasNoCases: false,
      isFilterApplied: true, // Filter is applied right away by default
      startDate: moment().subtract(1, 'month').startOf('month'),
      endDate: moment().subtract(1, 'month').endOf('month'),
    }
    this.pendingDate = moment();
    this.pendingDate.date(Math.min(process.env.SSC_REPORT_READY_DAY, this.pendingDate.daysInMonth()))

  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      this.setState({ reportType: this.props.reportType, reportData: [] }, () => {
        this.getReportLayout();
      })
    }
  }

  componentDidMount() {
    this.loadFilter(this.getConfig);
    this.openOnboarding()
  };

  async getConfig() {
    return await globalFunctions.genericFetch(process.env.SSC_API + "2/config?facilityName=" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        result = JSON.parse(result)
        let startDate = this.state.startDate;

        let earliestStartDate = moment(result.startDate);
        if (earliestStartDate.isSameOrAfter(startDate)) {
          startDate = earliestStartDate.utc();
        }
        let endDate = this.state.endDate;
        let latestEndDate = moment(result.endDate).endOf('day');
        if (latestEndDate.isSameOrBefore(endDate)) {
          endDate = latestEndDate.subtract(1, 'hour');
        }
        const pendingWarning = `Data up until ${latestEndDate.clone().add(8, 'day').format('LL')} will be available on ${latestEndDate.clone().add(22, 'day').format('LL')}. Updates are made every Monday.`;
        const complianceGoal = result.complianceGoal;
        const engagementGoal = result.engagementGoal;
        const qualityGoal = result.qualityGoal;
        this.setState({
          earliestStartDate, latestEndDate, startDate, endDate, pendingWarning, complianceGoal, engagementGoal, qualityGoal
        }, () => {
          this.getReportLayout();
        });
      });

  }

  openOnboarding() {
    //If they already did the onboard - Dont bother checking API
    if (localStorage.getItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`)) {
      return;
    }
    globalFunctions.axiosFetch(process.env.ONBOARD_API, 'get', this.props.userToken, {})
      .then(result => {
        var data = result.data;

        if (data && data.onboardCompleted && data.onboardCompleted.includes && data.onboardCompleted.includes(this.ONBOARD_TYPE)) {
          localStorage.setItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`, true);
          return;
        }
        this.openOnboardModal();
        this.updateOnboardStatus();
      }).catch((error) => {

      });
  }
  updateOnboardStatus() {
    let jsonBody = { onboardCompleted: [this.ONBOARD_TYPE] };
    globalFunctions.axiosFetch(process.env.USERDETAILSMODIFY_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        //Cache onboard report name so we know not to open it again automatically
        if (result.data) {
          localStorage.setItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`, true);
        }
      }).catch((error) => {

      });
  }

  openOnboardModal() {
    this.setState({ isOnboardModalOpen: true })
  }
  closeOnboardModal() {
    this.setState({ isOnboardModalOpen: false });
  }

  getReportLayout() {
    this.state.source && this.state.source.cancel('Cancel outdated report calls');
    this.setState({ tileRequest: [], isFilterApplied: true, isLoading: true, modalTile: null, source: axios.CancelToken.source() },
      () => {

        const specialty = this.state.selectedSpecialty && this.state.selectedSpecialty.name;
        const jsonBody = {
          "dashboardName": this.state.reportType,
          "facilityId": this.props.userFacility,

          "startDate": this.state.startDate && this.state.startDate.format('YYYY-MM-DD'),
          "endDate": this.state.endDate && this.state.endDate.format('YYYY-MM-DD'),

          "roomId": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value || null,
          "specialtyName": specialty == "All Specialties" ? "" : specialty,
        }
        globalFunctions.axiosFetch(process.env.SSC_API + "2/tile", 'post', this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            result = result.data;
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              result = COMPLIANCE;
              if (result.tiles && result.tiles.length > 0) {
                const reportData = this.groupTiles(result.tiles.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));

                this.setState({ reportData, isLoading: false });

              } else {
                //report does not exist
                this.notLoading();
              }
            } else {
              this.notLoading();
            }
          }).catch((error) => {
          });
      });
  };

  getTile(tileRequest, i, j) {
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": globalFuncs.formatDateTime(this.state.month.startOf('month')),
      "endDate": globalFuncs.formatDateTime(this.state.month.endOf('month')),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "days": this.state.selectedWeekday && [moment().isoWeekday(this.state.selectedWeekday).day()] || [],
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": ""
    }
    jsonBody.Monthly = !Boolean(jsonBody.roomName || jsonBody.days.length || jsonBody.specialtyName);

    if (tileRequest.tileType == 'InfographicMessage') {
      let pendingDate = this.pendingDate;
      if (this.state.month.clone().isSameOrAfter(moment(), 'month')) {
        pendingDate = pendingDate.clone().add(1, 'month');
      }
      //The report isnt "pending" - Its empty
      if (moment().isSameOrAfter(pendingDate.clone())) {
        this.setState({ tileRequest: [], isLoading: false, pendingTileCount: this.state.pendingTileCount - 1 });
        return;
      }

      let reportData = this.state.reportData;
      if (moment(tileRequest.startDate).isSame(this.state.month, 'month')) {
        reportData[i].group[j] = tileRequest;
      }
      this.setState({ reportData, pendingTileCount: this.state.pendingTileCount - 1 },
        () => {
          if (this.state.pendingTileCount <= 0) {
            this.notLoading();
          }
        });
      return;
    }

    globalFuncs.axiosFetch(process.env.SSCTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
      .then(result => {
        result = result.data;
        if (result === 'error' || result === 'conflict') {
          this.notLoading();
        } else {
          result.tileOrder = tileRequest.tileOrder;
          result.tileType = tileRequest.tileType;
          result.groupOrder = tileRequest.groupOrder;
          result.dashboardName = tileRequest.dashboardName;

          let reportData = this.state.reportData;
          if (moment(tileRequest.startDate).isSame(this.state.month, 'month')) {
            reportData[i].group[j] = result;
          }
          if (tileRequest.tileType == 'InfographicParagraph' && result.dataPoints) {
            //In thee case that there is NO CASES and you're using filters - we show custom mesage
            this.setState({ hasNoCases: result.dataPoints && result.dataPoints.length > 0 && parseInt(result.dataPoints[0].valueX) <= 0 && !jsonBody.Monthly })
          }
          this.setState({ reportData, pendingTileCount: this.state.pendingTileCount - 1 },
            () => {
              if (this.state.pendingTileCount <= 0) {
                this.notLoading();
              }
            });
        }
      }).catch((error) => {
        this.setState({ pendingTileCount: this.state.pendingTileCount - 1 })
        // console.error("tile",error)
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

  closeModal() {
    this.setState({ isOpen: false });
  }

  openModal(tileRequest) {
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": globalFuncs.formatDateTime(this.state.month.startOf('month')),
      "endDate": globalFuncs.formatDateTime(this.state.month.endOf('month')),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "days": this.state.selectedWeekday && [moment().isoWeekday(this.state.selectedWeekday).day()] || [],
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": ""
    }
    jsonBody.Monthly = !Boolean(jsonBody.roomName || jsonBody.days.length || jsonBody.specialtyName);
    let modal = this.state.modalTile || { days: [] };
    //If nothing changed - open the tile
    if (modal.days.length === jsonBody.days.length && modal.days.every(function (value, index) { return value === jsonBody.days[index] })
      && modal.roomName == jsonBody.roomName
      && modal.specialtyName == jsonBody.specialtyName
      && moment.utc(modal.startDate).isSame(this.state.month.startOf('month'), 'month')) {
      this.setState({ isOpen: true })
      return
    }

    this.setState({ isOpen: true, modalTile: this.state.modalTile || jsonBody });
    globalFuncs.axiosFetch(process.env.SSCTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
      .then(result => {
        result = result.data;
        if (result === 'error' || result === 'conflict') {
          this.setState({ isOpen: false, modalTile: null, isLoading: false });
        } else {
          result = { ...jsonBody, ...result, roomName: jsonBody.roomName };
          if (moment.utc(tileRequest.dataDate).isSame(this.state.month.startOf('month'), 'month')) {
            this.setState({ modalTile: result });
          }

        }
      }).catch((error) => {
        this.setState({ isOpen: false, modalTile: null, isLoading: false });
      });
  }

  updateMonth(month) {
    this.setState({
      month: month,
      isLoading: true
    }, () => {
      this.saveFilter();
      this.getReportLayout();
    });
  }

  updateState(key, value) {
    this.setState({
      [key]: value,
      isFilterApplied: false
    }, () => {
      this.saveFilter();
    });
  }

  loadFilter(callback) {
    if (localStorage.getItem('sscFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('sscFilter-' + this.props.userEmail));
      this.setState({
        ...recentSearchCache,
        startDate: moment(recentSearchCache.startDate),
        endDate: moment(recentSearchCache.endDate)
      }, callback);
    } else {
      this.setState({ isLoading: true }, callback)
    }
  }

  saveFilter() {
    localStorage.setItem('sscFilter-' + this.props.userEmail,
      JSON.stringify({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        selectedOperatingRoom: this.state.selectedOperatingRoom,
        selectedWeekday: this.state.selectedWeekday,
        selectedSpecialty: this.state.selectedSpecialty
      }));
  }

  renderDashboard() {

    return this.renderTiles()

    // return <Grid container spacing={3} className={`ssc-main ${this.state.reportType}`} direction="column">
    //   {
    //     this.state.hasNoCases ?
    //       (<Grid item xs={12} className="ssc-message">
    //         No data available this month
    //         <Grid item xs={12} className="ssc-message-subtitle">
    //           (Try a different filter criteria)
    //         </Grid>
    //       </Grid>)
    //       :
    //       (!this.state.reportData.length)
    //         ?
    //         !isLoading && <Grid item xs={12} className="ssc-message">
    //           No data available this month
    //                 </Grid>
    //         :
    //         !isLoading && this.renderTiles()}
    // </Grid>
  }


  renderTiles(reportData = this.state.reportData) {
    let tileTypeCount = {};
    let xs = null;
    switch (`${this.state.reportType}`.toUpperCase()) {
      case 'OVERVIEW':
        xs = [12];
        break;
      default:
        xs = [4, 8];
    }

    let result = reportData && reportData.map((tileGroup, index) => {
      return (
        // xs should be max tilesize of group
        <Grid item xs={xs[index]}>
          <Grid container spacing={3}>
            {tileGroup.group.map((tile, i) => {
              tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
              tile.tileTypeCount = tileTypeCount[tile.tileType];
              return <Grid item xs={this.getTileSize(tile.tileType, tile.tileOrder)} className={`grid-${tile.tileType}`} key={`${index}-${i}`}>
                <Card className={`ssc-card ${tile.tileType}`}>
                  <CardContent>{this.renderTile(tile)}</CardContent>
                </Card>
              </Grid>
            })}
          </Grid>
        </Grid>
      )
    }) || [];
    return <Grid container spacing={3} className={`ssc-main ${this.state.reportType}`}>{result}</Grid>;
  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
    switch (`${tile.tileType}`.toUpperCase()) {
      case 'LIST':
        return <HorizontalBarChart {...tile} specialties={this.props.specialties} />

      case 'BARCHARTDETAILED':
        return <BarChartDetailed {...tile} pushUrl={this.props.pushUrl} />
      case 'INFOGRAPHICPARAGRAPH':
        return <InfographicParagraph {...tile} />
      case 'LINECHART':
      case 'AREACHART':
        return <AreaChart {...tile} />
      case 'BARCHART':
        if (this.state.reportType == 'QualityScoreReport') {
          tile.tileTypeCount += 1;
        }
        let pattern = this.state.chartColours.slice(tile.tileTypeCount - 1, this.state.chartColours.length);
        return <BarChart
          pattern={pattern} id={tile.tileTypeCount}
          reportType={this.props.reportType}
          {...tile}
          unit={'%'}
          footer={''}
          yAxis={tile.subTitle}
          xAxis={tile.footer} />
      case 'LISTDETAIL':
      case 'LISTDETAILED':
        return <ListDetailed {...tile} specialties={this.props.specialties} />
      case 'CHECKLIST':
        return <Checklist {...tile} openModal={(tileRequest) => this.openModal(tileRequest)} />
      case 'CHECKLISTDETAIL':
        return <ChecklistDetail {...tile} closeModal={() => this.closeModal()} />
      case 'STACKEDBARCHART':
        return <StackedBarChart {...tile} specialties={this.props.specialties} yAxis={tile.subTitle} xAxis={tile.footer} title={tile.description} description={''} />
      case 'TIMESERIESCHART':
        return <TimeSeriesChart {...tile} startDate={this.state.startDate} endDate={this.state.endDate} />
      case 'DONUTBOX':
        return <MultiDonutChart {...tile} />
      case 'METERINFOGRAPHIC':
        return <ReportScore {...tile} goal={this.state[`${this.state.reportType.toLowerCase()}Goal`]} />
      case 'SCATTERPLOT':
        return <ScatterPlot {...tile} goal={this.state[`${this.state.reportType.toLowerCase()}Goal`]} />

      case 'INFOGRAPHICMESSAGE':
        let pendingDate = this.pendingDate;
        //If the selected month is CURRENT month when this message is shown - Report will be ready next month
        // if (this.state.month.clone().isSameOrAfter(moment(), 'month')) {
        //   pendingDate = pendingDate.clone().add(1, 'month');
        // }
        return <div>{`We’re currently processing the data for this month’s report. Please come back on ${pendingDate.format('LL')} to view your report.`}</div>
    }
  }

  getTileSize(tileType) {
    switch (`${tileType}`.toUpperCase()) {
      case 'TIMESERIESCHART':
        return 12;
      default:
        return 12;
    }
  }

  notLoading() {
    this.setState({
      isLoading: false
    });
  }

  render() {
    let isLoading = this.state.isLoading;
    return (
      <div className="ssc-page">
        <Grid container spacing={0} className="ssc-picker-container" >
          <Grid item xs={12} className="ssc-picker">
            <div style={{ maxWidth: 800, margin: 'auto' }}>
              <MonthRangePicker
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                minDate={this.state.earliestStartDate}
                maxDate={this.state.latestEndDate}
                updateState={(key, value) => this.updateState(key, value)}
                displayWarning={this.state.pendingWarning}
              />
            </div>
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
              apply={() => this.getReportLayout()}
              disabled={this.state.isFilterApplied}
              updateState={(key, value) => this.updateState(key, value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
          <div className="sscOnboard-link link" onClick={() => this.openOnboardModal()}>
            What's this report about?
          </div>
        </Grid>
        <LoadingOverlay
          active={isLoading}
          spinner
          fadeSpeed={0}
          text='Loading your content...'
          className="overlay"
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'none',
              color: '#000',
              opacity: 0.8,
              color: "#000000",
              fontFamily: "Noto Sans",
              fontSize: 18,
              lineHeight: "24px"
            }),
            spinner: (base) => ({
              ...base,
              '& svg circle': {
                stroke: 'rgba(0, 0, 0, 0.5)'
              }
            })
          }}
        >
          {this.renderDashboard()}

          <Modal
            open={this.state.isOpen}
            onClose={() => this.closeModal()}
          >
            <DialogContent className="ssc Modal" style={{ minHeight: 320, minWidth: 320 }}>
              {this.renderTile(this.state.modalTile)}
            </DialogContent>
          </Modal>
          <Modal
            open={this.state.isOnboardModalOpen}
            onClose={() => this.closeOnboardModal()}
          >
            <DialogContent className="sscOnboarding Modal">
              <Grid container spacing={0} justify='center' className="onboard-modal" >
                <Grid item xs={10} className="sscOnboard-title">
                  What is the Surgical Safety Checklist Report?
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right', padding: '40px 24px 0 40px' }}>
                  <IconButton disableRipple disableFocusRipple onClick={() => this.closeOnboardModal()} className='close-button'><CloseIcon fontSize='small' /></IconButton>
                </Grid>
                <Grid item xs={6} className="sscOnboard-paragraph">
                  <div className="sscOnboard-paragraph-block1">
                    This report offers insights into the three phases (Briefing, Time Out, Postop Debrief) of the Surgical Safety Checklist with respect to three main scores: Compliance, Engagement, and Quality.
                  </div>
                  <div className="sscOnboard-paragraph-block2">
                    Each score targets a different aspect of the conduct of the checklist that teams can improve upon to promote its usage and develop a shared understanding of the surgery being performing.
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <div className="ssc-Onboard-report-info Compliance">
                      <span className="sscOnboard-hex">&#x2B22;</span>
                      <span className="sscOnboard-report-title">Compliance Score </span>
                    is a measure of how often, and when, the each phase of the checklist was conducted.
                    </div>
                    <div className="ssc-Onboard-report-info Engagement">
                      <span className="sscOnboard-hex">&#x2B22;</span>
                      <span className="sscOnboard-report-title">Engagement Score </span>
                    is a measure of the team’s focus during each phase of the checklist.
                    </div>
                    <div className="ssc-Onboard-report-info Quality">
                      <span className="sscOnboard-hex">&#x2B22;</span>
                      <span className="sscOnboard-report-title">Quality Score </span>
                    is a measure of the information being exchanged during the briefing, time out and postop debrief.
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="sscOnboard-segment">
                    <div className="sscOnboard-subtitle">
                      Segmenting the data:
                    </div>
                    <div>
                      Data can be filtered by date, OR, and specialty, as applicable to facilitate the identification of areas for improvement.
                    </div>
                  </div>
                  <div className="sscOnboard-image">
                    <img src={SscOnboard} />
                  </div>
                </Grid>

                <Grid item xs={12} style={{ textAlign: 'right', marginTop: 40 }}>
                  <Button disableElevation disableRipple variant="contained" className="secondary" style={{ marginRight: 40, marginBottom: 40 }} onClick={() => this.closeOnboardModal()}>Close</Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Modal>
        </LoadingOverlay>
      </div>
    );
  }
}