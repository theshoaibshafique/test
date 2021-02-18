import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Card, Divider, FormControlLabel, Grid, Switch, withStyles } from '@material-ui/core';
import { SSC_CONFIG } from '../../../constants';

const SSTSwitch = withStyles((theme) => ({
  root:{
    padding:'16px 11px',
  },
  thumb: {
    width: 14,
    height: 14,
  },
  switchBase: {
    padding:'12px 16px',
    transform: 'translateX(-8px)',
    color: '#004F6E',
    '&$checked': {
      color: '#004F6E',
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#3DB3E3',
    },
    '&:hover':{
      backgroundColor:'unset !important'
    }
  },
  checked: {},
  track: {
    opacity: 1,
    borderRadius:8,
    backgroundColor: '#C8C8C8'
  }
}))(Switch);

// function PhaseItem(props) {
//   const [active, setActive] = React.useState(false);
// }

function Phase(props) {
  const toggle = () => props.togglePhase(props.cIndex, props.pIndex);

  return (
    <Card className="phase" variant="outlined">
      <div className="phase-header">
        <div className="subtitle">{props.phaseName}</div>
        <div><FormControlLabel
          control={
            <SSTSwitch checked={props.isActive} onChange={toggle} disableRipple/>
          }
          label={<span className="toggle-label">{props.isActive ? 'Active' : 'Inactive'}</span>}
          labelPlacement='start'
        />
        </div>

      </div>
      <Divider light />
    </Card>
  )
}

export default class SSCSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checklists: SSC_CONFIG.checklists,
      isChanged: false
    }
  }
  componentDidUpdate(prevProps) {

  }
  // Checklist index, Phase Index, Item Index
  togglePhase(cIndex = -1, pIndex = -1, iIndex = -1) {
    let checklists = [].concat(this.state.checklists);
    if (iIndex >= 0) {
      checklists[cIndex].phases[pIndex].questions[iIndex] = !checklists[cIndex].phases[pIndex].questions[iIndex];
    } else if (pIndex >= 0) {
      checklists[cIndex].phases[pIndex].isActive = !checklists[cIndex].phases[pIndex].isActive;
    } //Eventually different checklists will be toggleable
    console.log(checklists[cIndex].phases[pIndex].isActive);
    this.setState({
      checklists
    })
  }

  render() {

    return (
      <section className={`ssc-settings-page ${this.props.hasEMR && 'has-emr'}`}>
        <div className="title">
          Configuration
        </div>
        <div className="subtitle">
          Checklist Phases and Items
        </div>
        <div className="content">
          This setting will allow you to configure the data displayed to only include the phases and items that are within your hospital’s standard of practice. All historical data will reflect this new standard as well.
        </div>
        {this.state.checklists.map((checklist, cIndex) => (
          <Grid container spacing={3}>
            {checklist.phases.map((phase, pIndex) => (
              <Grid item xs={4} >
                <Phase {...phase} cIndex={cIndex} pIndex={pIndex} togglePhase={(c, p, i) => this.togglePhase(c, p, i)} />
              </Grid>
            ))}
          </Grid>
        ))}


      </section>
    );
  }
}