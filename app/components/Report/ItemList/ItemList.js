import React, { forwardRef } from 'react';
import { Grid, Paper, Tooltip, withStyles } from '@material-ui/core';

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

import MaterialTable from 'material-table';
import { mdiTrendingDown, mdiTrendingUp } from '@mdi/js';
import Icon from '@mdi/react'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
export default class ItemList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: []
    };
  };

  componentDidMount() {
  }
  componentDidUpdate(prev) {

  }


  customSort(name, title) {
    return (a, b) => { return a[name] - b[name] || this.procedureNameCompare(title, a, b) }
  }

  procedureNameCompare(title, a, b) {
    var element = document.querySelectorAll('.MuiTableSortLabel-active .MuiTableSortLabel-iconDirectionAsc');
    var titleElement = document.querySelectorAll('.MuiTableSortLabel-active');
    let isSameTitle = titleElement.length && title == titleElement[0].textContent;
    //If element exists we're descending
    if (element.length && isSameTitle) {
      return ('' + b.procedureName).localeCompare(a.procedureName);
    }
    return ('' + a.procedureName).localeCompare(b.procedureName);
  }

  renderChangeValue(rowData) {
    let { valueY } = rowData;
    valueY = parseInt(valueY)
    let className = '';
    let tag = '';
    let tooltip = '';
    if (isNaN(valueY)) {
      valueY = `—`;
      tooltip = "No Change";
    } else if (valueY == 0) {
      valueY = `—`;
      className = "trending-up";
      tooltip = "Positive Trend (Percent change is not available if the previous score was 0)";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'24px'} />
    } else if (valueY < 0) {
      className = "trending-down";
      tooltip = "Negative Trend";
      tag = <Icon color="#FF0000" path={mdiTrendingDown} size={'24px'} />
    } else {
      tooltip = "Positive Trend";
      className = "trending-up";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'24px'} />
    }
    return (
      <LightTooltip interactive arrow
        title={tooltip}
        placement="top" fontSize="small"
      >
        <div className={`change-value ${className}`}>
          <span>{`${valueY}%`}</span>
          <span>{tag}</span>
        </div>
      </LightTooltip>

    )

  }
  render() {
    return (
      <div className="item-list">
        <div className="title">{this.props.title}</div>
        <MaterialTable
          columns={[
            {
              field: "valueX",
              title: "Specialty",
              render: rowData => <div className="specialty-col">{rowData.valueX}</div>
            },
            {
              field: "valueY",
              title: "% Change",
              defaultSort: 'asc',
              headerStyle: { textAlign: 'right' },
              customSort: (a, b) => (a.valueY == null ? -.1 : a.valueY) - (b.valueY == null ? -.1 : b.valueY),
              render: rowData => this.renderChangeValue(rowData)
            }
          ]}
          options={{
            search: false,
            paging: false,
            toolbar: false,
            sorting: true,
            maxBodyHeight: 375,
            headerStyle: {
              paddingLeft: "24px",
              fontFamily: "Noto Sans",
              fontSize: 14,
              lineHeight: "19px",
              width: 'unset',
              top: 0
            },
            draggable: false
          }}
          localization={{
            body: {
              emptyDataSourceMessage: this.props.description
            }
          }}
          data={this.props.dataPoints}
          icons={tableIcons}
          components={{
            Container: props => <Paper {...props} elevation={0} />
          }}
        />
      </div>
    );
  }
}