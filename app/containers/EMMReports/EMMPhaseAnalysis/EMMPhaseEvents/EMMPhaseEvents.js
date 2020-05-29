import React from 'react';
import './style.scss';

export default class EMMPhaseEvents extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  render() {
    let { phaseData } = this.props;
    return (
      <div>
        {phaseData.map((data, index) =>{
          return <div className="phase-events" key={`data` + index}>
                    <div
                      className="time-select"
                      onClick={()=>this.props.seekVideo(data.startTime)}>
                        {data.title}
                    </div>
                    <div className="main-text">{data.subTitle}</div>
                  </div>
          })
        }
      </div>
    );
  }
}