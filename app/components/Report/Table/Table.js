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


export default class Table extends React.PureComponent {
  constructor(props) {
    super(props);
  };

  render() {
    const dataPoints = this.props.dataPointRows.map(value => {
      return value.columns.reduce((accumulator, currentValue) => {
        accumulator[currentValue.key] = currentValue.value;
        return accumulator;
      }, {});
    });
    // let allPageSizeOptions = [ 5, 10, 25 ,50, 75, 100 ];
    // let pageSizeOptions = [];
    // allPageSizeOptions.some(a => (pageSizeOptions.push(Math.min(a,this.props.dataPoints.length)), a > this.props.dataPoints.length));
    return (
      <LoadingOverlay
        active={!this.props.dataPointRows}
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
                  }
                },
                {
                  title: 'Avg. Case (mins)', field: 'avgCase', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  }
                },
                {
                  title: 'Avg. Room Clean-up (mins)', field: 'avgRoomCleanup', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  }
                },
                {
                  title: 'Total Cases', field: 'totalCases', cellStyle: {
                    textAlign: 'right',
                    borderLeft: '1px solid rgba(224, 224, 224, 1)',
                    padding: '12px 16px'
                  }
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
                }
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: this.props.description
                }
              }}
              data={dataPoints}
              icons={tableIcons}
            />
          </Grid>

        </Grid>
      </LoadingOverlay>
    );
  }
}