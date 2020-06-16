import React from 'react';

const ChecklistStatus = (props) => {
  const { checklists } = props;
  const checkListHappened = checklists.filter((checklist) => checklist.title.indexOf('was missed') < 0)
  const checkListMissed = checklists.filter((checklist) => checklist.title.indexOf('was missed') >= 0)

  return (
    <div className="checklist-status flex">
      <div className="checklist-happened">
        {
          checkListHappened.map((happened) => {
            return <div className="checklist-happened">
                    <div className="title">{happened.title}</div>
                    <div className="subtitle">{happened.subTitle}</div>
                   </div>
          })
        }
      </div>
      <div className="checklist-missed">
        <strong><em>{checkListMissed.map((missed) => missed.valueX).join(', ')}</em></strong> was missed
      </div>
    </div>
  )
}

export default ChecklistStatus;