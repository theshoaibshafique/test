import React, { forwardRef } from 'react';
import { Grid } from '@material-ui/core';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

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
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import MaterialTable from 'material-table';
import globalFunctions from '../../../utils/global-functions';


export default class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: []
    };
  };

  componentDidMount(){
    this.calculateRows(this.props.dataPointRows);
  }
  componentDidUpdate(prev){
    if (prev.dataPointRows != this.props.dataPointRows){
      this.calculateRows(this.props.dataPointRows)
    }
  }

  calculateRows(rawDataPointRows){
    let dataPointRows = rawDataPointRows && rawDataPointRows.map(dataPointRow => {
      return dataPointRow.columns.map(column => {
        let { key, value } = column;
        switch (key) {
          case 'procedureName':
            column.value = globalFunctions.getName(this.props.procedures, column.value);
            break;
          case 'avgRoomSetup':
          case 'avgCase':
          case 'avgRoomCleanup':
            column.value = Math.round(parseInt(value) / 60);
          default:
            break;
        }
        return column;
      });
    });
    let dataPoints = dataPointRows && dataPointRows.map(value => {
      return value.reduce((accumulator, currentValue) => {
        accumulator[currentValue.key] = currentValue.value;
        return accumulator;
      }, {});
    });
    dataPoints.sort((a,b)=>('' + a.procedureName).localeCompare(b.procedureName))
    this.setState({dataPoints});
  }

  customSort(name,title){
    return (a,b) =>{ return a[name]-b[name] || this.procedureNameCompare(title,a,b)}
  }

  procedureNameCompare(title,a,b){
    var element = document.querySelectorAll('.MuiTableSortLabel-active .MuiTableSortLabel-iconDirectionAsc');
    var titleElement = document.querySelectorAll('.MuiTableSortLabel-active');
    let isSameTitle = titleElement.length && title == titleElement[0].textContent;
    //If element exists we're descending
    if (element.length && isSameTitle){
      return ('' + b.procedureName).localeCompare(a.procedureName);
    }
    return ('' + a.procedureName).localeCompare(b.procedureName);
  }


  render() {
    return (
      <LoadingOverlay
        active={!this.props.description}
        spinner
        className="overlays"
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'none',
            color: '#000'
          }),
          spinner: (base) => ({
            ...base,
            '& svg circle': {
              stroke: 'rgba(0, 0, 0, 0.5)'
            }
          })
        }}
      >
        <Grid container spacing={1} className={`table-main ${!this.props.dataPointRows ? 'empty' : ''}`}>
          <Grid item xs >
            <MaterialTable
              columns={[
                {
                  title: 'Procedure', field: 'procedureName', cellStyle: {
                    padding: '12px 16px'
                  }
                },
                {
                  title: 'Avg. Room Setup (mins)', field: 'avgRoomSetup', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  },
                  customSort: this.customSort('avgRoomSetup','Avg. Room Setup (mins)')
                },
                {
                  title: 'Avg. Case (mins)', field: 'avgCase', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  },
                  customSort: this.customSort('avgCase','Avg. Case (mins)')
                },
                {
                  title: 'Avg. Room Clean-up (mins)', field: 'avgRoomCleanup', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  },
                  customSort: this.customSort('avgRoomCleanup','Avg. Room Clean-up (mins)')
                },
                {
                  title: 'Total Cases', field: 'totalCases', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  },
                  customSort: this.customSort('totalCases','Total Cases')
                }
              ]}
              options={{
                pageSize: 10,
                search: false,
                paging: false,
                toolbar: false,
                headerStyle: {
                  padding: "16px 0 8px 16px",
                  opacity: .6,
                  fontFamily: "Noto Sans",
                  width: 'unset'
                },
                draggable:false
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: this.props.description
                }
              }}
              data={this.state.dataPoints}
              icons={tableIcons}
            />
          </Grid>

        </Grid>
      </LoadingOverlay>
    );
  }
}