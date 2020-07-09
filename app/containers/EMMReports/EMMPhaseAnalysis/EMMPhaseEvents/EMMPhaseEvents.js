import React from 'react';
import './style.scss';
import globalFuncs from '../../../../utils/global-functions';
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

  aeSelected(startTime, videoID, videoIndex) {
    if (this.props.phaseTitle !== 'SurgicalProcedure')
      this.props.changeVideo(videoID, videoIndex)
    else
      this.props.seekVideo(startTime)
  }

  shouldHighlight(startTime, endTime, videoIndex) {
    let { currentVideoTime, phaseTitle, selectedVideoClipID } = this.props;
    let highlighted = false;
    if (phaseTitle === 'SurgicalProcedure') {
      highlighted = (currentVideoTime >= startTime && currentVideoTime <= endTime);
    } else {
      highlighted = (selectedVideoClipID == videoIndex)
    }
    return (highlighted) ? 'highlighted' : '';
  }

  getAEEventTitle(data) {
    let { phaseTitle } = this.props;
    if (phaseTitle != 'SurgicalProcedure') {
      return data.title
    } else {
      return (data.startTime == data.endTime) ?
        globalFuncs.formatSecsToTime(data.startTime) :
        globalFuncs.formatSecsToTime(data.startTime) +  ' - ' + globalFuncs.formatSecsToTime(data.endTime)
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
              return <div className={`phase-events ${this.shouldHighlight(data.startTime, data.endTime, index)}`} key={`dataPoints${index}`}>
                        <div key={`phaseEvent${index}`}
                          className="time-select"
                          onClick={() => this.aeSelected(data.startTime, data.assets[0], index)}>
                            {this.getAEEventTitle(data)}
                        </div>
                        <div className="main-text">{data.subTitle}</div>
                        {data.dataPoints.map((aeEvent, index) => {
                          return <div key={`aeEvent${index}`} className="event flex" onClick={()=>this.props.seekVideo(parseInt(aeEvent.valueX))}>
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