import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';

import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card, Modal, DialogContent, IconButton, Button, withStyles, Tabs, Tab } from '@material-ui/core';
import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import ReportScore from '../../components/Report/ReportScore/ReportScore';
import globalFunctions from '../../utils/global-functions';
import InfographicParagraph from '../../components/Report/InfographicParagraph/InfographicParagraph';
import ChecklistDetail from '../../components/Report/ChecklistDetail/ChecklistDetail';
import CompareInfographic from '../../components/Report/CompareInfographic/CompareInfographic';

import TimeSeriesChart from '../../components/Report/TimeSeriesChart';
import MultiDonutChart from '../../components/Report/MultiDonutChart/MultiDonutChart';
import MonthRangePicker from '../../components/MonthRangePicker/MonthRangePicker';
import ScatterPlot from '../../components/Report/ScatterPlot';
import ItemList from '../../components/Report/ItemList';
import NoData from '../../components/Report/NoData/NoData';
import MultiTimeSeriesChart from '../../components/Report/MultiTimeSeriesChart';
import DonutHistogram from '../../components/Report/DonutHistogram/DonutHistogram';
import { NavLink } from 'react-router-dom';
import { mdiCogOutline } from '@mdi/js';
import Icon from '@mdi/react'
import { SSCOnboardModal } from './SSCOnboardModal/SSCOnboardModel';
import { GenericInformationPage } from './GenericInformationPage/GenericInformationPage';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';



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
      specialties: [],
      ors: []
    }
    this.pendingDate = moment();
    this.pendingDate.date(Math.min(process.env.SSC_REPORT_READY_DAY, this.pendingDate.daysInMonth()))

  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      //If they change the page without setting a start/endDate we use the default date
      let {startDate, endDate, defaultStartDate, defaultEndDate} = this.state;
      if (!endDate || !startDate) {
        startDate= defaultStartDate; 
        endDate= defaultEndDate;
      }
      this.setState({ reportType: this.props.reportType, reportData: [], startDate, endDate }, () => {
        this.getReportLayout();
      })
    }
    const {logger} = this.props;
    setTimeout(() => {
      logger?.connectListeners();
    }, 300)
  }

  componentDidMount() {
    this.loadFilter(this.getConfig);
    this.openOnboarding()
    this.props.setCurrentProduct();
  };

  async getConfig() {
    return await globalFunctions.genericFetch(process.env.SSC_API + "/config?facility_id=" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        // result = JSON.parse(result)
        let earliestStartDate = moment(result.startDate);
        let latestEndDate = moment(result.endDate).endOf('day');
        let startDate = latestEndDate.clone().subtract(3, 'month');
        if (startDate.isBefore(earliestStartDate)) {
          startDate = earliestStartDate.clone();
        }
        let endDate = latestEndDate.clone().subtract(12, 'hour');

        const hasItemChecked = result?.checklists?.some((checklist) => (
          checklist.phases.some((phase) => (
            phase.isActive && phase.questions.some((question) => (
              question.isActive
            ))
          ))
        ));

        const pendingWarning = `Data up until ${latestEndDate.clone().add(8, 'day').format('LL')} will be available on ${latestEndDate.clone().add(22, 'day').format('LL')}. Updates are made every Monday.`;
        const complianceGoal = result.complianceGoal;
        const engagementGoal = result.engagementGoal;
        const qualityGoal = result.qualityGoal;
        const specialties = result.filters.Specialties;
        const ors = result.filters.ORs;
        this.setState({
          earliestStartDate, latestEndDate, startDate, endDate, pendingWarning, complianceGoal, engagementGoal, qualityGoal,
          specialties, ors, hasItemChecked,
          defaultStartDate: startDate, defaultEndDate: endDate
        }, () => {
          if (this.state.reportType.toLowerCase() == "quality" && !hasItemChecked) {
            this.notLoading();
            return;
          }
          this.getReportLayout();

        });
        localStorage.setItem(this.ONBOARD_TYPE, 
          JSON.stringify({
            checklist:{
              startDate: this.state.earliestStartDate?.format('YYYY-MM-DD'),
              endDate: this.state.latestEndDate?.format('YYYY-MM-DD'),
            }
          }));
      });

  }

  openOnboarding() {
    //If they already did the onboard - Dont bother checking API
    if (localStorage.getItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`)) {
      return;
    }
    // globalFunctions.axiosFetch(process.env.ONBOARD_API, 'get', this.props.userToken, {})
    //   .then(result => {
    //     var data = result.data;

    //     if (data && data.onboardCompleted && data.onboardCompleted.includes && data.onboardCompleted.includes(this.ONBOARD_TYPE)) {
    //       localStorage.setItem(`${this.props.userEmail}-${this.ONBOARD_TYPE}`, true);
    //       return;
    //     }
    //     this.openOnboardModal();
    //     this.updateOnboardStatus();
    //   }).catch((error) => {

    //   });
  }
  updateOnboardStatus() {
    let jsonBody = { onboardCompleted: [this.ONBOARD_TYPE] };
    globalFunctions.axiosFetch(process.env.USERDETAILSMODIFY_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        //Cache onboard report name so we know not to open it again automatically
        if (result) {
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
    const valFromCookie = JSON.parse(localStorage.getItem('userFilter'));
    this.state.source?.cancel('Cancel outdated report calls');
    if (!this.state.endDate || !this.state.startDate) {
      return;
    }
    this.setState({ tileRequest: [], reportData: [], isFilterApplied: true, isLoading: true, modalTile: null, source: axios.CancelToken.source(),
      startDate: moment(valFromCookie?.startDate), endDate: moment(valFromCookie?.endDate)}, 
      () => {
        const specialty = this.state.selectedSpecialty?.id;
        const jsonBody = {
          "dashboardName": this.state.reportType,
          "facilityId": this.props.userFacility,

          "startDate": this.state.startDate?.format('YYYY-MM-DD'),
          "endDate": this.state.endDate?.format('YYYY-MM-DD'),

          "roomId": this.state.selectedOperatingRoom?.id || null,
          "specialtyName": specialty == "" ? null : specialty,
        }
        globalFunctions.axiosFetch(process.env.SSC_API + "/tile", 'post', this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              // result = COMPLIANCE;
              // result = JSON.parse(result);
              if (result.tiles?.length > 0) {
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

  groupTiles(tileData) {
    //Group data by "Group"
    return [...tileData.reduce((hash, data) => {
      const current = hash.get(data.groupOrder) || { groupOrder: data.groupOrder, group: [] }
      current.group.push(data)
      if (`${data.tileType}`.toUpperCase() == 'METERINFOGRAPHIC') {
        this.setState({ [`${this.state.reportType.toLowerCase()}Score`]: data.total });
      }
      return hash.set(data.groupOrder, current);
    }, new Map).values()];
  }

  closeModal() {
    this.setState({ isOpen: false });
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

  updateState(key, value, shouldApply = false) {
    const {logger} = this.props;
    logger?.manualAddLog('onchange', `update-${key}`, value);
    this.setState({
      [key]: value,
      isFilterApplied: false
    }, () => {
      this.saveFilter();
      const apply = (key == "endDate" || key == "startDate") && this.state.endDate && this.state.startDate || shouldApply;
      if (apply) {
        this.getReportLayout();
      }
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
    let result = "";
    if (this.state.reportType.toLowerCase() == "quality" && !this.state.hasItemChecked && !this.state.isLoading) {
      let content = "The Quality Score analysis has been disabled. Please contact your administrator to enable them.";
      if (this.props.isAdmin) {
        content = (
          <div>
            The Quality Score analysis has been disabled. To enable this, go to <NavLink to={"/settings/1"} className='link settings normal-text'>
              <span className="settings-icon"><Icon color="#028CC8" style={{ marginRight: 4 }} path={mdiCogOutline} size={'24px'} /></span>Settings
            </NavLink> and ensure at least 1 item is checked for any phase.

          </div>
        )
      }
      result = <GenericInformationPage title="Analysis Unavailable" content={content} />

    } else {
      result = reportData?.map((tileGroup, index) => {
        return (
          // xs should be max tilesize of group
          <Grid item xs={xs[index]} key={index}>
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
      result = [!this.state.isLoading && <Grid item xs={12} key={'0-title'} className="ssc-title">{this.state.reportType}</Grid>, ...result]
    }
    return (
      <Grid container spacing={3} className={`ssc-main ${this.state.reportType}`}>

        {result}
      </Grid>
    );
  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
    switch (`${tile.tileType}`.toUpperCase()) {
      case 'INFOGRAPHICPARAGRAPH':
        return <InfographicParagraph {...tile} />
      case 'ITEMLISTS':
      case 'CHECKLISTDETAIL':
        return <ChecklistDetail {...tile} />
      case 'TIMESERIESCHART':
        return <TimeSeriesChart {...tile}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.earliestStartDate}
          showChange={true}
          nullMessage={"Unavailable - no data in last 30 days"}
        />
      case 'MULTITIMESERIESCHART':
        return <MultiTimeSeriesChart {...tile} startDate={this.state.startDate} endDate={this.state.endDate} minDate={this.state.earliestStartDate} showChange={true} />
      case 'DONUTBOX':
        return <MultiDonutChart {...tile} />
      case 'METERINFOGRAPHIC':
        const goal = this.state.reportType.toLowerCase() == "overview" ? this.state[`${tile.title.toLowerCase()}Goal`] : this.state[`${this.state.reportType.toLowerCase()}Goal`];
        return <ReportScore {...tile} goal={goal} />
      case 'SCATTERPLOT':
        return <ScatterPlot {...tile}
          goal={this.state[`${this.state.reportType.toLowerCase()}Goal`]}
          score={this.state[`${this.state.reportType.toLowerCase()}Score`]}
          highlight={this.state.selectedSpecialty?.display} />
      case 'ITEMLIST':
        return <ItemList {...tile} selectOption={(value) => this.updateState('selectedSpecialty', value, true)} />
      case 'COMPAREINFOGRAPHIC':
        return <CompareInfographic {...tile} />
      case 'DONUTHISTOGRAM':
        return <DonutHistogram {...tile} />
      case 'NODATA':
        return <NoData {...tile} />

    }
  }

  getTileSize(tileType) {
    if (this.state.reportType.toLowerCase() == "overview") {
      switch (`${tileType}`.toUpperCase()) {
        case 'COMPAREINFOGRAPHIC':
          return 4;
        case 'METERINFOGRAPHIC':
          return 'auto';
        default:
          return 12;
      }
    }
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
    const configCookieObj = {configCookieKey: this.ONBOARD_TYPE, userCustomConfigCookieKey: "userFilter"};
    return (
      <div className="ssc-page">
        <Grid container spacing={0} className="ssc-picker-container" >
          <Grid item xs={12} className="ssc-picker">
            <div style={{ maxWidth: 800, margin: 'auto', minHeight:50 }}/>
          </Grid>
          <Grid item xs={12}>
            {/* <Divider className="ssc-divider" /> */}
          </Grid>
          <Grid item xs={12} className="ssc-picker">
            <UniversalPicker
              specialties={this.state.specialties}
              ors={this.state.ors}
              userFacility={this.props.userFacility}
              userToken={this.props.userToken}
              defaultState={this.state}
              apply={() => this.getReportLayout()}
              disabled={Boolean(this.state.isFilterApplied || !this.state.startDate || !this.state.endDate)}
              updateState={(key, value) => this.updateState(key, value)}
               {...configCookieObj}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
          <div className="sscOnboard-link link" onClick={() => this.openOnboardModal()}>
            What's this dashboard about?
          </div>
          {this.props.isAdmin && <div className="ssc-settings">
            <NavLink to={"/settings/1"} className='link'>
              <span className="settings-icon"><Icon color="#028CC8" style={{ marginRight: 4 }} path={mdiCogOutline} size={'24px'} /></span>Settings
            </NavLink>
          </div>}
        </Grid>
        {isLoading ? <div style={{marginTop:-100}}><LoadingIndicator /></div> : <div className="overlay">
          {this.renderTiles()}

          <Modal
            open={this.state.isOpen}
            onClose={() => this.closeModal()}
          >
            <DialogContent className="ssc Modal" style={{ minHeight: 320, minWidth: 320 }}>
              {this.renderTile(this.state.modalTile)}
            </DialogContent>
          </Modal>
          <SSCOnboardModal
            open={this.state.isOnboardModalOpen}
            onClose={() => this.closeOnboardModal()}
            reportType={this.state.reportType}
          />
        </div>}
      </div>
    );
  }
}