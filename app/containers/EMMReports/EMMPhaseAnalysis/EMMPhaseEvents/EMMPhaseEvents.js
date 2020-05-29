import React from 'react';
import './style.scss';

export default class EMMPhaseEvents extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  getEventsTitle() {
    let { phaseTitle } = this.props;
    if (phaseTitle == 'SurgicalProcedure') {
      return <div>
              <div className="main-text bold">Procedure Steps</div>
             </div>
    } else {
      return <div className="main-text bold">Non-Routine Events</div>
    }
  }

  render() {
    let { phaseData } = this.props;
    return (
      <div>
        <div className="phase-events-title">
          {this.getEventsTitle()}
        </div>
        <div>
          {phaseData.map((data, index) =>{
            return <div className="phase-events" key={`data` + index}>
                      <div
                        className="time-select"
                        onClick={()=>this.props.seekVideo(data.startTime)}>
                          {data.title}
                      </div>
                      <div className="main-text">{data.subTitle}</div>
                      {data.dataPoints.map(data => {
                        return <div className="event flex">
                                <div className="event-circle" />{data.title}
                               </div>
                        })
                      }
                    </div>
            })
          }
        </div>
      </div>
    );
  }
}