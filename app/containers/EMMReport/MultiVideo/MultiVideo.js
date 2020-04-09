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
      selected: 0
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
        <Typography color="textSecondary" className="annotation-secondary" style={{padding:"24px 40px"}}>
          {this.props.header}
        </Typography>
        <Tabs
          value={this.state.selected}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs"
          onChange={this.handleChange}
        >
          {this.state.assets.map((asset, index) => (
            <Tab disableRipple disableFocusRipple className="video-tab" label={`Video ${index+1}`} key={asset}></Tab>
          ))}
        </Tabs>
        {this.state.assets.map((asset, index) => (
          <div key={index} hidden={this.state.selected !== index}><AzureVideo title={asset} /></div>
        ))}
      </Paper>
    );
  }
}