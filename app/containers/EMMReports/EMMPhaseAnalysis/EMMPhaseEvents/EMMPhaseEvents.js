import React from 'react';
import './style.scss';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';

export default class EMMPhaseEvents extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showOnlyAE: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.phaseData != this.props.phaseData) {
      this.setState({
        showOnlyAE: false
      })
    }
  }

  getEventsTitle() {
    let { phaseTitle } = this.props;
    let { showOnlyAE } = this.state;
    if (phaseTitle == 'SurgicalProcedure') {
      return <div>
              <div className="main-text bold">Procedure Steps</div>
              <FormControlLabel
                control={<Checkbox
                  disableRipple
                    checked={showOnlyAE}
                    onChange={()=>{this.setState({ showOnlyAE: !showOnlyAE})}}
                    icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                    />}
                label={<div className="show-only-ae">Only show steps with AE</div>}
              />
             </div>
    } else {
      return <div className="main-text bold">Non-Routine Events</div>
    }
  }

  render() {
    const { phaseData } = this.props;
    const { showOnlyAE } = this.state;
    return (
      <div>
        <div className="phase-events-title">
          {this.getEventsTitle()}
        </div>
        <div>
          {phaseData.map((data, index) => {
            if (!showOnlyAE || (showOnlyAE && data.dataPoints.length > 0)) {
              return <div className="phase-events" key={`dataPoints${index}`}>
                        <div key={`phaseEvent${index}`}
                          className="time-select"
                          onClick={()=>this.props.seekVideo(data.startTime)}>
                            {data.title}
                        </div>
                        <div className="main-text">{data.subTitle}</div>
                        {data.dataPoints.map(aeEvent => {
                          return <div className="event flex" onClick={()=>this.props.seekVideo(parseInt(aeEvent.valueX))}>
                                  <div className="event-circle" />{aeEvent.title}
                                </div>
                          })
                        }
                      </div>
            }
            })
          }
        </div>
      </div>
    );
  }
}