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
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@mdi/react'
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class ItemList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: [],
    };
  };

  componentDidMount() {
  }
  componentDidUpdate(prev) {

  }

  renderChangeValue(rowData) {
    let { valueY , valueX } = rowData;
    valueY = parseInt(valueY)
    let className = '';
    let tag = '';
    let tooltip = '';
    if (isNaN(valueY)) {
      valueY = `—`;
      className = "trending-up";
      tooltip = "Positive Trend (Percent change is not available if the previous score was 0)";
      tag = <Icon color="#009483" path={mdiTrendingUp} size={'24px'} />
    } else if (valueY == 0) {
      valueY = `—`;
      tooltip = "No Change";
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
        placement="right" fontSize="small"
      >
        <div className={`change-value normal-text ${className} log-mouseover`}  id={`trending-tooltip-${valueX}`} description={JSON.stringify({toolTip:tooltip, trend:valueY})}>
          <span>{`${valueY}%`}</span>
          <span>{tag}</span>
        </div>
      </LightTooltip>

    )

  }
  sortClick(key){
    //if element exists we're descending
    var element = document.querySelectorAll('.MuiTableSortLabel-active .MuiTableSortLabel-iconDirectionAsc');
    var titleElement = document.querySelectorAll('.MuiTableSortLabel-active');
    //Check if its the same title
    let isSameTitle = titleElement.length && key == titleElement[0].textContent;
    const {logger} = this.props;
    logger && logger.manualAddLog('click', `sort-item-list-${key}`, element.length && isSameTitle ? 'desc' : 'asc');
  }
  
  render() {
    return (
      <div className="item-list">
        <div className="title">{this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line,index) => { return <div key={index}>{line}</div> }) : this.props.toolTip} placement="top" fontSize="small">
          <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }}  className="log-mouseover" id={`info-tooltip-${this.props.title}`}/>
        </LightTooltip>}</div>
        <MaterialTable
          columns={[
            {
              field: "valueX",
              title: <div onClick={() => this.sortClick('Specialty')}>Specialty</div>,
              render: rowData => 
                <div className="item-title" title={rowData.valueX}>
                  <div className="specialty-col normal-text" onClick={() => {this.props.selectOption({display:rowData.valueX, id:rowData.valueX})}}>{rowData.valueX}</div>
                </div>
            },
            {
              field: "valueY",
              title: <div onClick={() => this.sortClick('% Change')}>% Change</div>,
              defaultSort: 'desc',
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
            thirdSortClick: false,
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
            Container: props => (<Paper {...props} elevation={0} />),
            // Header: props => (
            //   <div>
            //     <MTableHeader {...props} />
            //   </div>
            // ),
          }}
        />
      </div>
    );
  }
}