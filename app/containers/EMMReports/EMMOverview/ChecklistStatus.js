import React from 'react';
import { connect } from 'react-redux';
import { setEMMTab, setEMMPhaseIndex } from '../../App/emm-actions';

class ChecklistStatus extends React.Component {
  constructor(props) {
    super(props)
  }

  switchToPhase(phaseName) {
    const phaseIndex = this.props.allPhases.map((phase) => phase.name).indexOf(phaseName)
    this.props.setEmmTab('phase')
    this.props.setEmmPhaseIndex(phaseIndex)
  }

  render() {
    const { checklists } = this.props;
    const checkListHappened = checklists.filter((checklist) => checklist.title.indexOf('was missed') < 0)
    const checkListMissed = checklists.filter((checklist) => checklist.title.indexOf('was missed') >= 0)

    return (
      <div className="checklist-status subtle-subtext flex">
        <div className="checklist-happened-container flex">
          {
            checkListHappened.map((happened, index) => {
              return <div
                        key={`checkListHappened${index}`}
                        className="checklist-happened  log-click"
                        id={`checklist-${happened.title}`}
                        onClick={()=>this.switchToPhase(happened.valueX)}>
                      <div className="title">{happened.title}</div>
                      <div className="subtitle">{happened.subTitle}</div>
                     </div>
            })
          }
        </div>
        {
          (checkListMissed.length > 0) &&
            <div className="checklist-missed">
              <strong>
                <em>{checkListMissed.map((missed) => missed.valueX.replace(' Analysis', '')).join(', ')}</em>
              </strong>
              {(checkListMissed.length > 1) ? ' were' : ' was'} missed
            </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEmmTab: (data) => { dispatch(setEMMTab(data)); },
    setEmmPhaseIndex: (data) => { dispatch(setEMMPhaseIndex(data)); }
  };
};

export default connect(null, mapDispatchToProps)(ChecklistStatus);