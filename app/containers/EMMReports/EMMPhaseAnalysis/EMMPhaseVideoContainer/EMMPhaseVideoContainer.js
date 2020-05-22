import React from 'react';
import './style.scss';
import AzureVideo from '../../AzureVideo';
import { Paper } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCircleMedium } from '@mdi/js';

export default class EMMPhaseVideoContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  componentDidMount() {

  }

  render() {
    let { phaseData } = this.props;
    return (
      <div className="Emm-Phase-Video-Container flex">
          <div className="phase-video">
            <AzureVideo title={'testvideo'} />
          </div>
          <div className="phase-events">
            {phaseData.enhancedMMData.map((data, index) =>{
              return <div key={`data` + index}>
                        <div>{data.title}</div>
                        <div>{data.subTitle}</div>
                      </div>
            })

            }
          </div>
      </div>
    );
  }
}