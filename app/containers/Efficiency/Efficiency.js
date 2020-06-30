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
      chartColours: ['#004F6E', '#FF7D7D', '#FFDB8C', '#CFB9E4', '#50CBFB', '#6EDE95', '#FFC74D', '#FF4D4D', '#A77ECD', '#A7E5FD', '#97E7B3'],

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

  };

  getFilterLayout(reportType) {
    switch (`${reportType}`.toUpperCase()) {
      case 'DAYSSTARTINGREPORT':
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
  };

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

  }

  renderTile(tile) {
    if (!tile) {
      return <div></div>;
    }
  }

  getTileSize(tileType) {

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
            WOOW
          </Grid>

        </LoadingOverlay>
      </div>
    );
  }
}