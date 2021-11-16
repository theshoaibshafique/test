import React from 'react';
import './style.scss';
import globalFuncs from '../../../../utils/global-functions';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';

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

  toggleShowOnlyAE(showOnlyAE) {
    this.setState({ showOnlyAE: !showOnlyAE });
    const { logger } = this.props;
    logger?.manualAddLog('click', `toggle-show-only-ae`, { checked: !showOnlyAE });
  }

  getEventsTitle(isOpenProcedure) {
    let { phaseTitle, selectedSurgicalTab } = this.props;
    let { showOnlyAE } = this.state;
    if (phaseTitle == 'SurgicalProcedure' && selectedSurgicalTab == 0) {
      return <div>
        <div className="main-text bold">Procedure Steps</div>
        <FormControlLabel
          control={<Checkbox
            disableRipple
            checked={showOnlyAE}
            onChange={() => { this.toggleShowOnlyAE(showOnlyAE) }}
            icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
            checkedIcon={<Icon color="#004F6E" path={mdiCheckboxOutline} size={'18px'} />}
          />}
          label={<div className="show-only-ae subtle-subtext">Only show steps with AE</div>}
        />
      </div>
    } else if (isOpenProcedure) {
      return <div className="main-text bold">AE/Non-Routine Events</div>
    } else {
      return <div className="main-text bold">Non-Routine Events</div>
    }
  }

  aeSelected(startTime, videoID, videoIndex, isLapProcedure) {
    if (!isLapProcedure)
      this.props.changeVideo(videoID, videoIndex)
    else
      this.props.seekVideo(startTime)
  }

  shouldHighlight(startTime, endTime, videoIndex, isLapProcedure) {
    let { currentVideoTime, selectedVideoClipID } = this.props;
    let highlighted = false;
    if (isLapProcedure) {
      highlighted = (currentVideoTime >= startTime && currentVideoTime <= endTime);
    } else {
      highlighted = (selectedVideoClipID == videoIndex)
    }
    return (highlighted) ? 'highlighted' : '';
  }

  getAEEventTitle(data, index, isOpenProcedure) {
    let { phaseTitle } = this.props;
    if (phaseTitle != 'SurgicalProcedure') {
      return data.title
    } else if (isOpenProcedure) {
      return `Video Clip ${index + 1}`
    } else {
      return (data.startTime == data.endTime) ?
        globalFuncs.formatSecsToTime(data.startTime) :
        globalFuncs.formatSecsToTime(data.startTime) + ' - ' + globalFuncs.formatSecsToTime(data.endTime)
    }
  }

  render() {
    const { phaseTitle, phaseData, selectedSurgicalTab, enhancedMMOpenData, multiclip } = this.props;
    const { logger } = this.props;
    const { showOnlyAE } = this.state;
    const isLapProcedure = (selectedSurgicalTab == 0);
    const isOpenProcedure = (selectedSurgicalTab == 1);
    let dataToShow = (isOpenProcedure) ? enhancedMMOpenData : phaseData;
    return (
      <div>
        <div className="phase-events-title subtle-subtext">
          {this.getEventsTitle(isOpenProcedure)}
        </div>
        <div>
          {dataToShow.map((data, index) => {
            if (!showOnlyAE || (showOnlyAE && data.dataPoints.length > 0)) {
              const AEEventTitle = this.getAEEventTitle(data, index, isOpenProcedure);
              const timeSelectClick = () => {
                this.aeSelected(data.startTime, data.assets[0], index, isLapProcedure || multiclip);
                logger?.manualAddLog('click', `time-select-${data.subTitle}`, { time: data.startTime });
              }
              const aeSelect = () => {
                this.aeSelected(data.startTime, data.assets[0], index);
                logger?.manualAddLog('click', `ae-select-${data.title}`, { time: data.startTime });
              }
              return <div className={`phase-events ${this.shouldHighlight(data.startTime, data.endTime, index, isLapProcedure)}`} key={`dataPoints${index}`}>
                <div key={`phaseEvent${index}`}
                  className="time-select subtle-subtext"
                  onClick={timeSelectClick}>
                  {AEEventTitle}
                </div>
                <div className="main-text">{data.subTitle}</div>
                {
                  (isOpenProcedure) &&
                  <div className="event flex" onClick={aeSelect}><div className="event-circle" />{data.title}</div>
                }
                {data.dataPoints.map((aeEvent, index) => {
                  const seekVideo = () => {
                    this.props.seekVideo(parseInt(aeEvent.valueX));
                    logger?.manualAddLog('click', `ae-select-${aeEvent.title}`, { time: data.startTime });
                  }
                  return <div key={`aeEvent${index}`} className="event subtle-subtext flex" onClick={seekVideo}>
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