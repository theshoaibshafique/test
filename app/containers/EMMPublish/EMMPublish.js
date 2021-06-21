                                       import React, { forwardRef } from 'react';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { Checkbox, Button } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import MaterialTable from 'material-table';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';



export default class EMMPublish extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestID: '',
      isLoading: true,
      emmCases: [],
      operatingRoomList: [],
      filterPublished: false,
      specialties: this.props.specialties || [],
      isSafari: navigator.vendor.includes('Apple')
    };
  }

  componentDidMount() {
    this.getSpecialty();
  };

  

  getSpecialty() {
    globalFuncs.genericFetch(process.env.SPECIALTY_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result && result != 'error') {
          this.setState({specialties:result}, () => this.getEMMCases());
        } else {
          this.getEMMCases();
          // error
        }
      }).catch(error => {
        this.getEMMCases();
      });
  };

  getEMMCases() {
    globalFuncs.genericFetch(process.env.EMMREQUEST_API + "/all", 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({
            emmCases: []
          });
          this.notLoading();
        } else {
          if (result === 'error' || result === 'conflict' || !result || !result.length){
            this.setState({
              emmCases: []
            });
            this.notLoading();
            return;
          }
          let uniqueSet = new Set();
          let facilityNames = [];
          result.forEach((emmCase) => {
            uniqueSet.add(emmCase.facilityName)
          });
          uniqueSet.forEach((value) => {
            facilityNames.push({ 'facilityName': value })
          })

          globalFuncs.genericFetch(process.env.FACILITYLIST_API + "/", 'post', this.props.userToken, facilityNames)
            .then(facilityResult => {
              if (facilityResult === 'error' || facilityResult === 'conflict' || !facilityResult) {
                this.setState({
                  emmCases: []
                });
                this.notLoading()
              } else {
                this.setState({
                  emmCases: result.map((emmCase) => {
                    let facility = facilityResult.find(facility => facility.facilityName == emmCase.facilityName) || {'departments':[]};
                    let department = facility.departments.find(department => department.departmentName == emmCase.departmentName) || {'rooms':[]};
                    let room = department.rooms.find(room => room.roomName == emmCase.roomName) || {'roomTitle':''};
                    let surgeryList = this.state.specialties.map((specialty) => specialty.procedures).flatten() || [];
                    return {
                      requestID: emmCase.name,
                      facilityName: facility.facilityTitle,
                      roomName: room.roomTitle,
                      procedures: emmCase.procedure.map((procedure) => { return globalFuncs.getName(surgeryList, procedure) }).join(', '),
                      complications: emmCase.complications.map((complication) => { return globalFuncs.getName(this.props.complications || [], complication) }).join(', '),
                      enhancedMMPublished: emmCase.enhancedMMPublished,
                      enhancedMMReferenceName: emmCase.enhancedMMReferenceName,
                      report:!emmCase.enhancedMMReferenceName
                        ?'Report not available'
                        : <Button disableElevation variant="contained" className="secondary" onClick={() => this.props.showEMMReport(emmCase.enhancedMMReferenceName)} >Open Report</Button>
                    }
                  }),
                }, this.notLoading())
              }
            });
        }
      });
  }
  componentDidUpdate(){
    // FOR THE LOGS
    const search = document.getElementsByClassName('MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd');
    if (search.length){
      search[0].classList.add("log-input");
    }
    const {logger} = this.props;
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
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

  redirect(enhancedMMReferenceName) {
    this.props.pushUrl('/emmreport/' +enhancedMMReferenceName);
  }
  handleCheckFilterPublished(e){
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `show-only-unpublished`, {checked: e.target.checked});
    this.setState({ filterPublished: e.target.checked});
  }

  render() {
    const { emmCases, isSafari, isLoading } = this.state;
    let allPageSizeOptions = [5, 10, 25, 50, 75, 100];
    let pageSizeOptions = allPageSizeOptions.filter((option) => {
      return (option < emmCases.length)
    });

    pageSizeOptions.push(emmCases.length)

    if (emmCases.length < 10) {
      pageSizeOptions = []
    }

    return (
      <LoadingOverlay
        active={isLoading}
        spinner
        text='Loading your content...'
        className="Overlay"
      >
        <section className="emm-publish-page">
          <div className="header page-title">
            <div><span className="pad">Enhanced M&M Cases</span></div>
          </div>
          <div>
          {(isSafari) && <SafariWarningBanner />}
          <Checkbox
                disableRipple
                icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                checked={this.state.filterPublished} onChange={(e) => this.handleCheckFilterPublished(e)} />Show requests with unpublished reports only
          </div>

          <div>
            {
              (!this.state.isLoading) &&
                <MaterialTable
                  title=""
                  columns={[
                    { title: this.generateTitle('Facility'), field: 'facilityName' ,defaultSort: 'desc'},
                    { title: this.generateTitle('OR'), field: 'roomName' ,width:20},
                    { title: this.generateTitle('Procedure'), field: 'procedures' },
                    { title: this.generateTitle('Complication'), field: 'complications' },
                    { title: this.generateTitle('Published'), field: 'enhancedMMPublished', lookup:{'true': 'Yes', 'false': 'No'},width:20 },
                    { title: 'requestID', field: 'requestID', hidden: true, searchable: true },
                    { title: this.generateTitle('Report'), field: 'report', searchable: false ,width:150},
                    { title: 'enhancedMMReferenceName', field: 'enhancedMMReferenceName', hidden: true},
                  ]}
                  options={{
                    pageSize: (emmCases.length < 10) ? 10 : emmCases.length,
                    pageSizeOptions: pageSizeOptions,
                    search: true,
                    paging: true,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: { marginLeft: -24 },
                    actionsColumnIndex: -1,
                    thirdSortClick: false,
                    draggable: false
                  }}

                  data={this.state.filterPublished ? this.state.emmCases.filter((emmCase) => !emmCase.enhancedMMPublished) : this.state.emmCases}
                  icons={this.getTableIcons()}
                />
            }
          </div>

        </section>
      </LoadingOverlay>
    );
  }

  //LOG HELPERS

  getTableIcons(){
    const tableIcons = {
      Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
      FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} onClick={() => this.logClick('first-page')} />),
      LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} onClick={() => this.logClick('last-page')}/>),
      NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} onClick={() => this.logClick('next-page')}/>),
      PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} onClick={() => this.logClick('previous-page')}/>),
      ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} onClick={() => this.logClick('clear-search')}/>),
      Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
      SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
    };
    return tableIcons
  }
  logClick(key){
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `${key}`);
  }

  sortClick(key){
    //if element exists we're descending
    var element = document.querySelectorAll('.MuiTableSortLabel-active .MuiTableSortLabel-iconDirectionAsc');
    var titleElement = document.querySelectorAll('.MuiTableSortLabel-active');
    //Check if its the same title
    let isSameTitle = titleElement.length && key == titleElement[0].textContent;
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `sort-user-list-${key}`, !titleElement.length ? 'none' : (element.length && isSameTitle ? 'desc' : 'asc'));
    
  }
  generateTitle(title){
    // Generate a title element for the logs
    return (
      <div onClick={() => this.sortClick(title)}>{title}</div>
    )
  }
}