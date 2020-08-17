import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card, Modal, DialogContent, IconButton, Button } from '@material-ui/core';
import MonthRangePicker from '../../components/MonthRangePicker/MonthRangePicker';

import moment from 'moment/moment';
import UniversalPicker from '../../components/UniversalPicker/UniversalPicker';
import LoadingOverlay from 'react-loading-overlay';
import globalFunctions from '../../utils/global-functions';
import DisplayNumber from '../../components/Report/InfographicText/DisplayNumber';
import BarChart from '../../components/Report/BarChart/BarChart';
import StackedBarChart from '../../components/Report/StackedBarChart';
import DetailedMultiLineChart from '../../components/Report/DetailedMultiLineChart/DetailedMultiLineChart';
import Table from '../../components/Report/Table';
import DonutChart from '../../components/Report/DonutChart/DonutChart';
import InfographicParagraph from '../../components/Report/InfographicParagraph/InfographicParagraph';
import CloseIcon from '@material-ui/icons/Close';

export default class Efficiency extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ONBOARD_TYPE = "Efficiency";
    this.state = {
      reportType: this.props.reportType,
      isLandingPage: this.props.reportType == "EfficiencyReport",
      isOnboardModalOpen: false,
      operatingRoomList: this.props.operatingRooms && this.props.operatingRooms.map && this.props.operatingRooms.map((or) => {
        return { value: or.roomName, name: or.roomTitle };
      }) || [],
      isLoading: true,
      pendingTileCount: 0,
      tileRequest: [],
      reportData: [],
      chartColours: ['#CFB9E4', '#FF7D7D', '#FFDB8C', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD', '#A7E5FD', '#97E7B3', '#004F6E'],

      selectedOperatingRoom: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: "",
      hasNoCases: false,
      isFilterApplied: true // Filter is applied right away by default
    }
    this.pendingDate = moment();
    this.pendingDate.date(Math.min(process.env.SSC_REPORT_READY_DAY, this.pendingDate.daysInMonth()))
    //If we're after this months pending date - we move on to the next
    if (moment().isSameOrAfter(this.pendingDate.clone())) {
      this.pendingDate = this.pendingDate.clone().add(1, 'month');
    }
    this.state.pendingWarning = `Data for ${this.pendingDate.clone().subtract(1, 'month').format('MMMM')} will be ready on ${this.pendingDate.format('LL')}`;

    //Last available data date is 2 months before the pending date
    this.state.startDate = this.pendingDate.clone().subtract(2, 'month').startOf('month');
    this.state.endDate = this.pendingDate.clone().subtract(2, 'month').endOf('month');
    this.state.maxDate = this.state.endDate.clone();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      let selectedSpecialty = this.state.selectedSpecialty
      if (selectedSpecialty && !selectedSpecialty.value) {
        selectedSpecialty = "";
      }
      this.setState({
        reportType: this.props.reportType,
        reportData: [],
        selectedSpecialty,
        isLandingPage: this.props.reportType == "EfficiencyReport"
      }, () => {
        this.getReportLayout();
      })
    }
  }

  componentDidMount() {
    this.loadFilter(this.getReportLayout);
    this.getEarliestStartDate();
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

  async getEarliestStartDate() {
    return await globalFunctions.genericFetch(process.env.EFFICIENCY_API + "/startDate", 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          return;
        }
        this.setState({ earliestStartDate: moment(result) });
      });

  }

  getFilterLayout(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'DAYSSTARTINGONTIMEREPORT':
        return { showOR: true, showSpecialty: true }
      case 'TURNOVERTIMEREPORT':
      case 'ORUTILIZATIONREPORT':
        return { showOR: true }
      case 'CASEANALYSISREPORT':
        return { showSpecialty: true, showProcedure: true, showOR2: true, isSpecialtyMandatory: true }
      default:
        return {};
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
    let selectedSpecialty = this.state.selectedSpecialty && this.state.selectedSpecialty.value;
    if (this.state.reportType == "CaseAnalysisReport" && !selectedSpecialty) {
      this.setState({ isSelectionRequired: true, isLoading: false });
      return;
    }
    this.setState({ tileRequest: [], isSelectionRequired: false, isFilterApplied: true, isLoading: true, source: axios.CancelToken.source() },
      () => {
        let jsonBody = {
          "reportType": this.state.reportType,
          "TileRequest": [{
            "startDate": globalFuncs.formatDateTime(this.state.startDate.startOf('day')),
            "endDate": globalFuncs.formatDateTime(this.state.endDate.endOf('day')),
          }]
        };
        globalFunctions.axiosFetch(process.env.EFFICIENCY_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            result = result.data;
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              if (result.tileRequest && result.tileRequest.length > 0) {
                let reportData = this.groupTiles(result.tileRequest.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));
                let tileRequest = result.tileRequest.filter((tile) => {
                  return moment(tile.startDate).isSame(this.state.startDate, 'month');
                });
                this.setState({ pendingTileCount: this.state.pendingTileCount + result.tileRequest.length, reportData, tileRequest },
                  () => {
                    this.state.reportData.map((tileGroup, i) => {
                      tileGroup.group.map((tile, j) => {
                        this.getTile(tile, i, j);
                      });
                    })

                  });
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
  getTile(tileRequest, i, j) {
    let filter = this.getFilterLayout(this.state.reportType);
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": globalFuncs.formatDateTime(this.state.startDate.startOf('day')),
      "endDate": globalFuncs.formatDateTime(this.state.endDate.endOf('day')),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": (filter.showOR || filter.showOR2) && this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "specialtyName": filter.showSpecialty && this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": filter.showProcedure && this.state.selectedProcedure && this.state.selectedProcedure.value
    }

    globalFuncs.axiosFetch(process.env.EFFICIENCYTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
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
          if (moment(tileRequest.startDate).isSame(this.state.startDate, 'month')) {
            reportData[i].group[j] = result;
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
      this.setState({isLoading:true},callback);
    }
  }

  saveFilter() {
    localStorage.setItem('efficiencyFilter-' + this.props.userEmail,
      JSON.stringify({
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        selectedOperatingRoom: this.state.selectedOperatingRoom,
        selectedSpecialty: this.state.selectedSpecialty,
        selectedProcedure: this.state.selectedProcedure
      }));
  }


  renderTiles() {
    //Tiles of the same type get a different colour
    let tileTypeCount = {};
    return this.state.reportData && this.state.reportData.map((tileGroup, index) => {

      return (
        tileGroup.group.map((tile, i) => {
          tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
          tile.tileTypeCount = tileTypeCount[tile.tileType];
          return <Grid item xs={this.getTileSize(tile.tileType)} key={`${index}-${i}`}>
            <Card className={`efficiency-card ${tile.tileType}`}>
              <CardContent>{this.renderTile(tile)}</CardContent>
            </Card>
          </Grid>
        })
      )
    })
  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
    switch (`${tile.tileType}`.toUpperCase()) {
      case 'DETAILEDMULTILINECHART':
        return <DetailedMultiLineChart
          {...tile}
          labelList={this.state.operatingRoomList} />
      case 'INFOGRAPHICPARAGRAPH':
        return <InfographicParagraph {...tile} />
      case 'INFOGRAPHICTEXT':
        return <DisplayNumber
          title={tile.title}
          footer={tile.footer}
          tooltipText={tile.toolTip}
          unit={tile.unit}
          number={tile.total}
          message={tile.description}
        />
      case 'TABLE':
        return <Table procedures={this.state.selectedSpecialty && this.state.selectedSpecialty.procedures}dataPointRows={tile.dataPointRows} description={tile.description} />
      case 'BARCHART':
        let pattern = this.state.chartColours.slice(tile.tileTypeCount - 1 % this.state.chartColours.length);
        return <BarChart
          pattern={pattern}
          id={tile.tileTypeCount}
          reportType={this.props.reportType}
          noWrapXTick={this.state.isLandingPage}
          {...tile}
          body={tile.description}
          labelList={this.state.operatingRoomList} />
      case 'DONUTCHART':
        return <DonutChart {...tile} specialties={this.props.specialties} orderBy={{ "Setup": 1, "Clean-up": 2, "Idle": 3 }} />
      case 'STACKEDBARCHART':
        return <StackedBarChart {...tile}
          specialties={this.props.specialties}
          horizontalLegend={true}
          orderBy={{ "Setup": 1, "Clean-up": 2, "Idle": 3 }} />
    }
  }

  getTileSize(tileType) {
    switch (`${tileType}`.toUpperCase()) {
      case 'DETAILEDMULTILINECHART':
      case 'DONUTCHART':
      case 'STACKEDBARCHART':
      case 'BARCHART':
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
    let isLoading = this.state.isLoading || this.state.pendingTileCount > 0;

    return (
      <div className="efficiency-page">
        <Grid container spacing={0} className="efficiency-picker-container" >
          <Grid item xs={12} className="efficiency-range-picker">
            <div style={{ maxWidth: 800, margin: 'auto' }}>
              <MonthRangePicker
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                minDate={this.state.earliestStartDate}
                maxDate={this.state.maxDate}
                updateState={(key, value) => this.updateState(key, value)}
                displayWarning={this.state.pendingWarning}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className="efficiency-divider" />
          </Grid>
          {!this.state.isLandingPage && <Grid item xs={12} className="efficiency-picker">
            <UniversalPicker
              specialties={this.props.specialties}
              userFacility={this.props.userFacility}
              userToken={this.props.userToken}
              defaultState={this.state}
              apply={() => this.getReportLayout()}
              disabled={this.state.isFilterApplied}
              updateState={(key, value) => this.updateState(key, value)}
              {...this.getFilterLayout(this.state.reportType)}
            />
          </Grid>}
          {!this.state.isLandingPage && <Grid item xs={12}>
            <Divider className="efficiency-divider" />
          </Grid>}
          <div className="efficiencyOnboard-link link" onClick={() => this.openOnboardModal()}>
            What's this report about?
          </div>
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
              marginTop: 150
            }),
            spinner: (base) => ({
              ...base,
              '& svg circle': {
                stroke: 'rgba(0, 0, 0, 0.5)'
              }
            })
          }}
        >
          <Grid container spacing={3} className={`efficiency-main ${this.state.reportType}`}>
            {
              this.state.isSelectionRequired //|| !selectedSpecialty
                ? <Grid item xs={12} className="efficiency-select-filter">Select a Specialty using the filters above to see Case Analysis data!</Grid>
                : this.state.hasNoCases ?
                  <Grid item xs={12} className="efficiency-message">
                    No data available this month
                  <Grid item xs={12} className="efficiency-message-subtitle">
                      (Try a different filter criteria)
                  </Grid>
                  </Grid>
                  :
                  (isLoading || !this.state.tileRequest.length)
                    ?
                    !isLoading && <Grid item xs={12} className="efficiency-message">
                      No data available this month
                    </Grid>
                    :
                    this.renderTiles()}
          </Grid>

          <Modal
            open={this.state.isOnboardModalOpen}
            onClose={() => this.closeOnboardModal()}
          >
            <DialogContent className="efficiencyOnBoarding Modal">
              <Grid container spacing={0} justify='center' className="onboard-modal" >
                <Grid item xs={10} className="efficiencyOnBoard-title">
                  What is the Efficiency Report?
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right', padding: '40px 24px 0 40px' }}>
                  <IconButton disableRipple disableFocusRipple onClick={() => this.closeOnboardModal()} className='close-button'><CloseIcon fontSize='small' /></IconButton>
                </Grid>
                <Grid item xs={7} className="efficiencyOnBoard-column">
                  <Grid container spacing={0} direction="column">
                    <Grid item xs className="efficiencyOnBoard-paragraph">
                      This report offers insights into the function of the operating room during elective hours according to four main categories
                    </Grid>
                    <Grid item xs className="efficiencyOnBoard-paragraph">
                      <Grid container spacing={0}>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>Days Started On Time</div>
                        </Grid>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>Turnover Time</div>
                        </Grid>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>OR Utilization</div>
                        </Grid>
                        <Grid item xs className="efficiency-OnBoard-box">
                          <div>Case Analysis</div>
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
      </div>
    );
  }
}