import React from 'react';

const VideoTimeline = (props) => {
  const { duration, procedureSteps } = props;
  let adverseEvents = [];
  procedureSteps.forEach((procedureStep) => {
    if (procedureStep.dataPoints.length > 0)
      adverseEvents = [...adverseEvents, ...procedureStep.dataPoints]
  })

  return (
    <div className="Video-Timeline relative">
      {
        adverseEvents.map((event, index) => {
          return <div
                    key={`adverseEvent${index}`}
                    className="time-line-marker event-circle absolute"
                    style={{left: `${(event.valueX / duration * 100)}%`}} />

        })
      }
    </div>
  )
}

export default VideoTimeline;