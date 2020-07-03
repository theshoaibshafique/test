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

export default class Efficiency extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ONBOARD_TYPE = "Efficiency";

    this.state = {
      reportType: this.props.reportType,
      isLandingPage: this.props.reportType == "EfficiencyReport",
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

    this.temp = this.getTemp();
  }

  getTemp() {
    switch (`${this.state.reportType}`.toUpperCase()) {
      case 'DAYSSTARTINGONTIMEREPORT':
        return [{
          "name": null,
          "reportName": null,
          "title": "Days Starting on Time",
          "subTitle": "(20 out of 22 days)",
          "toolTip": "Proportion of days where the first case of the day started at or before the defined elective start time for that institution.",
          "body": null,
          "footer": null,
          "description": null,
          "total": null,
          "xAxis": null,
          "yAxis": null,
          "urlText": null,
          "url": null,
          "unit": "%",
          "dataPoints": [
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 40,
              "valueY": null,
              "valueZ": null,
              "note": null
            }
          ],
          "active": true,
          "dataDate": "0001-01-01T00:00:00",
          "monthly": false,
          "hospitalName": null,
          "facilityName": null,
          "departmentName": null,
          "roomName": null,
          "procedureName": null,
          "specialtyName": null
        }, {
          "name": null,
          "reportName": null,
          "title": "Days Starting on Time Trend",
          "subTitle": null,
          "toolTip": null,
          "body": null,
          "footer": null,
          "description": null,
          "total": null,
          "xAxis": "Month",
          "yAxis": "Percentage (%)",
          "urlText": null,
          "url": null,
          "unit": "%",
          "dataPoints": [
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 8,
              "valueY": 29,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 9,
              "valueY": 37,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 10,
              "valueY": 41,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 11,
              "valueY": 68,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": 12,
              "valueY": 70,
              "valueZ": null,
              "note": null
            }
          ],
          "active": true,
          "dataDate": "0001-01-01T00:00:00",
          "monthly": false,
          "hospitalName": null,
          "facilityName": null,
          "departmentName": null,
          "roomName": null,
          "procedureName": null,
          "specialtyName": null
        }, {
          "name": null,
          "reportName": null,
          "title": "Days Starting on Time Trend",
          "subTitle": null,
          "toolTip": " Late",
          "body": null,
          "footer": null,
          "description": null,
          "total": null,
          "xAxis": "Delay from start (mins)",
          "yAxis": "Percentage (%)",
          "urlText": null,
          "url": null,
          "unit": "%",
          "dataPoints": [
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": "0-5",
              "valueY": 55,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": "5-20",
              "valueY": 12,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": "20-40",
              "valueY": 22,
              "valueZ": null,
              "note": null
            },
            {
              "title": null,
              "subTitle": null,
              "description": null,
              "valueX": "40+",
              "valueY": 88,
              "valueZ": null,
              "note": null
            }
          ],
          "active": true,
          "dataDate": "0001-01-01T00:00:00",
          "monthly": false,
          "hospitalName": null,
          "facilityName": null,
          "departmentName": null,
          "roomName": null,
          "procedureName": null,
          "specialtyName": null
        }]
      case 'TURNOVERTIMEREPORT':
        return []
      case 'ORUTILIZATIONREPORT':
        return []
      case 'CASEANALYSISREPORT':
        return []
      default:
        return [];
    }

  }


  componentDidUpdate(prevProps) {
    if (prevProps.reportType != this.props.reportType) {
      this.setState({
        reportType: this.props.reportType,
        reportData: [],
        isLandingPage: this.props.reportType == "EfficiencyReport"
      }, () => {
        this.getReportLayout();
      })
    }
  }

  componentDidMount() {
    this.loadFilter();
    this.getReportLayout();
  };

  getFilterLayout(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'DAYSSTARTINGONTIMEREPORT':
        return { showOR: true, showSpecialty: true }
      case 'TURNOVERTIMEREPORT':
        return { showOR: true }
      case 'ORUTILIZATIONREPORT':
        return { showOR: true, showSpecialty: true }
      case 'CASEANALYSISREPORT':
        return { showSpecialty: true, showProcedure: true, showOR2: true }
      default:
        return {};
    }
  }


  getReportLayout() {
    this.state.source && this.state.source.cancel('Cancel outdated report calls');
    this.setState({ tileRequest: [], isFilterApplied: true, isLoading: true, source: axios.CancelToken.source() },
      () => {
        let jsonBody = {
          "reportType": this.state.reportType,
          "TileRequest": [{
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
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
                    //TODO: remove 'index' for hardcoded list
                    let index = 0
                    this.state.reportData.map((tileGroup, i) => {
                      tileGroup.group.map((tile, j) => {
                        index += 1;
                        this.getTile(tile, i, j, index);
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
  getTile(tileRequest, i, j, index) {
    let jsonBody = {
      "facilityName": tileRequest.facilityName,
      "reportName": tileRequest.reportName,
      "hospitalName": tileRequest.hospitalName,
      "departmentName": tileRequest.departmentName,

      "startDate": this.state.startDate,
      "endDate": this.state.endDate,
      "tileType": tileRequest.tileType,
      "dashboardName": tileRequest.dashboardName,

      "roomName": this.state.selectedOperatingRoom && this.state.selectedOperatingRoom.value,
      "specialtyName": this.state.selectedSpecialty && this.state.selectedSpecialty.value,
      "procedureName": this.state.selectedProcedure && this.state.selectedProcedure.value
    }

    globalFuncs.axiosFetch(process.env.EFFICIENCYTILE_API, 'post', this.props.userToken, jsonBody, this.state.source.token)
      .then(result => {
        result = result.data;
        if (result === 'error' || result === 'conflict') {
          this.notLoading();
        } else {
          //TODO: remove hardcoded values
          result = this.temp[index - 1];
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
    });
  }

  loadFilter() {
    if (localStorage.getItem('efficiencyFilter-' + this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('efficiencyFilter-' + this.props.userEmail));
      this.setState({
        ...recentSearchCache,
        startDate: moment(recentSearchCache.startDate),
        endDate: moment(recentSearchCache.endDate)
      });
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
      case 'LIST':
        return <HorizontalBarChart {...tile} specialties={this.props.specialties} />
      case 'INFOGRAPHICTEXT':
        return <DisplayNumber
          title={tile.title}
          subTitle={tile.subTitle}
          tooltipText={tile.toolTip}
          unit={tile.unit}
          number={tile.dataPoints && tile.dataPoints.length && tile.dataPoints[0].valueX}
        />
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
    }
  }

  getTileSize(tileType) {
    switch (`${tileType}`.toUpperCase()) {
      case 'BARCHART':
        return 6;
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
          <Grid container spacing={3} className="efficiency-main">
            {
              this.state.hasNoCases ?
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

        </LoadingOverlay>
      </div>
    );
  }
}