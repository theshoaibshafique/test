import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import moment from 'moment/moment';
import CaseDuration from '../icons/CaseDuration.svg';
import eMM from '../icons/eMM.svg';
import FirstCase from '../icons/FirstCase.svg';
import Flagged from '../icons/Flag.svg';
import Hypotension from '../icons/Hypotension.svg';
import Hypothermia from '../icons/Hypothermia.svg';
import Hypoxia from '../icons/Hypoxia.svg';
import LateStart from '../icons/LateStart.svg';
import PostOpDelay from '../icons/PostOpDelay.svg';
import PreOpDelay from '../icons/PreOpDelay.svg';
import TurnoverDuration from '../icons/TurnoverDuration.svg';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { FormControlLabel, InputLabel, makeStyles, RadioGroup, Tab, Tabs, TextField, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import { LightTooltip, StyledRadio } from '../../../components/SharedComponents/SharedComponents';

export function getTag(tag) {
  switch (`${tag}`.toLowerCase()) {
    case "flagged":
      return <img src={Flagged} style={{ height: 24, width: 24 }} />
    case "hypothermia":
      return <img src={Hypothermia} />
    case "hypoxia":
      return <img src={Hypoxia} />
    case "hypotension":
      return <img src={Hypotension} />
    case "long procedure":
    case "long case":
      return <img src={CaseDuration} />
    case "case delay":
    case "late start":
      return <img src={LateStart} />
    case "slow turnover":
      return <img src={TurnoverDuration} />
    case "late first case":
    case "first case":
      return <img src={FirstCase} />
    case "eM&M":
      return <img src={eMM} />
    case "slow post-op":
      return <img src={PostOpDelay} />
    case "slow pre-op":
      return <img src={PreOpDelay} />
    default:
      break;
  }
}

export function displayTags(tags, emrCaseId, isShort, detailed = null) {
  //Helper function that creates the tag
  const createTag = (tag, desc, i) => (
    <LightTooltip key={`${tag}-${i}`} title={(isShort ? [`${tag}:`,...desc]:desc).map((line, i) => {
      return <div key={i} style={i==0&&isShort?{marginBottom:4}:{}}>{line}</div>
    })} arrow={true}>
      <span
        className={`case-tag ${tag} log-mouseover`}
        id={`${tag}-tag-${emrCaseId}`}
        description={JSON.stringify({ emrCaseId: emrCaseId, toolTip: desc })}
        key={tag}
      >
        <span>
          {getTag(tag)}
        </span>
        <div className="display">{tag}</div>

      </span>
    </LightTooltip>
  )
  if (detailed) {
    return <TransitionGroup
      component={null}
      appear={false}
      enter={true}
      exit={/*tags.length > 0*/false}
    >
      {
        tags.map((tag, i) => {
          let desc = tag.toolTip || [];
          tag = tag.tagName || tag;
          return (
            <CSSTransition
              key={`${tag}-${i}`}
              classNames="tag-fade"
              timeout={1000}
              appear={true}
              enter={true}
              exit={true}
            >
              {createTag(tag, desc, i)}
            </CSSTransition>
          )
        })
      }
    </TransitionGroup>
  } else {
    return tags.map((tag, i) => {
      let desc = tag.toolTip || [];
      tag = tag.tagName || tag;
      return (
        createTag(tag, desc, i)
      )
    })
  }
}


export const useStyles = makeStyles((theme) => ({
  inputLabel: {
    fontFamily: 'Noto Sans',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30,
    color: '#323232',
    opacity: .8
  },
  inputLabelFlag: {
    fontFamily: 'Noto Sans',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 25,
    color: '#323232',
    opacity: .8
  },
  clear: {
    fontFamily: 'Noto Sans',
    fontSize: 16,
    marginTop: 30,
    color: '#919191',
    opacity: .8,
    cursor: 'pointer'
  },
  search: {
    marginBottom: 10
  },
  sortButton: {
    display: 'block',
    margin: 0
  }
}));

export function TagsSelect(props) {
  const { title, options, id, handleChange, searchData, placeholder, includeToggle, includeAllTags, handleChangeIncludeAllTags, freeSolo, groupBy } = props;
  let [value, setValue] = React.useState(searchData[id]);
  let [includeAll, setIncludeAll] = React.useState(includeAllTags);
  const classes = useStyles();

  useEffect(() => {
    setValue(searchData[id]);
  }, [props.searchData]);

  useEffect(() => {
    setIncludeAll(includeAllTags);
  }, [props.includeAllTags]);

  const filterOptions = (o, state) => {
    // Dont show any options until the user has typed
    const { inputValue } = state;
    if (groupBy && !inputValue) {
      return []
    }
    return o.filter((op) => {
      op = op.display || op
      return `${op}`.toLowerCase().includes(inputValue.toLowerCase())
    })
  };

  return (
    <div>
      <div className="select-header">
        <InputLabel className={classes.inputLabel}>{title}</InputLabel>
        <div hidden={!value || value.length <= 0} className={classes.clear} onClick={() => handleChange(id, [])}>
          Clear
        </div>
      </div>
      <Autocomplete
        multiple
        size="small"
        freeSolo={freeSolo}
        id={id}
        options={options}
        disableClearable
        clearOnEscape
        groupBy={(option) => groupBy}
        filterOptions={filterOptions}
        getOptionLabel={option => option.display || option}
        value={value || []}
        renderTags={() => null}
        onChange={(event, value) => handleChange(id, value)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            name={id}
            placeholder={placeholder}
          />
        )}
      />

      {includeToggle && (value && value.length > 0) && (
        <div className="include-toggle">
          <RadioGroup aria-label="position" name="position" value={includeAll}>
            <FormControlLabel value={0} control={<StyledRadio checked={includeAll == 0} color="primary" onChange={(e) => handleChangeIncludeAllTags(e.target.value)} />} label={<span className="include-label">Matches any of these tags</span>} />
            <FormControlLabel value={1} control={<StyledRadio checked={includeAll == 1} color="primary" onChange={(e) => handleChangeIncludeAllTags(e.target.value)} />} label={<span className="include-label">Matches all of these tags</span>} />
          </RadioGroup>
        </div>
      )}

      {value && value.length > 0 && <div className="tags">
        {value.map((tag, i) => {
          return (
            <span key={i} className={"tag"} >
              <span><div className="display">{tag.display || tag}</div></span>
              <span>
                <CloseIcon fontSize='small' className='delete' onClick={(a) => {
                  handleChange(id, value.filter(function (value, arrIndex) {
                    return i !== arrIndex;
                  }))
                }} />
              </span>

            </span>
          )
        })}
      </div>}
    </div>
  )
}

export const StyledTabs = withStyles({
  root: {
    marginTop: '2em'
  },
  indicator: {
    display: 'none'
  },
  flexContainer: {
    justifyContent: 'center'
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 18,
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    color: '#BCBCBC',
    '&:focus': {
      opacity: 1,
    },

  },
  selected: {
    color: '#004F6E !important'
  }
}))((props) => <Tab disableRipple {...props} />);

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      // TODO: find a better way to hide "OVERVIEW" page
      // We always keep Overview (index =0) rendered because the carousels glitch otherwise
      hidden={value !== index && index!=0}
      style={value !== index && index==0 ? {position:'absolute', left:-10000} : {}}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}