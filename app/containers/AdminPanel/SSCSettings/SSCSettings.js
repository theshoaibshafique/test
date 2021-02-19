import React from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Card, Checkbox, Divider, FormControlLabel, Grid, Switch, withStyles } from '@material-ui/core';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@mdi/react'
import { SSC_CONFIG } from '../../../constants';

const SSTSwitch = withStyles((theme) => ({
  root: {
    padding: '16px 11px',
  },
  thumb: {
    width: 14,
    height: 14,
  },
  switchBase: {
    padding: '12px 16px',
    transform: 'translateX(-8px)',
    color: '#004F6E',
    '&$checked': {
      color: '#004F6E',
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#3DB3E3',
    },
    '&:hover': {
      backgroundColor: 'unset !important'
    }
  },
  checked: {},
  track: {
    opacity: 1,
    borderRadius: 8,
    backgroundColor: '#C8C8C8'
  }
}))(Switch);

function PhaseItem(props) {
  const { isActive, questionName, questionId, cIndex, pIndex, qIndex, togglePhase } = props;
  const toggle = () => togglePhase(cIndex, pIndex, qIndex);

  return (
    <FormControlLabel
      control={
        <Checkbox
          disableRipple
          className="SST-Checkbox"
          icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
          checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
          onChange={toggle}
          checked={isActive}
          value={questionId}
        />
      }
      label={<div className="phase-item">{questionName}</div>}
    />
  )
}

function Phase(props) {
  const { isActive, phaseName, cIndex, pIndex, questions, togglePhase } = props;
  const toggle = () => togglePhase(cIndex, pIndex);

  return (
    <Card className={`phase ${isActive ? 'active' : 'inactive'}`} variant="outlined">
      <div className="phase-header">
        <div className="subtitle">{phaseName}</div>
        <div>
          <FormControlLabel
            control={
              <SSTSwitch checked={isActive} onChange={toggle} disableRipple />
            }
            label={<span className="toggle-label">{isActive ? 'Enabled' : 'Disabled'}</span>}
            labelPlacement='start'
          />
        </div>
      </div>
      <Divider light className="divider" />
      <div className="phase-items">
        {questions.map((question, qIndex) => (
          <div>
            <PhaseItem {...question} cIndex={cIndex} pIndex={pIndex} qIndex={qIndex} togglePhase={togglePhase} />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default class SSCSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    const { sscConfig } = this.props;
    this.state = {
      checklists: sscConfig && sscConfig.checklists || [],
      originalChecklist: JSON.parse(JSON.stringify(sscConfig && sscConfig.checklists || [])),
      isChanged: false
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.sscConfig != this.props.sscConfig) {
      const { sscConfig } = this.props;
      this.setState({
        checklists: sscConfig && sscConfig.checklists || [],
        originalChecklist: JSON.parse(JSON.stringify(sscConfig && sscConfig.checklists || [])),
      })
    }
  }
  // Checklist index, Phase Index, Item Index
  togglePhase(cIndex = -1, pIndex = -1, iIndex = -1) {
    let checklists = [].concat(this.state.checklists);
    if (iIndex >= 0) {
      checklists[cIndex].phases[pIndex].questions[iIndex].isActive = !checklists[cIndex].phases[pIndex].questions[iIndex].isActive;
    } else if (pIndex >= 0) {
      checklists[cIndex].phases[pIndex].isActive = !checklists[cIndex].phases[pIndex].isActive;
    } //Eventually different checklists will be toggleable

    this.setState({
      checklists,
      isChanged: true
    })
  }

  renderNotice(hasCheckedPhase) {

    if (!hasCheckedPhase) {
      return (
        <div className="error">
          At least 1 phase must be set to Active for the Surgical Safety Checklist
        </div>
      )
    }

    //Check if there is an active phase that has an item checked
    const hasItemChecked = this.state.checklists.some((checklist) => (
      checklist.phases.some((phase) => (
        phase.isActive && phase.questions.some((question) => (
          question.isActive
        ))
      ))
    ));

    if (hasItemChecked) {
      return ''
    }
    return (
      <div className="notice">
        <InfoOutlinedIcon style={{ fontSize: 16, margin: '0px 4px 4px 4px' }} />Quality Score analysis will be disabled when all checklist items are unchecked.
      </div>
    )
  }
  submit() {
    const jsonBody = {
      "facilityId": this.props.facilityName,
      "checklists": this.state.checklists,
      "configurations": []
    }
    this.setState({ isLoading: true }, () => {
      this.props.submit(jsonBody).then(() => {
        this.setState({
          originalChecklist: JSON.parse(JSON.stringify(this.state.checklists)),
          isChanged: false,
          isLoading: false
        })
      })
    })

  }
  reset() {
    this.setState({
      checklists: JSON.parse(JSON.stringify(this.state.originalChecklist)),
      isChanged: false
    })
  }

  renderSaveWarning() {
    if (this.state.isChanged) {
      return <div className="warning">If you leave without saving, changes will be discarded</div>
    }
    return <div></div>
  }

  render() {
    const hasCheckedPhase = this.state.checklists.some((checklist) => (
      checklist.phases.some((phase) => (
        phase.isActive
      ))
    ));
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
          <Grid container spacing={3} key={cIndex}>
            {checklist.phases.map((phase, pIndex) => (
              <Grid item xs={4} key={`${cIndex}-${pIndex}`}>
                <Phase {...phase} cIndex={cIndex} pIndex={pIndex} togglePhase={(c, p, i) => this.togglePhase(c, p, i)} />
              </Grid>
            ))}
          </Grid>
        ))}
        {this.renderNotice(hasCheckedPhase)}
        {this.renderSaveWarning()}
        <div className="buttons">
          <Button disableRipple className="reset" onClick={() => this.reset()}>Reset</Button>
          <Button disableRipple variant="outlined" className="primary" disabled={(this.state.isLoading || !hasCheckedPhase)} onClick={() => this.submit()}>
            {(this.state.isLoading) ? <div className="loader"></div> : 'Save'}</Button>
        </div>


      </section>
    );
  }
}