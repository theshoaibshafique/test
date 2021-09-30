/*
  DEPRECATED
  Used to be used for Top 5 Missed checklist items in SSC Quality Score
  Had the ability to open modal for more information
*/
import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';

export default class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints: this.props.dataPoints,
      procedures: this.props?.specialties?.map((specialty) => specialty.procedures).flatten() || []
    }
  };

  componentDidMount() {
  }

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
    return key;
  }

  renderList() {

    return this.state.dataPoints && this.state.dataPoints.map((point, index) => {
      return (<Grid container spacing={0} key={index}>
        <Grid item xs={10} className="list-title subtle-text">
          {point.title}
        </Grid>
        <Grid item xs={2} className="list-title-value subtle-subtext">
          {point.valueX}
        </Grid>
        <Grid item xs={12} className="list-subtitle subtle-text">
          {point.subTitle}
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
        <Grid container className={`checklist ${this.props.body ? 'checklist-complete' : ''}`} direction="column" spacing={0} >
          {!this.props.body && <Grid item xs={12} className="chart-title normal-text">
            {this.props.subTitle}
          </Grid>}
          <Grid item xs={12} >
            {this.props.body && this.props.subTitle
            ? <div><div className="no-data">{this.props.body}</div> <div className="no-data-subtitle">{this.props.subTitle}</div></div>
            : this.props.body ? 
              <div className="display-text normal-text">{this.props.body}</div>
              : this.renderList()}
          </Grid>
          <Grid item xs={12} className="link subtle-text" onClick={() => this.props.openModal({...this.props,tileType:this.props.footer,reportName:this.props.total})}>
              {this.props.description}
          </Grid>

        </Grid>
      </LoadingOverlay>)
  }
}