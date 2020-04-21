import React, { forwardRef } from 'react';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, PLASTIC_SURGERY, ORTHOPAEDICS, VASCULAR_SURGERY, ENT, COMPLICATIONS } from '../../constants';
import { Checkbox } from '@material-ui/core';
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

const tableIcons = {
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
};

export default class EMMPublish extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestID: '',
      isLoading: true,
      emmCases: [],
      operatingRoomList: [],
      filterPublished: false
    };
  }

  getName(searchList, key) {
    let index = searchList.findIndex(specialty => specialty.value == key);
    if (index >= 0) {
      return searchList[index].name;
    }
  }

  async componentDidMount() {
    this.getEMMCases();
  };

  getEMMCases() {
    globalFuncs.genericFetch(process.env.EMMCASESREQUEST_API + "/", 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({
            emmCases: []
          });
          this.notLoading();
        } else {
          let facilityNames = result.map((emmCase) => { return { 'facilityName': emmCase.facilityName } });
          globalFuncs.genericFetch(process.env.FACILITYLIST_API + "/", 'post', this.props.userToken, facilityNames)
            .then(facilityResult => {
              if (facilityResult === 'error' || facilityResult === 'conflict') {
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
                    return {
                      requestID: emmCase.name,
                      facilityName: facility.facilityTitle,
                      roomName: room.roomTitle,
                      procedures: emmCase.procedure.map((procedure) => { return this.getName(GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY).concat(PLASTIC_SURGERY).concat(ORTHOPAEDICS).concat(VASCULAR_SURGERY).concat(ENT), procedure) }).join(', '),
                      complications: emmCase.complications.map((complication) => { return this.getName(COMPLICATIONS, complication) }).join(', '),
                      enhancedMMPublished: emmCase.enhancedMMPublished,
                      enhancedMMReferenceName: emmCase.enhancedMMReferenceName,
                      report:!emmCase.enhancedMMReferenceName 
                        ?'Report not available'
                        : <Button disableElevation variant="contained" className="secondary" onClick={() => this.redirect(emmCase.enhancedMMReferenceName)} >Open Report</Button>
                    }
                  })
                }, this.notLoading())
              }
            });
        }
      });
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
    this.setState({ filterPublished: e.target.checked});
  }
  

  render() {
    let allPageSizeOptions = [5, 10, 25, 50, 75, 100];
    let pageSizeOptions = [];
    allPageSizeOptions.some(a => (pageSizeOptions.push(Math.min(a, this.state.emmCases.length)), a > this.state.emmCases.length));
    return (
      <LoadingOverlay
        active={this.state.isLoading}
        spinner
        text='Loading your content...'
        className="Overlay"
      >
        <section className="emm-publish-page">
          <div className="header page-title">
            <div><span className="pad">Enhanced M&M Cases</span> </div>
          </div>
          <div>
          <Checkbox
                disableRipple
                icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                checked={this.state.filterPublished} onChange={(e) => this.handleCheckFilterPublished(e)} />Show requests with unpublished reports only
          </div>
          
          <div>
            <MaterialTable
              title=""
              columns={[
                { title: 'Facility', field: 'facilityName' },
                { title: 'OR', field: 'roomName' ,width:20},
                { title: 'Procedure', field: 'procedures' },
                { title: 'Complication', field: 'complications' },
                { title: 'Published', field: 'enhancedMMPublished', lookup:{'true': 'Yes', 'false': 'No'},width:20 },
                { title: 'requestID', field: 'requestID', hidden: true, searchable: true },
                { title: 'Report', field: 'report', searchable: false ,width:150},
                { title: 'enhancedMMReferenceName', field: 'enhancedMMReferenceName', hidden: true},
              ]}
              options={{
                pageSize: 10,
                pageSizeOptions: pageSizeOptions,
                search: true,
                paging: true,
                searchFieldAlignment: 'left',
                searchFieldStyle: { marginLeft: -24 },
                actionsColumnIndex: -1
              }}

              data={this.state.filterPublished ? this.state.emmCases.filter((emmCase) => !emmCase.enhancedMMPublished) : this.state.emmCases}
              icons={tableIcons}
            />
          </div>

        </section>
      </LoadingOverlay>
    );
  }
}