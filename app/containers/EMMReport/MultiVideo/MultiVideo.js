import React from 'react';
import { AzureMP } from 'react-azure-mp'
import globalFunctions from '../../../utils/global-functions';
import { Paper, Tabs, Tab } from '@material-ui/core';
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
      <Paper square>
        <Tabs
          value={this.state.selected}
          indicatorColor="primary"
          textColor="primary"
          className="video-tabs"
          onChange={this.handleChange}
        >
          {this.state.assets.map((asset, index) => (
            <Tab label={`Video ${index+1}`} key={asset}></Tab>
          ))}
        </Tabs>
        {this.state.assets.map((asset, index) => (
          <div key={index} hidden={this.state.selected !== index}><AzureVideo title={asset} /></div>
        ))}
      </Paper>
    );
  }
}