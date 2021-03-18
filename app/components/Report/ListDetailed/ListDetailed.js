/* 
  DEPRECATED
  Originaly used in Specialties of Interest for SSC
  Displays list of Specialties and sublists
*/

import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';
import globalFunctions from '../../../utils/global-functions';
import { LightTooltip } from '../../SharedComponents/SharedComponents';

export default class ListDetailed extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: this.props.dataPoints,
      procedures: this.props.specialties && this.props.specialties.map((specialty) => specialty.procedures).flatten() || []
    }
  };

  componentDidMount() {
    this.groupTitles();
  }

  groupTitles() {
    if (!this.props.dataPoints) {
      return;
    }
    // let dataPoints = this.props.dataPoints.sort((a, b) => { return ('' + a.title).localeCompare(b.title) || b.valueX - a.valueX });
    // this.setState({ dataPoints });
  }

  renderList() {

    return this.props.dataPoints && this.props.dataPoints.map((point, index) => {
      return (<Grid container spacing={0} key={index}>
        <Grid item xs={10} className={point.subTitle ? "list-subtitle subtle-subtext" : "list-title normal-text"}>
          {
            point.subTitle
              ?
              point.subTitle == "Other Procedures" ? <div className="list-subtitle subtle-subtext">{globalFunctions.getName(this.state.procedures, point.subTitle)}</div> :
                <LightTooltip interactive arrow title={globalFunctions.getName(this.state.procedures, point.subTitle)} placement="left" fontSize="small">
                  <div className="list-subtitle subtle-subtext">{globalFunctions.getName(this.state.procedures, point.subTitle)}</div>
                </LightTooltip>
              : globalFunctions.getName(this.props.specialties, point.title) || point.subTitle
          }

        </Grid>
        <Grid item xs={2} className={point.subTitle ? "list-subtitle-value subtle-subtext" : "list-title-value normal-text"}>
          {point.valueX}
        </Grid>
      </Grid>)
    })
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
        <Grid container className="list-detailed" direction="column" spacing={0} style={{ minHeight: 150 }}>
          <Grid item xs={12} className="chart-title">
            {this.props.title}
          </Grid>
          {!this.props.body && <Grid item xs={12} className="chart-subtitle subtle-subtext">
            {this.props.subTitle}
          </Grid>}
          <Grid item xs={12} >
            {this.props.body && this.props.subTitle
              ? <div><div className="no-data">{this.props.body}</div> <div className="no-data-subtitle">{this.props.subTitle}</div></div>
              : this.props.body ?
                <div className="display-text normal-text" style={{ marginTop: 16 }}>{this.props.body}</div>
                : this.renderList()}
          </Grid>


        </Grid>
      </LoadingOverlay>)
  }
}