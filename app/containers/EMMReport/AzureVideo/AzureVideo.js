import React from 'react';
import { AzureMP } from 'react-azure-mp'
import globalFunctions from '../../../utils/global-functions';
export default class AzureVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      src: '',
      title: this.props.title
    }
  }
  componentDidMount() {
    globalFunctions.genericFetch(process.env.MEDIA_API+"/"+this.state.title, 'get', this.props.userToken, {})
    .then(result => {
      if (result){
        this.setState({src:result.url, token: result.token});
      }
    });
  }
  render() {
    return (
      <AzureMP
        skin="amp-flush"
        src={[{
          src: this.state.src,
          type: "application/vnd.ms-sstr+xml",
          protectionInfo: [
            {
              "type": "PlayReady",
              "authenticationToken": this.state.token
          },
          {
              "type": "Widevine",
              "authenticationToken": this.state.token
          }
          ]
        }]}
      /> 
    );
  }
}