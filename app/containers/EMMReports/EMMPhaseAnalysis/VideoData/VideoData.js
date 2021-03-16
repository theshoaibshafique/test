import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import './style.scss';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Grid } from '@material-ui/core';
import { selectEMMVideoData, selectEMMVidoeTime } from '../../../App/emm-selectors';


class VideoData extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  onClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  renderData() {
    return this.props.videoData && this.props.videoData.slice(0,5).map((entry,index) =>
      <Grid item xs className={`${this.state.isOpen ? '' : 'hidden'}`} key={index}>
        <div className="title subtle-text" >{entry.dataType}</div>
        <div className="value subtle-subtext">{this.getDataValue(entry)}</div>
      </Grid>
    )
  }

  getDataValue(data){
    const empty = "-";
    if (!data || !data.values){
      return empty;
    }
    const currentVideoTime = (this.props.currentVideoTime > 86400) ? 86400 : this.props.currentVideoTime;
    const threshold = data.thresholdDurationSeconds
    let result = empty;
    data.values.forEach(value => {
      if (currentVideoTime >= (value.s - this.props.videoOffSet) && currentVideoTime <= (value.s - this.props.videoOffSet) + threshold){
        result = value.v + this.formatUnit(data.unitOfMeasure)
      }
    });
    return result;
  }

  formatUnit(unit){
    switch (unit) {
      case "BPM":
      case "mmHg":
        unit = " " + unit;
        break;
      default:
        break;
    }
    return unit;
  }

  render() {
    let {videoData } = this.props;
    videoData = videoData && videoData.slice(0,5);
    if (!videoData || !videoData.length){
      return "";
    }
    return (
       <div className={`video-data ${this.state.isOpen ? 'isOpen' : ''}`} >
        <Grid spacing={2} className='data-grid' container>
          <Grid item className={`subtle-subtext pointer`} onClick={() => this.onClick()}>
            Vitals<InfoOutlinedIcon style={{ fontSize: 14, marginLeft: 4 }} />
          </Grid>
          {this.renderData()}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentVideoTime: selectEMMVidoeTime()
});

export default connect(mapStateToProps, null)(VideoData);
