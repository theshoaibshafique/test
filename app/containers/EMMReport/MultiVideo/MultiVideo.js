import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import AzureVideo from '../AzureVideo/AzureVideo';
export default class MultiVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    
    this.state = {
      assets: this.props.assets || [],
      selected: 2,
      currentEvent: this.props.currentEvent, //This is only here to trigger re-render of tab indicator (Visual bug when indicator is loaded off screen)
      annoationTimes: this.props.annoationTimes
    }
  }
  
  convertTimeFormatToSecs(timeFormat) {
    if (timeFormat) {
      var timeFragments = timeFormat.split(":");
      if (timeFragments.length > 0) {
        switch (timeFragments.length) {
          case 4: return (parseInt(timeFragments[0], 10) * 60 * 60) + (parseInt(timeFragments[1], 10) * 60) + parseInt(timeFragments[2], 10) + (timeFragments[3] / 100);
          case 3: return (parseInt(timeFragments[0], 10) * 60 * 60) + (parseInt(timeFragments[1], 10) * 60) + parseInt(timeFragments[2], 10);
          case 2: return parseInt(timeFragments[0], 10) * 60 + parseInt(timeFragments[1], 10);
          case 1: return parseInt(timeFragments[0], 10);
          default: return parseInt(timeFragments[0], 10);
        }
      }
      else
        return parseInt(timeFormat, 10);
    }

    return 0;
  }
  componentDidMount() {
  }
  handleChange = (event, selected) => {
    this.setState({selected})
  };
  render() {

    return (
      <Paper square className="video-tabs">
        <Tabs
          value={this.state.selected}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
          onChange={this.handleChange}

        >
          <Tab disableRipple disableFocusRipple className="video-tab title annotation-secondary" label={this.props.header} disabled/>
          <Tab disableRipple disableFocusRipple className="video-tab divider annotation-secondary" label={"|"} disabled/>
          {this.state.assets.map((asset, index) => (
            <Tab disableRipple disableFocusRipple className="video-tab" label={`Video ${index+1}`} selected={this.state.selected == index+2} key={asset}></Tab>
          ))}
        </Tabs>
        {this.state.assets.map((asset, index) => (
          <div key={index+2} hidden={this.state.selected !== index+2}>
            <AzureVideo index={index+2} selected={this.state.selected} currentEvent={this.props.currentEvent} title={asset} 
            annoationTimes={this.state.annoationTimes.map((time) => { let offset = this.convertTimeFormatToSecs(this.props.header.split("-")[0]); return this.convertTimeFormatToSecs(time.split("-")[0]) -offset })} />
          </div>
        ))}
      </Paper>
    );
  }
}