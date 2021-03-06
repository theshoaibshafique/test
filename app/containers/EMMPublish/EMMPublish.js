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
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';
import { StyledCheckbox } from '../../components/SharedComponents/SharedComponents';

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
      filterPublished: false,
      specialties: this.props.specialties || [],
      isSafari: navigator.vendor.includes('Apple')
    };
  }

  componentDidMount() {
    this.getEMMCases();
    this.props.setCurrentProduct();
  };


  getEMMCases() {
    globalFuncs.genericFetch(process.env.EMMREQUEST_API + "/all", 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({
            emmCases: []
          }, () => {
            this.notLoading()
          });
          
        } else {
          if (result === 'error' || result === 'conflict' || !result || !result.length) {
            this.setState({
              emmCases: []
            });
            this.notLoading();
            return;
          }

          //TODO: Remove hardcoded list
          const facilityMap = {
            "0282953f-d4c9-47c0-904d-92849a394eea": "SST TEST FAC.",
            "14742823-40d4-458a-958f-241c8c03e373": "St. Joseph's Health Centre",
            "fe063af9-99ab-4a0a-bcdd-dc9e76ecf567": "St. Michael's Hospital",
            "ba16b544-e90a-46b4-8b4b-8e609f057bb3": "Academic Medical Centre",
            "042de0d0-c304-4d80-8a1b-666b3b44979b": "Humber River Hospital",
            "16dabcbc-08ac-4d4c-ab84-29fffe2dab90": "The Ottawa Hospital",
            "776cd3bb-d406-4dcf-a50e-8438d52b5c7f": "North York General Hospital",
            "a0b9a346-655a-482f-b976-e3b3c16bf81f": "Lenox Hill Hospital",
            "59b8e90c-ab02-4d27-af8c-5266ae577c23": "Long Island Jewish Medical Center",
            "0b16ee59-537b-4afb-a535-9eaa1f3fba6d": "Ghent University Hospital",
            "c055d109-b5b0-4d74-b7c0-00a11deeb4a7": "Juliane Marie Centre",
            "dde247f8-fe3f-45d8-b69a-1c5966ff52b0": "Duke University Hospital",
            "53a14f2f-3cfc-4902-a18c-0a9e4228062a": "Sunnybrook Bayview Campus",
            "77c6f277-d2e7-4d37-ac68-bd8c9fb21b92": "Clements University Hospital",
            "fdb6eb7d-59d2-40c4-a719-2bcbcc589980": "Stryker Endoscopy",
            "c9f753a0-46fd-472d-b96b-f3c839029697": "The Mount Sinai Hospital",
            "e47585ea-a19f-4800-ac53-90f1777a7c96": "Mayo Clinic Rochester",
          }
          const emmCases = result?.map((emmCase) => {
            let room = this.props.operatingRooms.find(room => room.id.toUpperCase() == emmCase.roomName) || { 'display': emmCase.roomName };
            let surgeryList = this.state.specialties?.map((specialty) => specialty.procedures).flatten() || [];
            const facilityName = facilityMap[emmCase.facilityName.toLowerCase()];
            const procedures = emmCase.procedure?.map((procedure) => { return globalFuncs.getName(surgeryList, procedure) }).join(', ');
            const complications = emmCase.complications?.map((complication) => { return globalFuncs.getName(this.props.complications || [], complication) }).join(', ')
            return {
              requestID: emmCase.name,
              facilityName: facilityName,
              roomName: room.display,
              procedures: procedures,
              complications: complications,
              enhancedMMPublished: emmCase.enhancedMMPublished,
              enhancedMMReferenceName: emmCase.enhancedMMReferenceName,
              report: !emmCase.enhancedMMReferenceName
                ? 'Report not available'
                : <Button disableElevation variant="contained" className="secondary" onClick={() => {this.props.showEMMReport(emmCase.enhancedMMReferenceName)}} >Open Report</Button>
            }
          })
          this.setState({
            emmCases: emmCases,
          }, () => {
            this.notLoading()
          })
        }
      });
  }
  componentDidUpdate() {
    
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
    this.props.pushUrl('/emmreport/' + enhancedMMReferenceName);
  }
  handleCheckFilterPublished(e) {
    const { logger } = this.props;
    logger?.manualAddLog('click', `show-only-unpublished`, { checked: e.target.checked });
    this.setState({ filterPublished: e.target.checked });
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
            <StyledCheckbox
              checked={this.state.filterPublished} onChange={(e) => {this.handleCheckFilterPublished(e)}} />Show requests with unpublished reports only
          </div>

          <div>
            {
              (!this.state.isLoading) &&
              <MaterialTable
                title=""
                columns={[
                  { title: 'Facility', field: 'facilityName', defaultSort: 'desc' },
                  { title: 'OR', field: 'roomName' },
                  { title: 'Procedure', field: 'procedures' },
                  { title: 'Complication', field: 'complications' },
                  { title: 'Published', field: 'enhancedMMPublished', lookup: { 'true': 'Yes', 'false': 'No' }, width: 20 },
                  { title: 'requestID', field: 'requestID', hidden: true, searchable: true },
                  { title: 'Report', field: 'report', searchable: false, width: 150 },
                  { title: 'enhancedMMReferenceName', field: 'enhancedMMReferenceName', hidden: true },
                ]}
                options={{
                  pageSize: (emmCases.length < 10 ) ?  emmCases.length : 10,
                  pageSizeOptions: pageSizeOptions,
                  search: true,
                  paging: true,
                  searchFieldAlignment: 'left',
                  searchFieldStyle: { marginLeft: -24 },
                  actionsColumnIndex: -1,
                  thirdSortClick: false,
                  draggable: false,
                  rowStyle: {
                    fontFamily: "Noto Sans",
                    fontSize: 14
                  }
                }}

                data={this.state.filterPublished ? this.state.emmCases.filter((emmCase) => !emmCase.enhancedMMPublished) : this.state.emmCases}
                icons={tableIcons}
              />
            }
          </div>

        </section>
      </LoadingOverlay>
    );
  }

}