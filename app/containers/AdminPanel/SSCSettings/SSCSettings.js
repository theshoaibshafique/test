import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import globalFuncs from '../../../utils/global-functions';
import './style.scss';
import { Card, Checkbox, Divider, FormControlLabel, Grid, Slider, Switch, Tooltip, withStyles } from '@material-ui/core';
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
const SSTSlider = withStyles({
  root: {
    color: '#D8D8D8',
    height: 8,
    '& .MuiSlider-markLabel[data-index="0"]': {
      transform: "translateX(0%)"
    },
    '& .MuiSlider-markLabel[data-index="1"]': {
      transform: "translateX(-100%)"
    }
  },
  thumb: {
    height: 14,
    width: 14,
    backgroundColor: '#004F6E',
    // border: '2px solid currentColor',
    marginTop: -3,
    marginLeft: -8,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    color: '#004F6E',
    left: 'calc(-50% - 2px)',
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 12,
    width: 2,
    marginTop: -2,
  },
  markLabel: {
    fontSize: '14px',
    fontFamily: 'Noto Sans'
  },
  markLabelActive: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

function PhaseItem(props) {
  const { isActive, questionName, questionId, cIndex, pIndex, qIndex, togglePhase } = props;
  const toggle = () => togglePhase(cIndex, pIndex, qIndex);

  return (
    <FormControlLabel
      style={{ display: 'table' }}
      control={
        <div style={{ display: 'table-cell' }}>
          <Checkbox
            disableRipple
            className="SST-Checkbox"
            icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
            checkedIcon={<Icon path={mdiCheckBoxOutline} size={'18px'} />}
            onChange={toggle}
            checked={isActive}
            value={questionId}
          />
        </div>
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

function Goal(props) {
  let { goal, currentGoal, title, tooltip, onChange } = props;
  const clss = title && title.toLowerCase().replace(/\s/g, '');

  //Keep track of your own Value and only update Goal on Committed (Better performance)
  let [value, setValue] = React.useState(goal);
  useEffect(() => {
    setValue(goal);
  }, [props.goal]);
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  //Adjust labels so the appear within the slider
  let isActive = goal != null
  console.log(title, currentGoal)
  return (
    <Card className={`goals ${isActive ? 'active' : 'inactive'} ${clss}`} variant="outlined">
      <div className="goal-header">
        <div className="subtitle">
          {title}
          <LightTooltip interactive arrow
            title={tooltip}
            placement="top" fontSize="small"
          >
            <InfoOutlinedIcon style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
          </LightTooltip>
        </div>
        <div>
          <FormControlLabel
            control={
              <SSTSwitch checked={isActive} onChange={() => onChange(title, isActive ? null : (currentGoal || 50))} disableRipple />
            }
            label={<span className="toggle-label">{isActive ? 'Enabled' : 'Disabled'}</span>}
            labelPlacement='start'
          />
        </div>
      </div>
      <Divider light className="divider" />
      <div className={`goal-slider ${isActive ? 'active' : 'inactive'}`}>
        <div className="goal-title">
          <span className="goal">Current: {isNaN(parseInt(currentGoal)) ? "N/A" : currentGoal}</span>
          <span className='goal-display'>{value || goal}</span>
        </div>
        <SSTSlider
          valueLabelDisplay="auto"
          defaultValue={50}
          value={(value >= 0 ? value : goal) || 0}
          onChange={handleSliderChange}
          onChangeCommitted={(event, goal) => onChange(title, goal)}
        // marks={[currentGoal != null ? { value: currentGoal, label: `Current: ${currentGoal}` } : {}]}
        />
      </div>

    </Card>
  )
}

export default class SSCSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    const { sscConfig } = this.props;
    const { complianceGoal, engagementGoal, qualityGoal } = sscConfig || {};
    this.state = {
      checklists: JSON.parse(JSON.stringify(sscConfig && sscConfig.checklists || [])),
      isChanged: false,
      complianceGoal: complianceGoal,
      engagementGoal: engagementGoal,
      qualityGoal: qualityGoal
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.sscConfig != this.props.sscConfig) {
      const { sscConfig } = this.props;
      const { complianceGoal, engagementGoal, qualityGoal } = sscConfig;
      this.setState({
        checklists: sscConfig && sscConfig.checklists || [],
        complianceGoal: complianceGoal,
        engagementGoal: engagementGoal,
        qualityGoal: qualityGoal
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

  updateGoal(title, goal = null) {
    switch (title) {
      case "Compliance Score":
        this.setState({ complianceGoal: goal })
        break;
      case "Engagement Score":
        this.setState({ engagementGoal: goal })
        break;
      case "Quality Score":
        this.setState({ qualityGoal: goal })
        break;
      default:

    }
    this.setState({ isChanged: true })
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
    const { complianceGoal, engagementGoal, qualityGoal } = this.state;
    const jsonBody = {
      "facilityId": this.props.facilityName,
      "checklists": this.state.checklists,
      "configurations": [
        { name: "complianceGoal", "value": complianceGoal },
        { name: "engagementGoal", "value": engagementGoal },
        { name: "qualityGoal", "value": qualityGoal }
      ]
    }
    this.setState({ isLoading: true }, () => {
      this.props.submit(jsonBody).then(() => {
        this.setState({
          isChanged: false,
          isLoading: false
        })
      })
    })

  }
  reset() {
    const { sscConfig } = this.props;
    const { complianceGoal, engagementGoal, qualityGoal } = sscConfig || {};
    this.setState({
      checklists: JSON.parse(JSON.stringify(sscConfig && sscConfig.checklists)),
      isChanged: false,
      complianceGoal,
      engagementGoal,
      qualityGoal
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
    const { sscConfig } = this.props;
    const { complianceGoal, engagementGoal, qualityGoal } = sscConfig || {};
    const orderBy = { "Briefing": 1, "Timeout": 2, "Debriefing": 3 };
    return (
      <section className={`ssc-settings-page ${this.props.hasEMR && 'has-emr'}`}>

        <div className="title">
          General
        </div>
        <div className="subtitle">
          Setting Goals
        </div>
        <div className="content">
          Set a target goal for each of the Surgical Safety Checklist scores.
        </div>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Goal
                title={"Compliance Score"}
                tooltip={"Compliance Score is the average of 1) the percentage of checklist phases performed and 2) the percentage of the checklist phases performed at the correct time. Each procedure requires one Briefing, one Timeout, and one Debriefing."}
                goal={this.state.complianceGoal}
                currentGoal={complianceGoal}
                onChange={(title, goal) => this.updateGoal(title, goal)}
              />
              <Goal
                title={"Engagement Score"}
                tooltip={"Engagement Score is the average of 1) the attendance percentage out of the minimum number of people required during performed checklist phases and 2) the percentage of those in attendance who paused during performed checklist phases."}
                goal={this.state.engagementGoal}
                currentGoal={engagementGoal}
                onChange={(title, goal) => this.updateGoal(title, goal)}
              />
              <Goal
                title={"Quality Score"}
                tooltip={"Quality Score is the percentage of priority items discussed for all performed checklist phases."}
                goal={this.state.qualityGoal}
                currentGoal={qualityGoal}
                onChange={(title, goal) => this.updateGoal(title, goal)}
              />
            </Grid>
          </Grid>
        </div>

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
            {checklist.phases.sort((a, b) => orderBy[a.phaseName] - orderBy[b.phaseName]).map((phase, pIndex) => (
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