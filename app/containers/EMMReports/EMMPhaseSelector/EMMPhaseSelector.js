import React from 'react';
import './style.scss';
import { Paper } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCircleMedium } from '@mdi/js';

export default class EMMPhaseSelector extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  componentDidMount() {

  }
  render() {
    let { selectedPhase, phases } = this.props
    return (
      <div className="Emm-Phase-Selector">
        {phases.map((phase, index) => {
          let isSelected = (index == selectedPhase);
          return <Paper
                  className={`Emm-Phase-Select relative ${(isSelected) && 'selected-phase'}`}
                  elevation={(isSelected) ? 3 : 0}
                  onClick={()=>this.props.changePhase(index)}
                  key={phase}>
                    {phase}
                    {(isSelected) && <Icon className="selected-dot" color="#FFFFFF" path={mdiCircleMedium} size={'14px'} />}
                  </Paper>
        })}
      </div>
    );
  }
}