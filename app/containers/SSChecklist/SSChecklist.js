import React from 'react';
import axios from 'axios';

import 'c3/c3.css';
import './style.scss';

import globalFuncs from '../../utils/global-functions';
import { Grid, Divider, CardContent, Card, Modal, DialogContent } from '@material-ui/core';
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

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {

      isOpen: false,
      reportType: this.props.reportType,
      isLoading: true,
      pendingTileCount: 0,
      tileRequest: [],
      reportData: [],
      chartColours: ['#004F6E', '#FF7D7D', '#FFDB8C', '#A7E5FD', '#97E7B3', '#CFB9E4'],

      month: moment().subtract(1, 'month').endOf('month'),
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: "",
      hasNoCases: false
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
    this.loadFilter();
    this.getReportLayout();
  };

  getReportLayout() {
    this.state.source && this.state.source.cancel('Cancel outdated report calls');
    this.setState({ tileRequest: [], isLoading: true, source: axios.CancelToken.source() },
      () => {
        let jsonBody = {
          "reportType": this.state.reportType,
          "TileRequest": [{
            "startDate": this.state.month.startOf('month').format(),
            "endDate": this.state.month.endOf('month').format(),
          }]
        };
        globalFunctions.axiosFetch(process.env.SSC_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
          .then(result => {
            result = result.data;
            if (result === 'error' || result === 'conflict') {
              this.notLoading();
            } else if (result) {
              if (result.tileRequest && result.tileRequest.length > 0) {
                let reportData = this.groupTiles(result.tileRequest.sort((a, b) => a.groupOrder - b.groupOrder || a.tileOrder - b.tileOrder));
                let tileRequest = result.tileRequest.filter((tile) => {
                  return moment(tile.startDate).isSame(this.state.month, 'month');
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
          });
      });
  };

  getTile(tileRequest, i, j) {
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
      "days": this.state.selectedWeekday && [moment().isoWeekday(this.state.selectedWeekday).day()] || [],
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": this.state.selectedProcedure && this.state.selectedProcedure.value
    }
    jsonBody.Monthly = !Boolean(jsonBody.roomName || jsonBody.days.length || jsonBody.specialtyName || jsonBody.procedureName);

    if (tileRequest.tileType == 'InfographicMessage') {
      //The report isnt "pending" - Its empty
      if (moment().isSameOrAfter(this.pendingDate.clone())) {
        this.setState({ tileRequest: [], loading: false, pendingTileCount: this.state.pendingTileCount - 1 });
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
          if (tileRequest.tileType == 'InfographicParagraph') {
            //In thee case that there is NO CASES and you're using filters - we show custom mesage
            this.setState({ hasNoCases: result.dataPoints && result.dataPoints.length > 0 && result.dataPoints[0].valueX <= 0 && !jsonBody.Monthly })
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

      "startDate": this.state.month.startOf('month').format(),
      "endDate": this.state.month.endOf('month').format(),
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "days": this.state.selectedWeekday && [moment().isoWeekday(this.state.selectedWeekday).day()] || [],
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": this.state.selectedProcedure && this.state.selectedProcedure.value
    }
    jsonBody.Monthly = !Boolean(jsonBody.roomName || jsonBody.days.length || jsonBody.specialtyName || jsonBody.procedureName);

    globalFuncs.axiosFetch(process.env.SSCTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
      .then(result => {
        result = result.data;
        if (result === 'error' || result === 'conflict') {
          this.notLoading();
        } else {
          result.tileType = tileRequest.tileType;
          if (moment(tileRequest.dataDate).isSame(this.state.month, 'month')) {
            this.setState({ isOpen: true, modalTile: result });
          }

        }
      }).catch((error) => {

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
      [key]: value
    }, () => {
      this.saveFilter();
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


  renderTiles() {
    //Tiles of the same type get a different colour
    let tileTypeCount = {};
    return this.state.reportData && this.state.reportData.map((tileGroup, index) => {
      //Tiles in the same group are displayed in 1 "Card"
      let tile = tileGroup.group[0];
      if (tileGroup.group.length > 1) {
        return (
          <Grid item xs={12} key={`-${index}`}>
            <Card className="ssc-card">
              <CardContent>
                <Grid container spacing={0} >
                  {tile.tileType == 'StackedBarChart' && <Grid className="chart-title" style={{ textAlign: 'center', marginBottom: 24 }} item xs={12}>{tile.title}</Grid>}
                  {
                    tileGroup.group.map((tile, i) => {
                      tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
                      tile.tileTypeCount = tileTypeCount[tile.tileType];
                      let xs = this.getTileSize(tile.tileType);
                      if (tile.tileType == 'StackedBarChart' && tile.body) {
                        return <div key={`${tile.tileType}${i}`}></div>
                      } else if (tile.tileType == 'Checklist' && tile.body) {
                        xs = 12;
                      }
                      return <Grid item xs={xs} key={`${tile.tileType}${i}`} className={tile.tileType}>{this.renderTile(tile)}</Grid>
                    })
                  }
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )
      }
      tileTypeCount[tile.tileType] = tileTypeCount[tile.tileType] ? tileTypeCount[tile.tileType] + 1 : 1;
      tile.tileTypeCount = tileTypeCount[tile.tileType];
      return (
        <Grid item xs={this.getTileSize(tile.tileType)} key={index}>
          <Card className={`ssc-card ${tile.tileType}`}>
            <CardContent>{this.renderTile(tile)}</CardContent>
          </Card>
        </Grid>
      )
    })
  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
    switch (`${tile.tileType}`.toUpperCase()) {
      case 'LIST':
        return <HorizontalBarChart {...tile} specialties={this.props.specialties} />
      case 'INFOGRAPHICTEXT':
        return <ReportScore
          pushUrl={this.props.pushUrl}
          title={tile.title}
          redirectDisplay={this.props.reportType == "SurgicalSafetyChecklistReport" && tile.subTitle}
          redirectLink={this.props.reportType == "SurgicalSafetyChecklistReport" && tile.footer}
          score={tile.dataPoints && tile.dataPoints.length && tile.dataPoints[0].valueX}
          message={tile.dataPoints && tile.dataPoints.length && tile.dataPoints[0].title}
          subTitle={tile.dataPoints && tile.dataPoints.length && tile.dataPoints[0].subTitle}
          tooltipText={tile.description} />
      case 'BARCHARTDETAILED':
        return <BarChartDetailed {...tile} pushUrl={this.props.pushUrl} />
      case 'INFOGRAPHICPARAGRAPH':
        return <InfographicParagraph {...tile} />
      case 'LINECHART':
      case 'AREACHART':
        return <AreaChart {...tile} />
      case 'BARCHART':
        let pattern = this.state.chartColours.slice(tile.tileTypeCount - 1 % this.state.chartColours.length);
        return <BarChart pattern={pattern} id={tile.tileTypeCount} reportType={this.props.reportType} {...tile} />
      case 'LISTDETAIL':
      case 'LISTDETAILED':
        return <ListDetailed {...tile} specialties={this.props.specialties} />
      case 'CHECKLIST':
        return <Checklist {...tile} openModal={(tileRequest) => this.openModal(tileRequest)} />
      case 'CHECKLISTDETAIL':
        return <ChecklistDetail {...tile} closeModal={() => this.closeModal()} />
      case 'STACKEDBARCHART':
        return <StackedBarChart {...tile} specialties={this.props.specialties} />
      case 'INFOGRAPHICMESSAGE':
        let pendingDate = this.pendingDate;
        if (moment().isSameOrAfter(this.state.month.clone(), 'month')) {
          pendingDate = pendingDate.clone().add(1, 'month');
        }
        return <div>{`We’re currently processing the data for this month’s report. Please come back on ${pendingDate.format('LL')} to view your report.`}</div>
    }
  }

  getTileSize(tileType) {
    switch (`${tileType}`.toUpperCase()) {
      case 'LIST':
      case 'LISTDETAIL':
      case 'LISTDETAILED':
      case 'INFOGRAPHICTEXT':
      case 'CHECKLIST':
        return 4;
      case 'BARCHART':
      case 'AREACHART':
      case 'LINECHART':
      case 'BARCHARTDETAILED':
      case 'STACKEDBARCHART':
        return 8;
      case 'INFOGRAPHICMESSAGE':
      case 'INFOGRAPHICPARAGRAPH':
        return 12;
    }
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
            <div style={{ maxWidth: 800, margin: 'auto' }}><MonthPicker month={this.state.month} maxDate={moment().endOf('month')} updateMonth={(month) => this.updateMonth(month)} /></div>
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
              updateState={(key, value) => this.updateState(key, value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider className="ssc-divider" />
          </Grid>
        </Grid>
        <LoadingOverlay
          active={this.state.loading || this.state.pendingTileCount > 0}
          spinner
          text='Loading your content...'
          className="overlay"
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
          <Grid container spacing={3} className="ssc-main">
            {
              this.state.hasNoCases ?
                <Grid item xs={12} className="ssc-message">
                  No data available this month
                  <Grid item xs={12} className="ssc-message-subtitle">
                    (Try a different filter criteria)
                  </Grid>
                </Grid>
                :
                (this.state.loading || !this.state.tileRequest.length || this.state.pendingTileCount > 0)
                  ?
                  <Grid item xs={12} className="ssc-message">
                    No data available this month
                    </Grid>
                  :
                  this.renderTiles()}
          </Grid>

          <Modal
            open={this.state.isOpen}
            onClose={() => this.closeModal()}
          >
            <DialogContent className="ssc Modal">
              {this.renderTile(this.state.modalTile)}
            </DialogContent>
          </Modal>
        </LoadingOverlay>
      </div>
    );
  }
}