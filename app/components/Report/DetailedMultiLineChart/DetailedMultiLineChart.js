import React from 'react';
import { Grid, Tooltip, withStyles, Divider } from '@material-ui/core';
import C3Chart from 'react-c3js';
import './style.scss';
import moment from 'moment/moment';
import LoadingOverlay from 'react-loading-overlay';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LineChart from '../LineChart/LineChart';
import { NavLink } from 'react-router-dom';
import globalFunctions from '../../../utils/global-functions';
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);
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
    return (
      <LoadingOverlay
        active={!this.props.dataPoints}
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
            {this.props.title}{this.props.toolTip && <LightTooltip interactive arrow title={this.props.toolTip} placement="top" fontSize="small">
              <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 8px 4px' }} />
            </LightTooltip>}
          </Grid>

          {this.props.subReportData && this.props.subReportData.map((reportData, index) => {
            return (
              <Grid container spacing={0} className="multi-line-chart-row" key={`row-${index}`}>
                <Grid item xs={4} >
                  <Grid container spacing={1} direction="column">
                    <Grid item xs className="row-title">
                      {globalFunctions.getName(this.props.labelList,reportData.title)}
                    </Grid>
                    <Grid item xs className="row-subtitle">
                      {reportData.subTitle}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={5} >
                  <LineChart {...reportData} />
                </Grid>
                <Grid item xs={3} className="row-score">
                  <Grid container spacing={1} direction="column">
                    <Grid item xs>
                      {reportData.total}{reportData.unit}
                    </Grid>
                    <Grid item xs className="row-score-title">
                      {reportData.footer}
                    </Grid>
                  </Grid>
                </Grid>
                {index < this.props.subReportData.length - 1 && <Divider className="row-divider" />}
              </Grid>
            )
          })}
          <Grid item xs={12} style={{ textAlign: 'center',marginTop:24 }}>
            {this.props.url && <NavLink to={this.props.url} className='link'>
              {this.props.urlText}
            </NavLink>}
          </Grid>
        </Grid>
      </LoadingOverlay>
    );
  }
}