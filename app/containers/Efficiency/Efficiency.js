import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card, Modal, DialogContent, IconButton, Button } from '@material-ui/core';
import { mdiCogOutline } from '@mdi/js';
import Icon from '@mdi/react'
import MonthRangePicker from '../../components/MonthRangePicker/MonthRangePicker';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import LoadingOverlay from 'react-loading-overlay';
import globalFunctions from '../../utils/global-functions';
import DisplayNumber from '../../components/Report/InfographicText/DisplayNumber';
import BarChart from '../../components/Report/BarChart/BarChart';
import Histogram from '../../components/Report/Histogram/Histogram';
import StackedBarChart from '../../components/Report/StackedBarChart';
import DetailedMultiLineChart from '../../components/Report/DetailedMultiLineChart/DetailedMultiLineChart';
import Table from '../../components/Report/Table';
import DonutChart from '../../components/Report/DonutChart/DonutChart';
import InfographicParagraph from '../../components/Report/InfographicParagraph/InfographicParagraph';
import CloseIcon from '@material-ui/icons/Close';
import { NavLink } from 'react-router-dom';
import NoData from '../../components/Report/NoData/NoData';
import TimeSeriesChart from '../../components/Report/TimeSeriesChart/TimeSeriesChart';
import TimeSeriesAreaChart from '../../components/Report/TimeSeriesAreaChart/TimeSeriesAreaChart';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';

export default class Efficiency extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ONBOARD_TYPE = "Efficiency";
    this.state = {
      reportType: this.props.reportType,
      isLandingPage: this.props.reportType == "efficiency",
      tabIndex: 0,
      isOnboardModalOpen: false,
      isLoading: true,
      reportData: [],
      chartColours: ['#CFB9E4', '#FF7D7D', '#FFDB8C', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD', '#A7E5FD', '#97E7B3', '#004F6E'],
      selectedOperatingRoom: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: "",
      hasNoCases: false,
      isFilterApplied: true, // Filter is applied right away by default,
      startDate: moment().subtract(1, 'month').startOf('month'),
      endDate: moment().subtract(1, 'month').endOf('month'),
      specialties: [],
      ors: []
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      let selectedSpecialty = this.state.selectedSpecialty
      if (selectedSpecialty && !selectedSpecialty.value) {
        selectedSpecialty = "";
      }
      let startDate = this.state.startDate;
      let endDate = this.state.endDate;
      //if either are null then set to last valid date or latest date with data
      if (!startDate || !endDate) {
        const recentSearchCache = JSON.parse(localStorage.getItem('efficiencyFilter-' + this.props.userEmail));
        startDate = moment(recentSearchCache.startDate) || moment().subtract(1, 'month').startOf('month');
        endDate = moment(recentSearchCache.endDate) || moment().subtract(1, 'month').endOf('month');
      }
      this.setState({
        reportType: this.props.reportType,
        reportData: [],
        selectedSpecialty,
        startDate,
        endDate,
        isLandingPage: this.props.reportType == "efficiency"
      }, () => {
        this.getReportLayout();
      })
    } 
  }

  componentDidMount() {
    this.loadFilter(this.getConfig);
    this.openOnboarding()
  };

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

  async getConfig() {
    return await globalFunctions.genericFetch(process.env.EFFICIENCY_API + "2/config?facilityName=" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        result = JSON.parse(result)

        let earliestStartDate = moment(result.startDate);
        let latestEndDate = moment(result.endDate).endOf('day');
        let startDate = latestEndDate.clone().subtract(3, 'month');
        if (startDate.isBefore(earliestStartDate)){
          startDate = earliestStartDate.clone();
        }
        let endDate = latestEndDate.clone().subtract(12, 'hour');

        const pendingWarning = `Data up until ${latestEndDate.clone().add(8, 'day').format('LL')} will be available on ${latestEndDate.clone().add(22, 'day').format('LL')}. Updates are made every Monday.`;

        const fcotsThresholdList = globalFuncs.formatSecsToTime(result.fcotsThreshold).split(":");
        const turnoverThresholdList = globalFuncs.formatSecsToTime(result.turnoverThreshold).split(":");

        const gracePeriodMinute = this.state.gracePeriodMinute || fcotsThresholdList[1];
        const outlierThresholdHrs = this.state.outlierThresholdHrs || turnoverThresholdList[0];
        const outlierThresholdMinute = this.state.outlierThresholdMinute || turnoverThresholdList[1];
        const specialties = result.filters.Specialties;
        const ors = result.filters.ORs;
        this.setState({
          earliestStartDate, latestEndDate, startDate, endDate, fcotsThreshold: result.fcotsThreshold, turnoverThreshold: result.turnoverThreshold, pendingWarning,
          gracePeriodMinute, outlierThresholdHrs, outlierThresholdMinute, hasEMR: result.hasEMR, hospitalAbbr: result.abbreviation,
          specialties,ors
        }, () => {
          this.getReportLayout();
        });
      });

  }

  getFilterLayout(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'FIRSTCASEONTIMESTART':
        return { showOR: true, showSpecialty: true, showGracePeriod: true }
      case 'TURNOVERTIME':
        return { showOR: true, showOutlierThreshold: true }
      case 'BLOCKUTILIZATION':
        return { showOR: true }
      default:
        return {};
    }
  }

  getThreshold(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'FIRSTCASEONTIMESTART':
        return this.state.fcotsThreshold
      case 'TURNOVERTIME':
        return this.state.turnoverThreshold
      default:
        return 0;
    }
  }

  calculateThreshold(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'FIRSTCASEONTIMESTART':
        const gracePeriod = parseInt(this.state.gracePeriodMinute) * 60;
        return gracePeriod >= 0 ? gracePeriod : this.state.fcotsThreshold;
      case 'TURNOVERTIME':
        const outlierThreshold = parseInt(this.state.outlierThresholdHrs) * (60 * 60) + parseInt(this.state.outlierThresholdMinute) * 60;
        return outlierThreshold >= 0 ? outlierThreshold : this.state.turnoverThreshold;
      default:
        return null;
    }
  }

  getUnavaliableMessage(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'FIRSTCASEONTIMESTART':
        return "Unavailable - at least five cases required in last 30 days"
      case 'BLOCKUTILIZATION':
        return "Unavailable - at least five blocks required in last 30 days"
      default:
        return "";
    }
  }

  openOnboardModal() {
    this.setState({ isOnboardModalOpen: true })
  }
  closeOnboardModal() {
    this.setState({ isOnboardModalOpen: false });
  }



  getReportLayout() {
    this.state.source && this.state.source.cancel('Cancel outdated report calls');
    if (!this.state.endDate || !this.state.startDate) {
      return;
    }
    this.setState({ reportData: [], globalData: [], isFilterApplied: true, isLoading: true, source: axios.CancelToken.source() },
      () => {
        const filter = this.getFilterLayout(this.state.reportType);
        const specialty = filter.showSpecialty && this.state.selectedSpecialty && this.state.selectedSpecialty.id;
        const jsonBody = {
          "dashboardName": this.state.reportType,
          "facilityName": this.props.userFacility,

          "startDate": this.state.startDate && this.state.startDate.format('YYYY-MM-DD'),
          "endDate": this.state.endDate && this.state.endDate.format('YYYY-MM-DD'),

          "roomName": (filter.showOR || filter.showOR2) && this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.id || null,
          "specialtyName": specialty == "" ? null : specialty,
          "procedureName": filter.showProcedure && this.state.selectedProcedure && this.state.selectedProcedure.id,
          "threshold": this.calculateThreshold(this.state.reportType)
        }

        globalFunctions.axiosFetch(process.env.EFFICIENCYTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            result = result.data;
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              result = JSON.parse(result);

              if (result.tiles && result.tiles.length > 0) {
                const reportData = this.groupTiles(result.tiles.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));
                const globalData = this.groupTiles(result.globalTiles.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));
                this.setState({ reportData, globalData, isLoading: false });
              } else {
                //report does not exist
                this.notLoading();
              }
            } else {
              this.notLoading();
            }
          }).catch((error) => {
            this.notLoading();
          });
      });
  };

  groupTiles(tileData) {
    //Group data by "Group"
    return [...tileData.reduce((hash, data) => {
      const current = hash.get(data.groupOrder) || { groupOrder: data.groupOrder, group: [] }
      current.group.push(data)
      return hash.set(data.groupOrder, current);
    }, new Map).values()];
  }

  updateState(key, value) {
    this.setState({
      [key]: value,
      isFilterApplied: false
    }, () => {
      this.saveFilter();
      if ((key == "endDate" || key == "startDate") && this.state.endDate && this.state.startDate) {
        this.getReportLayout();
      }
    });
  }

  loadFilter(callback) {
    if (localStorage.getItem('efficiencyFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('efficiencyFilter-' + this.props.userEmail));
      this.setState({
        ...recentSearchCache,
        startDate: moment(recentSearchCache.startDate),
        endDate: moment(recentSearchCache.endDate)
      }, callback);
    } else {
      this.setState({ isLoading: true }, callback);
    }
  }

  saveFilter() {
    if (!this.state.endDate || !this.state.startDate) {
      return;
    }
    localStorage.setItem('efficiencyFilter-' + this.props.userEmail,
      JSON.stringify({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        selectedOperatingRoom: this.state.selectedOperatingRoom,
        selectedSpecialty: this.state.selectedSpecialty,
        selectedProcedure: this.state.selectedProcedure,
        gracePeriodMinute: this.state.gracePeriodMinute,
        outlierThresholdHrs: this.state.outlierThresholdHrs,
        outlierThresholdMinute: this.state.outlierThresholdMinute
      }));
  }

  handleTabChange(obj, tabIndex) {
    this.setState({ tabIndex });
  }

  renderDashboard() {
    let reportData = this.state.reportData && this.state.reportData || []
    if (this.state.isLandingPage) {
      return <span>
        <StyledTabs
          value={this.state.tabIndex}
          onChange={(obj, value) => this.handleTabChange(obj, value)}
          indicatorColor="primary"
          textColor="primary"
          className="efficiency-tab"
        >
          <StyledTab label="My Hospital" />
          <StyledTab label={<span>Global Comparison</span>} />
        </StyledTabs>
        <TabPanel value={this.state.tabIndex} index={0}>
          <Grid container spacing={3} className={`efficiency-main ${this.state.reportType} ${!this.state.hasEMR && 'no-emr'}`}>
            {this.renderTiles(reportData)}
          </Grid>
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          <Grid container spacing={3} className={`efficiency-main ${this.state.reportType}`}>
            {this.renderTiles(this.state.globalData, false)}
          </Grid>
        </TabPanel>
      </span>
    }

    if (this.state.reportType == 'firstCaseOnTimeStart' && !this.state.hasEMR) {
      return (<Grid container spacing={3} className={`efficiency-main ${this.state.reportType}`}>
        <Grid item xs={12} className="efficiency-select-filter">Analysis cannot be performed due to unavailable case schedule.</Grid>
      </Grid>)
    }
    return <Grid container spacing={3} className={`efficiency-main ${this.state.reportType}`}>
      {
        (this.state.isLoading)
          ?
          <div></div>
          :
          this.renderTiles()
      }
    </Grid>;
  }

  renderTiles(reportData = this.state.reportData, includeExcludedMessage = true) {
    //Tiles of the same type get a different colour
    let tileTypeCount = {};
    let result = reportData && reportData.map((tileGroup, index) => {
      return (
        tileGroup.group.map((tile, i) => {
          tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
          tile.tileTypeCount = tileTypeCount[tile.tileType];
          return <Grid item xs={this.getTileSize(tile.tileType, tile.tileOrder)} className={`grid-${tile.tileType}`} key={`${index}-${i}`}>
            <Card className={`efficiency-card ${tile.tileType}`}>
              <CardContent>{this.renderTile(tile)}</CardContent>
            </Card>
          </Grid>
        })
      )
    }) || [];
    includeExcludedMessage && result.length && result.push(<Grid item xs={12} style={{ paddingTop: 0 }}>
      <InfographicParagraph description={"ORs with no data available are excluded from the report"} />
    </Grid>);
    return result;
  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
    switch (`${tile.tileType}`.toUpperCase()) {
      case 'DETAILEDMULTILINECHART':
        return <DetailedMultiLineChart
          {...tile}
          labelList={this.props.operatingRooms && this.props.operatingRooms.map && this.props.operatingRooms.map((or) => {
            return { value: or.roomName, name: or.roomTitle };
          }) || []} />
      case 'INFOGRAPHICPARAGRAPH':
        return <InfographicParagraph {...tile} />
      case 'INFOGRAPHICTEXT':
        return <DisplayNumber
          title={tile.title}
          footer={tile.footer}
          tooltipText={tile.toolTip}
          unit={tile.unit}
          number={tile.total}
          message={tile.description || tile.body}
        />
      case 'TABLE':
        return <Table procedures={this.state.selectedSpecialty && this.state.selectedSpecialty.procedures} dataPointRows={tile.dataPointRows} description={tile.description || tile.body} />
      case 'BARCHART':
        let pattern = this.state.chartColours.slice(tile.tileTypeCount - 1 % this.state.chartColours.length);
        return <BarChart
          pattern={pattern}
          id={tile.tileTypeCount}
          reportType={this.props.reportType}
          noWrapXTick={this.state.isLandingPage && this.state.tabIndex == 0}
          {...tile}
          labelList={this.props.operatingRooms && this.props.operatingRooms.map && this.props.operatingRooms.map((or) => {
            return { value: or.roomName, name: or.roomTitle };
          }) || []} />
      case 'HISTOGRAM':
        return <Histogram
          id={tile.tileTypeCount}
          reportType={this.props.reportType}
          {...tile}
          labelList={this.props.operatingRooms && this.props.operatingRooms.map && this.props.operatingRooms.map((or) => {
            return { value: or.roomName, name: or.roomTitle };
          }) || []} />
      case 'DONUTCHART':
        return <DonutChart {...tile} specialties={this.state.specialties} orderBy={{ "Setup": 1, "Clean-up": 2, "Idle": 3 }} />
      case 'STACKEDBARCHART':
        return <StackedBarChart {...tile}
          specialties={this.state.specialties}
          horizontalLegend={true}
          orderBy={{ "Setup": 1, "Clean-up": 2, "Idle": 3 }} />
      case 'TIMESERIESCHART':
        return <TimeSeriesChart
          {...tile}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          nullMessage={this.getUnavaliableMessage(this.state.reportType)}
          minDate={this.state.earliestStartDate} />
      case 'TIMESERIESAREACHART':
        return <TimeSeriesAreaChart {...tile} startDate={this.state.startDate} endDate={this.state.endDate} orderBy={{ "Setup": 1, "Clean-up": 2, "Idle": 3 }} minDate={this.state.earliestStartDate} />
      case 'NODATA':
        return <NoData {...tile} />
    }
  }

  getTileSize(tileType, tileOrder) {
    switch (`${tileType}`.toUpperCase()) {
      case 'DETAILEDMULTILINECHART':
      case 'DONUTCHART':
      case 'STACKEDBARCHART':
      case 'BARCHART':
      case 'HISTOGRAM':
      case 'NODATA':
      case 'TIMESERIESCHART':
      case 'TIMESERIESAREACHART':
        return 6;
      case 'TABLE':
      case 'INFOGRAPHICPARAGRAPH':
      case 'INFOGRAPHICTEXT':
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
      <div className="efficiency-page">
        <Grid container spacing={0} className="efficiency-picker-container" >
          <Grid item xs={12} className="efficiency-range-picker">
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
          {this.state.isLandingPage && <Grid item xs={12}>
            <Divider className="efficiency-divider" />
          </Grid>}
          {!this.state.isLandingPage && <Grid item xs={12} className="efficiency-picker">
            <UniversalPicker
              specialties={this.state.specialties}
              ors={this.state.ors}
              userFacility={this.props.userFacility}
              hospitalAbbr={this.state.hospitalAbbr}
              userToken={this.props.userToken}
              defaultState={this.state}
              apply={() => this.getReportLayout()}
              defaultThreshold={this.getThreshold(this.state.reportType)}
              disabled={Boolean(this.state.isFilterApplied || !this.state.startDate || !this.state.endDate)}
              updateState={(key, value) => this.updateState(key, value)}
              {...this.getFilterLayout(this.state.reportType)}
            />
          </Grid>}
          {!this.state.isLandingPage && <Grid item xs={12}>
            <Divider className="efficiency-divider" />
          </Grid>}
          <div className="efficiencyOnboard-link link" onClick={() => this.openOnboardModal()}>
            What's this dashboard about?
          </div>
          {this.props.isAdmin && <div className="efficiency-settings">
            <NavLink to={"/adminPanel/1"} className='link'>
              <span className="settings-icon"><Icon color="#028CC8" style={{ marginRight: 4 }} path={mdiCogOutline} size={'24px'} /></span>Settings
            </NavLink>
          </div>}
        </Grid>
        <LoadingOverlay
          active={isLoading}
          spinner
          text='Loading your content...'
          className={`overlay ${this.state.isLandingPage ? 'landing-page' : ''}`}
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
            open={this.state.isOnboardModalOpen}
            onClose={() => this.closeOnboardModal()}
          >
            <DialogContent className="efficiencyOnBoarding Modal">
              <Grid container spacing={0} justify='center' className="onboard-modal" >
                <Grid item xs={10} className="efficiencyOnBoard-title">
                  What is the Efficiency Dashboard?
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right', padding: '40px 24px 0 40px' }}>
                  <IconButton disableRipple disableFocusRipple onClick={() => this.closeOnboardModal()} className='close-button'><CloseIcon fontSize='small' /></IconButton>
                </Grid>
                <Grid item xs={7} className="efficiencyOnBoard-column">
                  <Grid container spacing={0} direction="column">
                    <Grid item xs className="efficiencyOnBoard-paragraph">
                      This dashboard offers insights into the function of the operating room during elective hours according to three main categories
                    </Grid>
                    <Grid item xs className="efficiencyOnBoard-paragraph">
                      <Grid container spacing={0}>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>First Case On-Time</div>
                        </Grid>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>Turnover Time</div>
                        </Grid>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>Block Utilization</div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <div className="efficiencyOnBoard-segment">
                    <div className="efficiencyOnBoard-subtitle">
                      Segmenting the data:
                    </div>
                    <div>
                      Each category can be filtered according to time, operating room, and specialty as applicable. Trends over time can also be analyzed per category.
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} style={{ textAlign: 'right', marginTop: 40 }}>
                  <Button disableElevation disableRipple variant="contained" className="secondary" style={{ marginRight: 40, marginBottom: 40 }} onClick={() => this.closeOnboardModal()}>Close</Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Modal>
        </LoadingOverlay>
      </div >
    );
  }
}