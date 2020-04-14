import React from 'react';
import { AzureMP } from 'react-azure-mp'
import globalFunctions from '../../../utils/global-functions';
import { Paper, Tabs, Tab, Typography } from '@material-ui/core';
import AzureVideo from '../AzureVideo/AzureVideo';
export default class MultiVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    
    this.state = {
      assets: this.props.assets || [],
      selected: 1,
      currentEvent: this.props.currentEvent //This is only here to trigger re-render of tab indicator (Visual bug when indicator is loaded off screen)
    }

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
          <Tab disableRipple disableFocusRipple className="video-tab disabled annotation-secondary" label={this.props.header} disabled/>
          {this.state.assets.map((asset, index) => (
            <Tab disableRipple disableFocusRipple className="video-tab" label={`Video ${index+1}`} selected={this.state.selected == index+1} key={asset}></Tab>
          ))}
        </Tabs>
        {this.state.assets.map((asset, index) => (
          <div key={index+1} hidden={this.state.selected !== index+1}><AzureVideo title={asset} /></div>
        ))}
      </Paper>
    );
  }
}