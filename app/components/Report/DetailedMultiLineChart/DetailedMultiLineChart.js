import React from 'react';
import { Grid, Divider } from '@material-ui/core';
import './style.scss';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { NavLink } from 'react-router-dom';
import globalFunctions from '../../../utils/global-functions';
import LineChart from './LineChart/LineChart';
import { LightTooltip } from '../../SharedComponents/SharedComponents';
export default class DetailedMultiLineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.chartRef = React.createRef();

    this.state = {
      chartID: 'areaChartDetailed'
    }

  };

  componentDidMount() {

  }



  render() {
    let subReportData = this.props.subReportData || [];
    subReportData.sort((a, b) => { return parseInt(b.total) - parseInt(a.total) || ('' + a.total).localeCompare(b.total) })
    return (
      <LoadingOverlay
        // active={!this.props.dataPoints}
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
        <Grid container spacing={0} justify='center' className="detailed-multi-line-chart" >
          <Grid item xs={12} className="chart-title" style={{ textAlign: 'center' }}>
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow
              title={Array.isArray(this.props.toolTip) ? this.props.toolTip.map((line) => { return <div>{line}</div> }) : this.props.toolTip}
              placement="top" fontSize="small"
            >
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>
          <Grid item xs={12} className="chart-subtitle subtle-subtext">
            {this.props.subTitle}
          </Grid>
          <Grid item xs={12} className="sub-chart-container">
            {subReportData.map((reportData, index) => {
              return (
                <Grid container spacing={0} className="multi-line-chart-row" key={`row-${index}`}>
                  <Grid item xs={2} >
                    <Grid container spacing={1} direction="column" className="flex-center" style={{ height: "100%" }}>
                      <Grid item xs className="row-title">
                        {globalFunctions.getName(this.props.labelList, reportData.title)}
                      </Grid>
                      {/* <Grid item xs className="row-subtitle subtle-subtext">
                        {reportData.subTitle}
                      </Grid> */}
                    </Grid>
                  </Grid>
                  <Grid item xs={8} >
                    <LineChart {...reportData} />
                  </Grid>
                  <Grid item xs={2} className="row-score">
                    <Grid container spacing={1} direction="column">
                      <Grid item xs>
                        {reportData.total}{reportData.unit}
                      </Grid>
                      <Grid item xs className="row-score-title subtle-text"> 
                        {reportData.footer}
                      </Grid>
                    </Grid>
                  </Grid>
                  {index < this.props.subReportData.length - 1 && <Divider className="row-divider" />}
                </Grid>
              )
            })}
            {subReportData.length == 0 && <Grid item xs={12} className="display-text normal-text">
              {this.props.body}
            </Grid>}
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: 15 }}>
            {this.props.url && <NavLink to={this.props.url} className='link normal-text'>
              {this.props.urlText}
            </NavLink>}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}