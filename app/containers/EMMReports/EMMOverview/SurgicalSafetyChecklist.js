import React from 'react';
import CircleProgress from '../../../components/Report/CircleProgress';

const SurgicalSafetyChecklist = (props) => {
  const { checklistScore } = props;
  const circleSize = 175;
  const sscCirclesColors = ["#A7E5FD", "#97E7B3", "#CFB9E4"];
  const hasNegativeScore = checklistScore.filter(score => score.valueX == -1).length == 2;

  const showZeroCheckList = () => {
    return <div className="zero-score flex">
            <div style={{width: '175px', margin: '0 auto'}}>
              <CircleProgress
                title={'Compliance Score'}
                color={''}
                value={0}
                size={circleSize}
              />
            </div>
            <div className="flex vertical-center">Quality and Engagement score could not be measured because checklist was not conducted during this case.</div>
           </div>
  }

  const showStandardCheckList = () => {
    return checklistScore.map((sscCircle, index) => {
      return <div key={index}><div style={{width: '175px', margin: '0 auto'}}>
              <CircleProgress
                title={sscCircle.title}
                color={sscCirclesColors[index]}
                value={sscCircle.valueX}
                size={circleSize}
              />
            </div></div>
    })
  }

  return (
    <div className="SSC-Circles">
      {
        (hasNegativeScore) ?
          showZeroCheckList()
        :
          showStandardCheckList()
      }
    </div>
  )
}

export default SurgicalSafetyChecklist;