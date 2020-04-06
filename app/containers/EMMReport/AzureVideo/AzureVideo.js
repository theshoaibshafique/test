import React from 'react';
import { AzureMP } from 'react-azure-mp'
export default class AzureVideo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //CALL GET https://insightsapi.surgicalsafety.com/api/media/abcd-test.mp4
  }
  render() {
    let myToken = 'Bearer=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmF6dXJlOm1lZGlhc2VydmljZXM6Y29udGVudGtleWlkZW50aWZpZXIiOiIxNGJkNzEyOC1lOTI2LTQ0ZTEtYjE3ZC0yMDBmZDE4MjcyZjUiLCJuYmYiOjE1ODYxODQ0NjUsImV4cCI6MTU4NjE4ODM2NSwiaXNzIjoiU3VyZ2ljYWwgU2FmZXR5IFRlY2hub2xvZ2llcyIsImF1ZCI6Imluc2lnaHRzLnN1cmdpY2Fsc2FmZXR5LmNvbSJ9.rBc3cF_L0xnqiCbkGIE4Z63Brq_n_Kgl1nu5xy6GQMM'
    return (
      <AzureMP
      skin="amp-flush"
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