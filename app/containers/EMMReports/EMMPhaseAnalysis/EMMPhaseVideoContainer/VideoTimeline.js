import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectLogger } from '../../../App/selectors';

const VideoTimeline = (props) => {
  const { duration, procedureSteps, seekVideo, currentVideoTime } = props;
  const logger = useSelector(makeSelectLogger());
  let adverseEvents = [];
  procedureSteps.forEach((procedureStep) => {
    if (procedureStep.dataPoints.length > 0)
      adverseEvents = [...adverseEvents, ...procedureStep.dataPoints]
  })

  const shouldHighlight = (startTime, endTime) => {
    return (currentVideoTime >= startTime && currentVideoTime < endTime) ? 'highlighted' : '';
  }


  return (
    <div className="Video-Timeline relative">
      <div
        className="current-video-time absolute"
        style={{left: `${currentVideoTime/duration * 100}%`}}
      />
      {
        procedureSteps.map((procedureStep, index) => {
          return <div
                   key={`procedureStepTimeline${index}`}
                   className={`absolute procedure-step-timeline ${shouldHighlight(procedureStep.startTime, procedureStep.endTime)}`}
                   style={{
                     left: `${(procedureStep.startTime) / duration * 100}%`,
                     width: `${(procedureStep.endTime - procedureStep.startTime) / duration * 100}%`
                   }}
                  >
                 </div>
        })
      }

      {
        adverseEvents.map((event, index) => {
          const clickEvent = () => {
            seekVideo(parseInt(event.valueX));
            logger && logger.manualAddLog('click', `ae-select`, { time: parseInt(event.valueX) });
          }
          return <div
                    key={`adverseEvent${index}`}
                    className="time-line-marker event-circle absolute"
                    style={{left: `calc(${(event.valueX / duration * 100)}%)`}}
                    onClick={clickEvent}/>

        })
      }
    </div>
  )
}
export default VideoTimeline;