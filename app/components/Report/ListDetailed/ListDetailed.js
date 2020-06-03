import React from 'react';
import './style.scss';
import { Grid } from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';

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

  getName(searchList, key) {
    let index = searchList.findIndex(item => item.value.toLowerCase() == key.toLowerCase());
    if (index >= 0) {
      return searchList[index].name;
    }
  }

  renderList() {

    return this.props.dataPoints && this.props.dataPoints.map((point, index) => {
      return (<Grid container spacing={0} key={index}>
        <Grid item xs={10} className={point.subTitle ? "list-subtitle" : "list-title"}>
          {(point.subTitle ? this.getName(this.state.procedures, point.subTitle) : this.getName(this.props.specialties, point.title)) || point.subTitle}
        </Grid>
        <Grid item xs={2} className={point.subTitle ? "list-subtitle-value" : "list-title-value"}>
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
        <Grid container className="list-detailed" direction="column" spacing={0} style={{minHeight: 150}}>
          <Grid item xs={12} className="chart-title">
            {this.props.title}
          </Grid>
          {!this.props.body && <Grid item xs={12} className="chart-subtitle">
            {this.props.subTitle}
          </Grid>}
          <Grid item xs={12} >
            {this.props.body && this.props.subTitle 
            ? <div><div className="no-data">{this.props.body}</div> <div className="no-data-subtitle">{this.props.subTitle}</div></div>
            : this.props.body ? 
              <div className="display-text" style={{ marginTop: 32 }}>{this.props.body}</div>
              : this.renderList()}
          </Grid>


        </Grid>
      </LoadingOverlay>)
  }
}