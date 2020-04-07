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
    //CALL GET https://insightsapi.surgicalsafety.com/api/media/abcd-test.mp4
    // globalFunctions.genericFetch("https://insightsapi.surgicalsafety.com/api/media/test/"+this.state.title, 'get', this.props.userToken, {})
    // .then(result => {
    //   if (result){
    //     this.setState({src:result.src, token: result.token})
    //   }
    // });
  }
  render() {
    let myToken = 'Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmF6dXJlOm1lZGlhc2VydmljZXM6Y29udGVudGtleWlkZW50aWZpZXIiOiIxNGJkNzEyOC1lOTI2LTQ0ZTEtYjE3ZC0yMDBmZDE4MjcyZjUiLCJuYmYiOjE1ODYyNzMwNTIsImV4cCI6MTU4NjI3Njk1MiwiaXNzIjoiU3VyZ2ljYWwgU2FmZXR5IFRlY2hub2xvZ2llcyIsImF1ZCI6Imluc2lnaHRzLnN1cmdpY2Fsc2FmZXR5LmNvbSJ9.RLrN3SW7Oyn7_4NE6M63VhfPSyWeEhjUDycd2UVc8Bw'
    return (
      <AzureMP
      skin="amp-flush"
      options={{width: "640",height: "500"}}
      src={[{
        src: "https://sstmediaservice-usct.streaming.media.azure.net/8509b561-a0fc-4022-a997-b0f1a724edeb/test.ism/manifest(format=mpd-time-csf,encryption=cenc)",
        type: "application/vnd.ms-sstr+xml",
        protectionInfo: [
          {
            "type": "PlayReady",
            "authenticationToken": myToken
        },
        {
            "type": "Widevine",
            "authenticationToken": myToken
        }
        ]
      }]}
    />
    );
  }
}