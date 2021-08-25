/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import 'c3/c3.css';
import C3Chart from 'react-c3js';
import './style.scss';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Tooltip, withStyles } from '@material-ui/core';
import { DATE_OPTIONS, TAGS, TAG_INFO } from './constants';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MagnifyingGlass from './icons/MagnifyingGlass.svg';
import ArrowsDownUp from './icons/ArrowsDownUp.svg';
import CaseDuration from './icons/CaseDuration.svg';
import eMM from './icons/eMM.svg';
import FirstCase from './icons/FirstCase.svg';
import Flagged from './icons/Flag.svg';
import Hypotension from './icons/Hypotension.svg';
import Hypothermia from './icons/Hypothermia.svg';
import Hypoxia from './icons/Hypoxia.svg';
import LateStart from './icons/LateStart.svg';
import FullPerson from './icons/FullPerson.svg';
import HalfPerson from './icons/HalfPerson.svg';
import EmptyPerson from './icons/EmptyPerson.svg';
import PostOpDelay from './icons/PostOpDelay.svg';
import PreOpDelay from './icons/PreOpDelay.svg';
import Play from './icons/Play.svg';
import TurnoverDuration from './icons/TurnoverDuration.svg';
import Close from './icons/Close.svg';
import Plus from './icons/Plus.svg';
import moment from 'moment/moment';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import { LightTooltip, SSTSwitch, StyledRadio } from '../../components/SharedComponents/SharedComponents';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import globalFunctions, { getCdnStreamCookies } from '../../utils/global-functions';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import ReactDOMServer from 'react-dom/server';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import { isUndefined } from 'lodash';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { log_norm_cdf, log_norm_pdf, formatCaseForLogs, getCasesInView, getQuestionByLocation, getQuestionCount } from './Utils';
import { useSelector } from 'react-redux';
import { makeSelectComplications, makeSelectIsAdmin, makeSelectLogger, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { NavLink } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    fontFamily: 'Noto Sans',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30,
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
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
    },
  },
}

function getTag(tag) {
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

function transformTagValue(tag, value) {
  switch (tag && tag.toLowerCase()) {
    case "hypothermia":
      return value.replace('35°C', '35°C / 95°F');
    default:
      return value;
  }
}

function displayTags(tags, emrCaseId) {
  return tags.map((tag, i) => {
    let desc = tag.toolTip || [];
    tag = tag.tagName || tag;
    return (
      <LightTooltip key={`${tag}-${i}`} title={desc.map((line, i) => {
        return <div key={i}>{line}</div>
      })} arrow={true}>
        <span className={`case-tag ${tag} log-mouseover`} id={`${tag}-tag-${emrCaseId}`} description={JSON.stringify({ emrCaseId: emrCaseId, toolTip: desc })} key={tag}>
          <span>
            {getTag(tag)}
          </span>
          <div className="display">{tag}</div>

        </span>
      </LightTooltip>

    )
  })
}

function Case(props) {
  const { procedures, emrCaseId, wheelsIn, wheelsOut, roomName, tags, onClick, isSaved, handleSaveCase, isShort } = props;
  const sTime = moment(wheelsIn).format("HH:mm");
  const eTime = moment(wheelsOut).format("HH:mm");
  const diff = moment().endOf('day').diff(moment(wheelsIn).endOf('day'), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const { specialtyName, procedureName } = procedures && procedures.length && procedures[0];
  const daysAgo = `${date} (${diff} ${diff == 1 ? 'day' : 'days'} ago)`;
  const tagDisplays = displayTags(tags, emrCaseId);

  const procedureList = [...new Set(procedures.slice(1).map((p) => p.procedureName))];
  const specialtyList = [...new Set(procedures.map((p) => p.specialtyName))];
  const logger = useSelector(makeSelectLogger());
  const handleClick = () => {
    onClick();
    logger.manualAddLog('click', `open-case-${emrCaseId}`, formatCaseForLogs(props))
  }
  const MAX_SHORT_TAGS = 4;
  return (
    <div className={`case ${isShort && 'short'}`} description={JSON.stringify(formatCaseForLogs(props))} key={emrCaseId} onClick={handleClick} >
      <div className="case-header">
        <div className="title" title={procedureName}>
          {procedureName}
        </div>
        <div >
          <IconButton
            className={`save-toggle ${!isSaved && 'not-saved'}  ${isShort && 'short-icon'}`} onClick={(e) => { e.stopPropagation(); handleSaveCase() }}
            style={{ marginTop: -6, marginBottom: -11 }} title={isSaved ? "Remove from saved cases" : "Save case"}>
            {isSaved ? <StarIcon style={{ color: '#EEDF58', fontSize: 29 }} /> : <StarBorderIcon style={{ color: '#828282', fontSize: 29 }} />}
          </IconButton>

        </div>
      </div>

      {procedureList.length > 0 && (
        <div className="description additional-procedure">
          {`Additional Procedure${procedureList.length == 1 ? '' : 's'}`}
          <LightTooltip arrow title={
            <div>
              <span>{`Additional Procedure${procedureList.length > 1 ? 's' : ''}`}</span>
              <ul style={{ margin: '4px 0px' }}>
                {procedureList.map((line, index) => { return <li key={index}>{line}</li> })}
              </ul>
            </div>
          }>
            <InfoOutlinedIcon className="log-mouseover" id={`additional-procedure-tooltip-${emrCaseId}`} description={JSON.stringify({ emrCaseId: emrCaseId, toolTip: procedureList })} style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
          </LightTooltip>
        </div>
      )
      }

      <div className="subtitle" title={specialtyList.join(" & ")}>
        {!isShort && <span>{roomName} • </span>}{specialtyList.join(" & ")}
      </div>
      <div className="description">
        {!isShort && <span>Case ID: {emrCaseId}</span>}
        <span title={daysAgo}>{daysAgo}</span>
        {!isShort && <span>{sTime} - {eTime}</span>}

      </div>
      {tagDisplays.length > 0 && <div className="tags">
        {isShort && tagDisplays.length > MAX_SHORT_TAGS ? (
          <span className="plus-text subtext">
            {tagDisplays.slice(0, MAX_SHORT_TAGS)}
            <span style={{ opacity: .8 }} >+{tagDisplays.length - MAX_SHORT_TAGS}</span>
          </span>
        ) : tagDisplays}
      </div>}
    </div>
  )
}

function TagsSelect(props) {
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

const getPresetDates = (option) => {
  switch (option) {
    case 'Any Time':
      return { from: moment("2019-08-15"), to: moment('2022-04-04') }
    case 'Past week':
      return { from: moment().subtract(7, 'days'), to: moment() }
    case 'Past month':
      return { from: moment().subtract(1, 'months'), to: moment() }
    case 'Past year':
      return { from: moment().subtract(1, 'years'), to: moment() }
    default:
      return {}
  }
}

const searchReducer = (state, event) => {
  if (event.name == 'date-clear') {
    event.name = 'date'
  } else if (event.name == 'date') {
    event.value = {
      selected: event.value.key,
      ...getPresetDates(event.value.key)
    }
  } else if (event.name == 'custom-to') {
    event.name = 'date'
    event.value = {
      ...state.date,
      to: event.value,
    }

  } else if (event.name == 'custom-from') {
    event.name = 'date'
    event.value = {
      ...state.date,
      from: event.value
    }
  }
  const logger = event.logger;
  logger && logger.manualAddLog('onchange', event.name, event.value)
  return {
    ...state,
    [event.name]: event.value
  }
}

const dataReducer = (state, event) => {
  return {
    ...state,
    ...event
  }
}

export default function CaseDiscovery(props) { // eslint-disable-line react/prefer-stateless-function
  const { showEMMReport } = props;

  const [DATA, setData] = useReducer(dataReducer, {
    CASES: [],
    SPECIALTIES: [],
    PROCEDURES: [],
    ORS: [],
    isLoading: true,
    savedCases: [],
    facilityName: "",
    gracePeriod: 0,
    outlierThreshold: 0
  });
  const { CASES, SPECIALTIES, PROCEDURES, ORS, isLoading, savedCases } = DATA;
  const { facilityName, gracePeriod, outlierThreshold } = DATA;
  const [USERS, setUsers] = useState([]);
  const [numShownCases, setNumShownCases] = React.useState(10);
  /*** NEW - Flag Submission state ***/
  const [openAddFlag, setOpenAddFlag] = useState(false);
  const [flagReport, setFlagReport] = useState(null);

  const [flagReportLocation, setFlagReportLocation] = useState([0]);
  const [flagLocationPopped, setFlagLocationPopped] = useState(false);
  const [flagData, setFlagData] = useState([]);
  const [isFlagChoiceOther, setIsFlagChoiceOther] = useState({});
  const [flagInputOtherValue, setFlagInputOtherValue] = useState({});
  const [choiceOtherOptionObject, setChoiceOtherOptionObject] = useState(null);
  const [choiceOtherInputActive, setChoiceOtherInputActive] = useState(true);
  const [roomIds, setRoomIds] = useState(null);

  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());
    // console.log('CASES', CASES);
  useEffect(() => {
    if (!logger) {
      return;
    }
    logger.manualAddLog('session', 'open-case-discovery');
    logger.exitLogs.push(['session', 'close-case-discovery', "Exited/Refreshed page"]);
    return () => {
      if (!logger) {
        return
      }
      logger.exitLogs = [];
      logger.manualAddLog('session', 'close-case-discovery', "Redirected page");
    }
  }, [logger])

  useEffect(() => {
    if (!CASES || CASES.length <= 0 || !logger) {
      return;
    }
    logger.manualAddLog('session', 'initial-cases', CASES.slice(0, numShownCases).map(formatCaseForLogs))

    //Log the initial cases in view
    logger.manualAddLog('session', 'cases-in-view', getCasesInView());

    // Setup scrolling variable
    let isScrolling;
    const casesWindow = document.getElementById('cases-id');

    // Listen for scroll events
    casesWindow.addEventListener('scroll', (event) => {

      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(() => {
        logger.manualAddLog('scroll', 'cases-in-view', getCasesInView());
      }, 66);

    }, false);

  }, [CASES])

  // Load all the APIs 
  useEffect(() => {
    const fetchUsers = async () => {
      const result = await globalFunctions.axiosFetch(process.env.EMMREPORT_API + '/emm_users', 'get', userToken, {})
        .then(result => {
          result = result.data
          setUsers(result);

        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
    }

    const fetchFacilityConfig = async () => {
      const result = await globalFunctions.axiosFetch(process.env.EFFICIENCY_API + "/config?facility_id=" + userFacility, 'get', userToken, {})
        .then(result => {
          result = result.data;
          const { facilityName, fcotsThreshold, turnoverThreshold } = result;

          // Set roomIds local state for flag submission.
          setRoomIds(result.filters.ORs);

          setData({
            facilityName: facilityName,
            gracePeriod: fcotsThreshold,
            outlierThreshold: turnoverThreshold
          })
        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
    }

    const fetchCases = async () => {

      return await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'cases?facility_id=' + userFacility, 'get', userToken, {})
        .then(result => {
          result = result.data
          let spec = [];
          let proc = [];
          let ors = [];
          result.forEach((c) => {
            const { procedures, roomName } = c;

            c.procedures = procedures.map((p) => {
              let { specialtyName, procedureName } = p;
              procedureName = procedureName.replace(/,(?=[^\s])/g, ', ');

              if (spec.indexOf(specialtyName) < 0) {
                spec.push(specialtyName);
              }
              if (proc.indexOf(procedureName) < 0) {
                proc.push(procedureName);
              }
              p.procedureName = procedureName
              return p;
            });
            if (ors.indexOf(roomName) < 0) {
              ors.push(roomName);
            }
          });
          result.sort((a, b) => moment(b.wheelsIn).valueOf() - moment(a.wheelsIn).valueOf())
          setData({
            CASES: result,
            SPECIALTIES: spec.sort(),
            PROCEDURES: proc.sort(),
            ORS: ors.sort(),
            isLoading: false
          })

        }).catch((error) => {
          console.log("uh oh")
        })

    }
    console.log('cases', CASES)
    const fetchSavedCases = async () => {
      await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + "bookmarks", 'get', userToken, {})
        .then(result => {
          result = result.data;
          setData({
            'savedCases': result
          })
        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
    }

     // New
    const fetchFlagReport = async () => {
      await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'flag_report', 'get', userToken, {})
        .then(result => {
          result = result.data;
          setFlagReport(result);
        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
    }

    fetchCases();

    fetchUsers();

    fetchFacilityConfig();
    fetchSavedCases();
    //  New
    fetchFlagReport();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
  });

  /***  Flag submission useEffect hooks ***/

  // Set initial value of flagData array when component first mounts, thus rendering the first flag question.
  useEffect(() => {
    if(flagReportLocation.length > 0 && flagReport) {
      let currentFlagQuestion;
      // 1. Retrieve current question from the flagReport, based on the flagReportLocation value.
      currentFlagQuestion = getQuestionByLocation(flagReport, flagReportLocation);
      // 2. Update the flagData piece of state based on the current flag question value.
      if(currentFlagQuestion) setFlagData([{ ...currentFlagQuestion, location: flagReportLocation, completed: false, choices: [] }]);
    }
  }, [flagReport]);

  // Update flagData array if necessary when flagReportLocation changes.
  useEffect(() => {
    if(flagReportLocation.length > 0 && flagReport && !flagLocationPopped) {
      const nextQuestion = getQuestionByLocation(flagReport, flagReportLocation);
      // console.log('next question in hook', nextQuestion)
      const transformedNextQuestion = { ...nextQuestion, location: flagReportLocation, completed: false, choices: [] };
      if(nextQuestion) {
        const nextQuestionIndex = flagData.findIndex(ques => ques.id === nextQuestion.id || ques.title === nextQuestion.title);
        const updatedFlagData = nextQuestionIndex !== -1 ? [...flagData.slice(0, nextQuestionIndex), transformedNextQuestion] : [...flagData, transformedNextQuestion];
        setFlagData(updatedFlagData);
      }
    }
  }, [flagReportLocation]);

  // Pop last 2 elements of flagReportLocation array off when the current questions array at the current 'level' has no more questions.
  useEffect(() => {
    // if atleast 2 elements have been removed from the end of the flagReportLocation array.
    if(flagLocationPopped && flagReportLocation.length > 0) {
      let updatedLocation = [...flagReportLocation];
      if((getQuestionCount(flagReport, flagReportLocation) - 1) > flagReportLocation[flagReportLocation.length - 1]) {
        let lastLoc = updatedLocation[updatedLocation.length - 1];
        lastLoc += 1;
        updatedLocation[updatedLocation.length - 1] = lastLoc;
        // setFlagReportLocation(updatedFlagLocation);
      } else {
        updatedLocation = updatedLocation.slice(0, -2);
        if(flagReportLocation.length === 0) setFlagLocationPopped(false);
        // setFlagReportLocation(updatedLocation);
      }
      const nextQuestion = getQuestionByLocation(flagReport, updatedLocation);
      let isNextQuestionPresent;
      if(nextQuestion) isNextQuestionPresent = flagData.find(ques => ques.id === nextQuestion.id || ques.title === nextQuestion.title);
      if(nextQuestion && !isNextQuestionPresent) setFlagData(prevState => {
        return [...prevState, { ...nextQuestion, location, location: updatedLocation, completed: false, choices: [] }]
      })
      setFlagReportLocation(updatedLocation);

      // let updatedFlagData = [...flagData];
      // const nextQuestion = getQuestionByLocation(flagReport, updatedLocation);
      // console.log('next ques pop hook', nextQuestion)
      // if(nextQuestion) {
      //   const nextQuestionIndex = updatedFlagData.findIndex(ques => ques.id === nextQuestion.id || ques.title === nextQuestion.title);
      //   if(nextQuestionIndex === -1) {
      //     updatedFlagData = updatedFlagData.concat({ ...nextQuestion, location: updatedLocation, completed: false, choices: [] });
      //     // TODO,moy not be needed, remove.
      //   } else {
      //     updatedFlagData;
      //     console.log('next question in pop effect', updatedFlagData[nextQuestionIndex]);
      //     updatedFlagData[nextQuestionIndex] = { ...nextQuestion, location: updatedLocation, completed: false, choices: [] };
      //   }
      //   // console.log('updated location useEffect hook', updatedLocation);
      //   setFlagData(updatedFlagData);
      // }
    }
  }, [flagLocationPopped, flagReportLocation.length]);

  /*** FLAG SUBMISSION HANDLERS ***/
  const handleOpenAddFlag = open => {
    setOpenAddFlag(open);
    // Reset all flag submission state to defaults.
    setFlagReportLocation([0]);
    setFlagLocationPopped(false);
    setFlagData([]);
    setIsFlagChoiceOther({});
    setFlagInputOtherValue({});
    setChoiceOtherOptionObject(null);
    setChoiceOtherInputActive(true);
  };

  const handleFlagInputChange = (event, title)  => {
    const val = event.target.value;

    setFlagInputOtherValue(prevState => ({ ...prevState, [title]: val }));
    // scrollToTop();
  };
  // console.log('input val', flagInputOtherValue);
  // Render flag submission question based on question type property value.
  const renderFlagQuestion = flagData => {
    if(flagData) {
      switch(flagData.type.toLowerCase()) {
        case 'single-choice':
        case 'multiple-choice':
          // TODO: render select list.
          return (
            <React.Fragment>
              <FlagSelect
                key={flagData.title}
                title={flagData.title}
                options={flagData.options.map(opt => opt.type === 'choice-other' ? { ...opt, title: 'Other - Please specify'} : opt).sort((a, b) => a.optionOrder - b.optionOrder)}
                questionType={flagData.type}
                onSelect  ={handleFlagSelect}
                isRequired={flagData.isRequired}
                setIsFlagChoiceOther={setIsFlagChoiceOther}
                questionId={flagData.id}
                setChoiceOtherOptionObject={setChoiceOtherOptionObject}
                // disabled={isFlagOtherChecked[flagData.id]}
              />
       
              {isFlagChoiceOther[flagData.id] && 
                (<React.Fragment>
                  <div className="select-header">
                    <InputLabel className={classes.inputLabel}>Other</InputLabel>
                  </div>

                  <MemoizedFlagTextInput 
                    choiceOtherInputActive={choiceOtherInputActive}
                    flagData={flagData}
                    choiceOtherOptionObject={choiceOtherOptionObject}
                    handleChoiceOtherSelect={handleChoiceOtherSelect}
                    setChoiceOtherInputActive={setChoiceOtherInputActive}
                  />
                </React.Fragment>
                )
              }
            </React.Fragment>

          )
        case 'input':
          // render AddFlagInput
          // pass down the option type to render correct input type. i.e. date / datetime / integer/ float /freetext
          return 'input';
        default:
          return null;
      }
    }
  };

  const handleChoiceOtherSelect = (questionId, optionText, optionObject) => {
    // setIsFlagChoiceOther(prevState => ({ ...prevState, questionId: true }));
    if(optionText) {
      // Update current question in flagData.
      const updatedFlagData = [...flagData];
      const currentQuesIdx = flagData.findIndex(ques => ques.id === questionId);
      const currentQuesLoc = flagData[currentQuesIdx].location;
      let updatedLocation = [...currentQuesLoc];
      updatedFlagData[currentQuesIdx] = { ...updatedFlagData[currentQuesIdx], completed: true, choices: [{ ...optionObject, attribute: optionText }]};
      setFlagData(updatedFlagData);

      // After submit make text input none editable.
      if(choiceOtherInputActive) setChoiceOtherInputActive(false);

      // Update Location to add next question to flagData array.
      const nextQuestionsArray = getQuestionByLocation(flagReport, [...updatedLocation, optionObject.optionIndex]);
      // console.log(nextQuestionsArray);
      if(nextQuestionsArray.questions) {
        updatedLocation = [...updatedLocation, optionObject.optionIndex, 0];
        setFlagReportLocation(updatedLocation);
        // setFlagReportLocation(prevState => [...prevState, optionObject.optionIndex, 0]);
      } else {
        const questionCount = getQuestionCount(flagReport, flagReportLocation) - 1;
        if(questionCount > currentQuesLoc[currentQuesLoc.length - 1]) {
          let lastLocEl = updatedLocation[updatedLocation.length - 1];
          lastLocEl = lastLocEl + 1;
          updatedLocation[updatedLocation.length - 1] = lastLocEl;
          setFlagReportLocation(updatedLocation);
        } else {
          updatedLocation = updatedLocation.slice(0, -2);
          setFlagReportLocation(updatedLocation);
          setFlagLocationPopped(true);
        }
      }
    }
  };

  // Handle flag option selection
  const handleFlagSelect = (questionType, questionId, questionTitle, optionObject) => {
    const currentQuestionIndex = flagData.findIndex(ques => ques.id === questionId);
    if(flagData[currentQuestionIndex].choices.find(choice => choice.id === optionObject.id)) {
      // Do nothing,no need to update flagReportLocation.
      return;
    } else {
      // Handle selection of choice-other option type.
      if(optionObject.type && optionObject.type.toLowerCase() === 'choice-other') {
        console.log('')
        setIsFlagChoiceOther(prevState => ({ ...prevState, questionId: true }));
        // Make sure text field is editable.
        if(!choiceOtherInputActive) setChoiceOtherInputActive(prevState => !prevState);
        // handleChoiceOtherSelect(questionId, '', optionObject)
      // Handle selection of standard 'choice' option type.
      } else {
        
        if(flagData[currentQuestionIndex].choices.length > 0) setFlagLocationPopped(false);
        // TODO: refactor.
        let updatedFlagData = [...flagData];
        let nextQuestion;
        updatedFlagData = updatedFlagData.map(ques => ques.id === questionId ? { ...ques, completed: true, choices: [{ ...optionObject, attribute: null }] } : ques);
        // console.log('updated flag data in flagSelect', updatedFlagData);
    
        let updatedLocation = [...flagData[currentQuestionIndex].location, optionObject.optionIndex];
      
        const selectedOpt = getQuestionByLocation(flagReport, updatedLocation);
        // console.log('netx q array', selectedOpt)
        if(selectedOpt.questions) {
          updatedLocation = updatedLocation.concat(0);
          // console.log('updated location in handleFlagSelect', updatedLocation);
          // nextQuestion = getQuestionByLocation(flagReport, updatedLocation);
          // updatedFlagData = updatedFlagData.concat({ ...nextQuestion, location: updatedLocation, completed: false, choices: [] });
          setFlagReportLocation(updatedLocation);
          // console.log('update flag data', updatedFlagData);
          // setFlagData(updatedFlagData);
        } else {
          const currentQuestionCount = getQuestionCount(flagReport, flagReportLocation) - 1;
          updatedLocation.pop();
          if(currentQuestionCount > flagReportLocation[flagReportLocation.length - 1]) {
            const tempLocation = [...updatedLocation];
            let lastLocEl = tempLocation[tempLocation.length - 1];
            lastLocEl = lastLocEl + 1;
            tempLocation[tempLocation.length - 1] = lastLocEl; 
            // nextQuestion = getQuestionByLocation(flagReport, tempLocation);
            // updatedFlagData = updatedFlagData.concat({ ...nextQuestion, location: tempLocation, completed: false, choices: [] });
            // setFlagData(updatedFlagData);
            setFlagReportLocation(tempLocation);
          } else {
    
            setFlagReportLocation(updatedLocation.slice(0, -2));
            setFlagLocationPopped(true);
          }
      }
      setFlagData(updatedFlagData);
  
      }

    }
    // TODO: break out in FN.
    // nextQuestion = getQuestionByLocation(flagReport, updatedLocation);
    // // console.log('next question', nextQuestion);
    // // console.log('updated Location', updatedLocation);
    // const nextQuestionIndex = flagData.findIndex(ques => ques.id === nextQuestion.id || ques.title === nextQuestion.title);
    // if(nextQuestionIndex === -1) {
    //   updatedFlagData = flagData.concat({ ...nextQuestion, location: updatedLocation, completed: false, choices: [] });
    //   // setFlagData(updatedFlagData);
    // } else {
    //   // updatedFlagData = [...flagData];
    //   updatedFlagData[nextQuestionIndex] = { ...nextQuestion, location: updatedLocation, completed: false, choices: [] };
    //   // setFlagData(updatedFlagData);
    // }
    
  };

  // Handle updating a previously completed flag's option(s).
  const handleFlagUpdate = (questionType, questionId, questionTitle, optionObject) => {
    let updatedLocation = [...flagReportLocation];
    let updatedFlagData = [...flagData];
    const currQuestionIndex = updatedFlagData.findIndex(ques => ques.id === questionId);
    const currentQuestion = flagData[currQuestionIndex];

    updatedFlagData = updatedFlagData.map(ques => ques.id === questionId ? { ...ques, completed: true, choices: [{ ...optionObject, attribute: null }] } : ques);

    // console.log('current question in handleFlagUpdate', currentQuestion);
    let nextQuestion = getQuestionByLocation(flagReport, [...currentQuestion.location, optionObject.optionIndex]).questions;
    if(nextQuestion) {
      // updatedFlagData[currQuestionIndex] = { ...updatedFlagData[currQuestionIndex], completed: true, choices: [{ ...optionObject, attribute: null }]};
      updatedFlagData = updatedFlagData.slice(0, (currQuestionIndex + 1)).concat({ ...nextQuestion[0], location: [...currentQuestion.location, optionObject.optionIndex, 0], completed: false, choices: [] });
      // console.log('next question in handleFlagupdate', nextQuestion);
      setFlagData(updatedFlagData);
    } else {
      const questionCount = getQuestionCount(flagReport, currentQuestion.location) - 1;
      if(questionCount > currentQuestion.location[currentQuestion.location.length - 1]) {
        let newLocation = [ ...currentQuestion.location];
        const lastLoc = newLocation.pop();
        newLocation = [...newLocation, lastLoc + 1];
        nextQuestion = getQuestionByLocation(flagReport, newLocation);
        updatedLocation = newLocation;
        // updatedFlagData[currQuestionIndex] = { ...updatedFlagData[currQuestionIndex], completed: true, choices: [{ ...optionObject, attribute: null }]};
        updatedFlagData = updatedFlagData.slice(0, (currQuestionIndex + 1)).concat({ ...nextQuestion, location: newLocation, completed: false, choices: [] });
        setFlagReportLocation(updatedLocation);
      } else {
        updatedLocation = currentQuestion.location.slice(0, -2);
        setFlagReportLocation(updatedLocation);
        setFlagLocationPopped(true);
      }
      setFlagData(updatedFlagData);
    }
  };

  // Submit flag.
  const handleFlagSubmit = (flag, handleSetIsFlagSubmitted) => {
      globalFunctions.axiosFetchWithCredentials(process.env.CASE_DISCOVERY_API + 'case_flag', 'post', userToken, flag)
        .then(result => {
          result = result.data;
          handleSetIsFlagSubmitted(true);
        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
  };

  // Scrol to top on filter change 
  const topElementRef = useRef(null)
  const scrollToTop = () => {
    topElementRef.current.scrollIntoView(true);
    document.getElementById("cases-id").scrollTop -= 100;
    //Log the top elements manually after animation
    setTimeout(() => {
      logger && logger.manualAddLog('scroll', 'cases-in-view', getCasesInView());
    }, 1000)
  }

  //TODO: replace min/maxDate
  const minDate = moment().subtract(100, 'years');
  const maxDate = moment();

  const classes = useStyles();
  const defaultDate = {
    selected: DATE_OPTIONS[0],
    from: minDate,
    to: maxDate
  };
  const [searchData, setSearchData] = useReducer(searchReducer, {
    date: defaultDate,
    caseId: "",
    specialties: [],
    procedures: [],
    tags: [],
    roomNames: [],
    onlySavedCases: false
  });

  const handleSaveCase = async (caseId) => {
    const isSav = savedCases.includes(caseId);
    await globalFunctions.axiosFetch(`${process.env.CASE_DISCOVERY_API}bookmarks?case_id=${caseId}&is_bookmarked=${!isSav}`, 'PUT', userToken, {})
      .then(result => {
        logger && logger.manualAddLog('click', `${isSav ? 'remove' : 'add'}-saved-case`, { caseId: caseId });
        result = result.data;
        setData({
          'savedCases': result
        })
      }).catch((error) => {
        console.log("uh no.")
      });

  }

  // Change/update the filter
  const handleChange = (event, value) => {
    scrollToTop();

    setSearchData({
      name: event,
      value: value,
      logger: logger
    })
  }


  const specialties = searchData.specialties.map((s) => s.display || s)
  const procedures = searchData.procedures.map((s) => s.display || s)
  const roomNames = searchData.roomNames.map((s) => s.display || s)
  const { to, from } = searchData.date;
  // for any
  const [includeAllTags, setIncludeAllTags] = React.useState(0);

  const handleChangeIncludeAllTags = (includeAllTags) => {
    logger && logger.manualAddLog('click', 'match-tags', includeAllTags == 1 ? 'Matches all tags' : 'Matches any tags');
    setIncludeAllTags(includeAllTags)
  }

  //Filter cases
  let filterCases = CASES.filter((c) => {
    let cTags = c.tags.map((t) => t.tagName);
    //Filter for which cases should be INCLUDED
    return (
      (`${c.emrCaseId}`.includes(searchData.caseId)) &&
      (!from || moment(c.wheelsIn).isAfter(moment(from).startOf('day'))) &&
      (!to || moment(c.wheelsOut).isBefore(moment(to).endOf('day'))) &&
      //given the filtered `specialties` list - check that the case has at least ONE matching specialty (including secondary specialties)
      (!specialties.length || c.procedures && c.procedures.some((p) => specialties.includes(p.specialtyName))) &&
      //Given the filtered `procedures` list match every item with at least one procedure (including secondary procedures)
      (!procedures.length || procedures.every((p) => c.procedures && c.procedures.some(pr => pr.procedureName.toLowerCase().includes(p.toLowerCase())))) &&
      (!roomNames.length || roomNames.includes(c.roomName)) &&
      (!searchData.tags.length || (includeAllTags == 1 && searchData.tags.every((t) => cTags.includes(t))) || (includeAllTags == 0 && cTags.some((t) => searchData.tags.includes(t)))) &&
      (!searchData.onlySavedCases || (savedCases.includes(c.caseId)))
    );
  })

  // for Sorting the cases
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Check if sorting by oldest
  const [isOldest, setIsOldest] = React.useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    if (!isUndefined(event.target.value)) {
      logger && logger.manualAddLog('click', 'sort-cases', event.target.value ? 'oldest to recent' : 'recent to oldest');
      setIsOldest(event.target.value)
    }

  };
  if (isOldest) {
    filterCases = filterCases.reverse()
  }

  const isCustomDate = searchData.date.selected == "Custom";

  const urlParams = new URLSearchParams(window.location.search)
  //Open the caseId through URL
  const manualCaseId = urlParams.get('caseId')
  //Remove from URL
  if (manualCaseId) {
    window.history.pushState({}, document.title, window.location.pathname);
  }
  // Set CaseID for detailed case view
  const [caseId, setCaseId] = React.useState(manualCaseId);
  const handleChangeCaseId = (cId) => {
    //Handle close case
    if (!cId && DETAILED_CASE) {
      const emrCId = DETAILED_CASE.metaData && DETAILED_CASE.metaData.emrCaseId;
      const oldCase = CASES.find((c) => c.emrCaseId == emrCId);

      logger && logger.manualAddLog('click', `close-case-${emrCId}`, formatCaseForLogs(oldCase));

      setTimeout(() => {
        logger && logger.manualAddLog('session', 'cases-in-view', getCasesInView());
      }, 300)
    }
    setCaseId(cId);
  }

  const [showTagsModal, setShowTagsModal] = React.useState(false);

  const handleShowTagsModal = (show) => {
    if (!show) {
      logger && logger.manualAddLog('click', 'close-learn-more-tags', null);
    }
    setShowTagsModal(show);
  }


  const getCasesView = () => {
    if (filterCases && filterCases.length) {

      return (
        <TransitionGroup>{
          filterCases.map((c, i) => (
            <CSSTransition
              key={c.caseId}
              timeout={500}
              classNames="item"
            >
              <Case key={i} onClick={() => handleChangeCaseId(c.caseId)} {...c} isSaved={savedCases.includes(c.caseId)} handleSaveCase={() => handleSaveCase(c.caseId)} />
            </CSSTransition>
          )).slice(0, numShownCases)
        }</TransitionGroup>
      )
    }
    return (
      <div className="no-cases">
        <div className="title">
          Nothing matches your search
        </div>
        <div className="subtitle">
          Remove any filters, or search for
        </div>
        <div className="subtitle">
          something less specific.
        </div>
      </div>
    )
  }

  // console.log('flagReport',flagReport);
  // console.log('flagData',flagData);
  // console.log('location',flagReportLocation);
  const renderTagInfo = () => {
    const result = []
    const tag_info = TAG_INFO;
    const isAdmin = makeSelectIsAdmin();
    let transformedValue;
    const updateInAdmin = isAdmin && (
      <span>
        (<NavLink to={"/adminPanel/1"} className='link admin-link'>
          update in Admin Panel
        </NavLink>)
      </span>)
    tag_info['Late First Case'] = (
      <span>
        {`Identifies cases that were the first case of the block and had a late start beyond the ${facilityName} specified grace period of ${globalFunctions.formatSecsToTime(gracePeriod, true, true).length > 2 ? globalFunctions.formatSecsToTime(gracePeriod, true, true) : '0 min '}`}
        {updateInAdmin}
      </span>)
    tag_info['Slow Turnover'] = (
      <span>
        {`Identifies cases where turnover time preceding case was above ${facilityName} defined outlier threshold of ${globalFunctions.formatSecsToTime(outlierThreshold, true, true)}`}
        {updateInAdmin}
      </span>
    );
    for (const [tag, value] of Object.entries(tag_info)) {
      result.push(
        <Grid item xs={3} className="tag-column" key={`${tag}-${value}`}>
          <div className="info-tag">
            <span className={`case-tag ${tag}`} key={tag}>
              <span>
                {getTag(tag)}
              </span>
              <div className="display">{tag}</div>
            </span>
          </div>
        </Grid>
      );
      transformedValue = transformTagValue(tag, value);
      result.push(<Grid item xs={9} className="info-column" key='info-col'>{transformedValue}</Grid>);
    }

    return (

      <Grid container spacing={0} className="subtle-subtext">
        {result}
      </Grid>

    )
  }

  const searchView = (
    <Grid container spacing={0} className="case-discovery-search">
      <Grid item xs={3} className="filters">
        <TextField
          size="small"
          fullWidth
          id="filled-start-adornment"
          className={classes.search}
          placeholder="Search case ID"
          onChange={(e, v) => handleChange('caseId', e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><img src={MagnifyingGlass} /></InputAdornment>,
          }}
          variant="outlined"
        />

        <div className="show-only-saved">
          <FormControlLabel
            control={
              <Checkbox
                disableRipple
                className="checkbox"
                icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                checked={searchData.onlySavedCases} onChange={(e) => handleChange('onlySavedCases', e.target.checked)} />
            }
            label={<span className="label">Show only saved cases</span>}
          />

        </div>

        <div className="select-header">
          <InputLabel className={classes.inputLabel}>Date</InputLabel>
          <div hidden={searchData.date.selected == "Any Time"} className={classes.clear} onClick={(e, v) => handleChange('date-clear', defaultDate)}>
            Clear
          </div>
        </div>
        <FormControl variant="outlined" size="small" fullWidth>
          <Select
            id="date"
            variant="outlined"
            MenuProps={MenuProps}
            value={searchData.date.selected}
            onChange={(e, v) => handleChange('date', v)}
          >
            {DATE_OPTIONS.map((index) => (
              <MenuItem key={index} value={index}>
                {index}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isCustomDate && (
          <div className="custom-dates">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className="start-date">
                <InputLabel className={classes.inputLabel}>From</InputLabel>
                <DatePicker
                  disableToolbar
                  size="small"
                  variant="inline"
                  format="MM/dd/yyyy"
                  name="startDate"
                  minDate={minDate}
                  maxDate={searchData.date.to || maxDate}
                  placeholder="Pick Date"
                  inputVariant="outlined"
                  className="custom-date"
                  autoOk
                  value={searchData.date.from || null}
                  inputProps={{ autoComplete: 'off' }}
                  onChange={(e, v) => handleChange('custom-from', e)}
                  id="startDate"
                />
              </div>
              <div className="end-date">
                <InputLabel className={classes.inputLabel}>To</InputLabel>
                <DatePicker
                  disableToolbar
                  size="small"
                  variant="inline"
                  format="MM/dd/yyyy"
                  name="endDate"
                  minDate={searchData.date.from || minDate}
                  maxDate={maxDate}
                  placeholder="Pick Date"
                  inputVariant="outlined"
                  className="custom-date"
                  autoOk
                  value={searchData.date.to || null}
                  inputProps={{ autoComplete: 'off' }}
                  onChange={(e, v) => handleChange('custom-to', e)}
                  id="endDate"
                />
              </div>

            </MuiPickersUtilsProvider>
          </div>

        )}

        <TagsSelect
          title="Procedure"
          placeholder="Search by procedure"
          options={PROCEDURES}
          id="procedures"
          freeSolo={true}
          groupBy="Suggested"
          handleChange={handleChange}
          searchData={searchData}
        />

        <TagsSelect
          title="Specialty"
          placeholder="Filter by specialty"
          options={SPECIALTIES}
          id="specialties"
          handleChange={handleChange}
          searchData={searchData}
        />


        <TagsSelect
          title="Operating Room"
          placeholder="Filter by OR"
          options={ORS}
          id="roomNames"
          handleChange={handleChange}
          searchData={searchData}
        />

        <TagsSelect
          title={<div>Tags (<span className="link log-click" id="learn-more-tags" onClick={() => handleShowTagsModal(true)}>Learn More</span>)</div>}
          placeholder="Filter by tags"
          options={TAGS}
          id="tags"
          handleChange={handleChange}
          searchData={searchData}
          includeToggle={true}
          includeAllTags={includeAllTags}
          handleChangeIncludeAllTags={handleChangeIncludeAllTags}
        />

        <Modal
          open={showTagsModal}
          onClose={() => handleShowTagsModal(false)}
        >
          <div className="Modal tag-info-modal">
            <div className="close-button">
              <img src={Close} onClick={() => handleShowTagsModal(false)} />
            </div>
            <div className="header">
              Case Tags
            </div>
            {renderTagInfo()}
            <div className="close">
              <Button disableElevation disableRipple
                variant="contained" className="primary"
                onClick={() => handleShowTagsModal(false)}>
                Close
              </Button>
            </div>
          </div>


        </Modal>

      </Grid>
      <Grid item xs={9} className="case-container">
        <RecommendedCases
          savedCases={savedCases}
          handleSaveCase={handleSaveCase}
          handleChangeCaseId={handleChangeCaseId}
        />
        <div style={{ position: 'relative' }}>
          <div className="header">
            <div className="header-label">
              {!isLoading && `${filterCases && filterCases.length || 0} Cases`}
            </div>
            <div>
              <Button className={classes.sortButton} onClick={handleClick} disableRipple>
                <div className="header-label"><img src={ArrowsDownUp} />{isOldest ? "Shown by oldest case" : "Shown by most recent"}</div>
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem value={0} onClick={handleClose}>Recent to oldest</MenuItem>
                <MenuItem value={1} onClick={handleClose}>Oldest to most recent</MenuItem>
              </Menu>
            </div>
          </div>
          {isLoading ? <LoadingIndicator /> : (
            <div id="cases-id" className="cases">
              <div ref={topElementRef}></div>
              {getCasesView()}
              {(numShownCases < filterCases.length) && <Button variant="contained" className="load-more" id="load-more" disableElevation onClick={() => {
                setNumShownCases(numShownCases + 10);
                logger && logger.manualAddLog('click', 'load-more', filterCases.slice(numShownCases, numShownCases + 10).map(formatCaseForLogs));
              }}>
                Load More
              </Button>}
            </div>
          )
          }
        </div>

      </Grid>
    </Grid>
  )

  // const [isLoading, setIsLoading] = useState(true);
  const [DETAILED_CASE, setDetailedCase] = useState(null);
  const [reloadCase, setReloadCase] = useState(null);

  // Custom Hook to compare prev state val to current.
  const useCompare = (val) => {
    const prevVal =usePrevious(val);
    return prevVal !== val;
  };

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const hasCaseIdChanged = useCompare(caseId);

  useEffect(() => {
    if (caseId == null) {
      setDetailedCase(null)
      return;
    }

    const fetchCases = async () => {
      const result = await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + `case?facility_id=${userFacility}&case_id=${caseId}`, 'get', userToken, {})
        .then(result => {
          result = result.data
          if (result.metaData && result.metaData.emrCaseId && DETAILED_CASE) {
            const newCase = CASES.find((c) => c.emrCaseId == result.metaData.emrCaseId);
            logger && logger.manualAddLog('click', `swap-case-${result.metaData.emrCaseId}`, formatCaseForLogs(newCase));
          }

          setDetailedCase(result)
          // Update this case object val in the master CASES piece of state.
          setData({
            'CASES': CASES.map(el => el.caseId === caseId ? { ...el, tags: result.tags} : el)
          });
        }).catch((error) => {
          console.log("oh no " + error)
          setCaseId(null)
        }).finally(() => {

        });
    }
    // Refetch case when caseId changes or when reloadCase piece of state changes to true(case is reloaded after a new flag is submitted).
    if(hasCaseIdChanged || reloadCase !== null) {
      fetchCases()
    } 


  }, [caseId, reloadCase]);

  return (
    <section className="case-discovery">
      <div hidden={caseId}>{searchView}</div>
      <DetailedCase {...DETAILED_CASE}
        isSaved={savedCases.includes(caseId)}
        handleSaveCase={() => handleSaveCase(caseId)} USERS={USERS}
        handleChangeCaseId={handleChangeCaseId}
        hidden={!caseId}
        showEMMReport={showEMMReport}
        openAddFlag={openAddFlag} 
        handleOpenAddFlag={handleOpenAddFlag}
        flagData={flagData}
        renderFlagQuestion={renderFlagQuestion}
        flagReport={flagReport}
        setChoiceOtherOptionObject={setChoiceOtherOptionObject}
        choiceOtherOptionObject={choiceOtherOptionObject}
        roomIds={roomIds}
        handleFlagSubmit={handleFlagSubmit}
        setReloadCase={setReloadCase}
      />
    </section>
  );
}

function RecommendedCases(props) {
  const { handleChangeCaseId, savedCases, handleSaveCase } = props;
  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const [CASES, setCases] = useState([]);

  useEffect(() => {
    const fetchRecCases = async () => {
      await globalFunctions.axiosFetch(`${process.env.CASE_DISCOVERY_API}recommendations?facility_id=${userFacility}`, 'get', userToken, {})
        .then(result => {
          result = result.data;
          result.forEach((c) => {
            const { procedures, roomName } = c;
            c.procedures = procedures.map((p) => {
              const { procedureName } = p;
              p.procedureName = procedureName.replace(/,(?=[^\s])/g, ', ');
              return p;
            });
          });
          setCases(result);
        }).catch((error) => {
          console.log("uh no.")
        }).finally(() => {

        });
    }
    fetchRecCases();
  }, [])
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1280 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1280, min: 464 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  const Controls = ({ next, previous, goToSlide, ...rest }) => {
    return (
      <div className="rec-header">
        <div className="left-arrow" onClick={() => previous()}></div>
        <div>Cases of Interest</div>
        <div className="right-arrow" onClick={() => next()}></div>
      </div>
    )
  }
  return (<div className="recommended-cases">

    <Carousel
      className={'carousel'}
      id="carousel" // default ''
      infinite={true}
      showDots={false}
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={6500}
      arrows={false}
      renderButtonGroupOutside={true}
      customButtonGroup={<Controls />}
    >
      {
        CASES.map((c, i) => (
          <Case
            isShort
            key={i}
            onClick={() => handleChangeCaseId(c.caseId)}
            {...c}
            isSaved={savedCases.includes(c.caseId)}
            handleSaveCase={() => handleSaveCase(c.caseId)} />
        ))
      }
    </Carousel>

  </div>)
}



function DetailedCase(props) {
  const { hidden, showEMMReport, handleChangeCaseId, USERS, isSaved, handleSaveCase, openAddFlag, handleOpenAddFlag, flagData, renderFlagQuestion, flagReport, handleFlagSubmit, setChoiceOtherOptionObject, choiceOtherOptionObject, roomIds, setReloadCase, setData } = props;
  if (props.metaData == null) {
    return <div hidden={hidden}><LoadingIndicator /></div>
  }

  const COMPLICATIONS = useSelector(makeSelectComplications());
  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());

  const { metaData: { caseId, emrCaseId, roomName, surgeonId, wheelsIn, wheelsInUtc, wheelsOut, scheduledStart, startTime, endTime,
    duration, departmentId, intubationPlacement, intubationRemoval, intubationType, isLeftSided, isRightSided,
    procedures, timeline }, flags } = props;
  const { roomSchedule: { blockStart, blockEnd, roomCases }, procedureDistribution, emmStatus: { reportId, isPublished }, hl7Parameters, tags } = props;

  const procedureTitle = procedures[0].procedureName;

  const dayDiff = moment().endOf('day').diff(moment(wheelsIn).endOf('day'), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const blockStartTime = moment(blockStart, 'HH:mm:ss');
  const blockEndTime = moment(blockEnd, 'HH:mm:ss');
  const bStartTime = globalFunctions.getDiffFromMidnight(blockStartTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsIn, 'minutes') / 60;
  const bEndTime = globalFunctions.getDiffFromMidnight(blockEndTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsOut, 'minutes') / 60;

  const earliestStartTime = roomCases.reduce((min, c) => globalFunctions.getDiffFromMidnight(c.wheelsIn, 'minutes') / 60 < min ? globalFunctions.getDiffFromMidnight(c.wheelsIn, 'minutes') / 60 : min, bStartTime);
  const latestEndTime = roomCases.reduce((max, c) => globalFunctions.getDiffFromMidnight(c.wheelsOut, 'minutes') / 60 > max ? globalFunctions.getDiffFromMidnight(c.wheelsOut, 'minutes') / 60 : max, bEndTime) + 1;
  const scheduleDuration = Math.ceil(latestEndTime) - (earliestStartTime);
    
  const description = (
    <div style={{ lineBreak: 'anywhere' }}>
      <span>Case ID: {emrCaseId}</span>
      <span>Surgeon ID: {`${surgeonId}`}</span>
      <span>{date} {`(${dayDiff} ${dayDiff == 1 ? 'Day' : 'days'} ago)`}</span>
      {intubationType && <span>Intubation Type: {intubationType}</span>}
    </div>
  );

  const requestEMMDescription = (
    <div>
      <span>Case ID: {emrCaseId}</span>
      <span>{date} {`(${dayDiff} ${dayDiff == 1 ? 'Day' : 'days'} ago)`}</span>
      <span>{roomName}</span>
    </div>
  );

  const startDiff = moment(wheelsIn).diff(moment(scheduledStart), 'seconds');

  let laterality = "N/A";
  let lateralityIcon = <img src={EmptyPerson} />
  if (isLeftSided || isRightSided) {
    laterality = (isLeftSided && isRightSided) ? "Bilateral" : (isLeftSided ? "Left Side" : "Right Side");
    lateralityIcon = (isLeftSided && isRightSided) ? (
      <img src={FullPerson} />) : (
      isLeftSided ? <img src={HalfPerson} /> : <img src={HalfPerson} style={{ transform: 'scaleX(-1)' }} />
    );
  }


  const [windowDimensions, setWindowDimensions] = useState(globalFunctions.getWindowDimensions());
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(globalFunctions.getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Hour block size in pixels
  const HEADER_SIZE = 90;
  const HOUR_SIZE = Math.max((windowDimensions.height - HEADER_SIZE) / (scheduleDuration), 34);
  const [openRequestEMM, setOpenRequestEMM] = React.useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = React.useState(false);
  /*** Flag Submission State ***/
  const [isFlagSubmitted, setIsFlagSubmitted] = useState(false);

  const handleOpenRequestEMM = (open) => {
    setOpenRequestEMM(open);
    logger && logger.manualAddLog('click', open ? 'open-emm-request' : 'close-emm-request', !open && !isRequestSubmitted ? 'Closed without submission' : '');
  }

  const reportButton = () => {
    if (isRequestSubmitted) {

      return <LightTooltip title={"eM&M request submitted successfully"} arrow>
        <div><Button variant="outlined" className="primary disabled" onClick={() => null} disabled>Request eM&M</Button></div>
      </LightTooltip>
    } else if (dayDiff <= 21) {
      return <Button variant="outlined" className="primary" onClick={() => handleOpenRequestEMM(true)}>Request eM&M</Button>
    } else {
      return <div></div>
    }
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const updateCaseId = (cId) => {
    if (cId == caseId) {
      return;
    }
    setIsLoading(true)
    setIsRequestSubmitted(false);
    handleChangeCaseId(cId);
  }
  useEffect(() => {
    setIsLoading(false);
  }, [caseId]);

  const [requestData, setRequestData] = useReducer(requestReducer, {
    complications: [],
    complicationDate: null,
    complicationOther: null,
    users: [],
    notes: "",
  });
  const classes = useStyles();

  const [isComplicationFilled, setIsComplicationFilled] = React.useState(true);
  const [isComplicationDateFilled, setIsComplicationDateFilled] = React.useState(true);
  const [isComplicationOtherChecked, setIsComplicationOtherChecked] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  // Change/update the filter for request ID
  const handleChange = (event, value) => {
    if (!isComplicationFilled && event == "complications") {
      setIsComplicationFilled(true);
    }
    if (!isComplicationDateFilled && event == "complicationDate") {
      setIsComplicationDateFilled(true);
    }



    setRequestData({
      name: event,
      value: value,
      logger: logger
    })
  }

  const submit = () => {
    if (isComplicationOtherChecked) {
      if (!requestData.complicationOther) {
        setIsComplicationFilled(false);
        logger && logger.manualAddLog('click', 'submit-validation-error', 'complication-empty');
        return;
      }
    } else if (requestData.complications.length < 1) {
      logger && logger.manualAddLog('click', 'submit-validation-error', 'complication-empty');
      setIsComplicationFilled(false);
      return;
    }
    if (!requestData.complicationDate) {
      logger && logger.manualAddLog('click', 'submit-validation-error', 'complication-date-empty');
      setIsComplicationDateFilled(false);
      return;
    }
    let complicationList = requestData.complications.map((c) => c.display);
    let jsonBody = {
      "roomName": roomName,
      "specialty": ["Unknown Specialty"],
      "procedure": [procedureTitle],
      "complications": requestData.complicationOther ? [...complicationList, requestData.complicationOther] : complicationList,
      "postOpDate": requestData.complicationDate,
      "operationDate": globalFunctions.formatDateTime(scheduledStart),
      "notes": requestData.notes,
      "usersToNotify": requestData.users.map((c) => c.id),
      "departmentName": departmentId,
      "facilityName": userFacility
    }
    logger && logger.manualAddLog('click', 'submit-emm-request', jsonBody);
    setIsSending(true);
    globalFunctions.genericFetch(process.env.EMMREQUEST_API, 'post', userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {

        } else {
          setIsRequestSubmitted(result)
        }
      })
  }

  const procedureList = [...new Set(procedures.slice(1).map((p) => p.procedureName))];
  const specialtyList = [...new Set(procedures.map((p) => p.specialtyName))];

  // Connect logger
  useEffect(() => {
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
  });

  return (
    <Grid container spacing={0} className="case-discovery-detailed" hidden={hidden}>
      {isLoading ? <Grid item xs className="detailed-case"><LoadingIndicator /></Grid> :
        <Grid item xs className="detailed-case">
          <div className="back-header">
            <div className="back" onClick={() => handleChangeCaseId(null)} >
              <ArrowBack style={{ fontSize: 12, marginBottom: 2 }} /> Back
            </div>
            <div className="button">{reportButton()}</div>
          </div>
          <div className="case-header">
            <div className="case-title">{procedureTitle}</div>
            <div >
              <IconButton
                className={`save-toggle ${!isSaved && 'not-saved'}`} onClick={(e) => { e.stopPropagation(); handleSaveCase() }}
                style={{ marginRight: 55, marginTop: -12, marginBottom: -11 }} title={isSaved ? "Remove from saved cases" : "Save case"}>
                {isSaved ? <StarIcon style={{ color: '#EEDF58', fontSize: 36 }} /> : <StarBorderIcon style={{ color: '#828282', fontSize: 36 }} />}
              </IconButton>
            </div>
          </div>
          {procedureList.length > 0 && (
            <div className="case-description" style={{ marginBottom: 0 }}>
              {`Additional Procedure${procedureList.length == 1 ? '' : 's'}`}
              <LightTooltip arrow title={
                <div>
                  <span>{`Additional Procedure${procedureList.length > 1 ? 's' : ''}`}</span>
                  <ul style={{ margin: '4px 0px' }}>
                    {procedureList.map((line, index) => { return <li key={index}>{line}</li> })}
                  </ul>
                </div>
              }
              >
                <InfoOutlinedIcon className="log-mouseover" id={`additional-procedure-tooltip-${emrCaseId}`} description={JSON.stringify({ emrCaseId: emrCaseId, toolTip: procedureList })} style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
              </LightTooltip>
            </div>
          )
          }
          <div className="case-description">
            <div className="case-specialty">{roomName} <span> • {specialtyList.join(" & ")}</span></div>
            {description}
          </div>
          <div className="tags">
            {displayTags(tags, emrCaseId)}
            {(flagReport && flags.length <= 0 && dayDiff <= 25) && 
              <span className={`case-tag add-flag ${!flagReport ? 'disabled' : ''}`} onClick={(e) => { if(flagReport) handleOpenAddFlag(true)}} >
                <img src={Plus} />
                <div>
                  Add Flag
                </div>
              </span>
            }
          </div>

          <div className="timing-graphs" id="timing-graphs">
            <Grid container spacing={0}>
              <Grid item xs={6} className="timing">
                <Grid container spacing={0} className="start-timing">
                  <Grid item xs className="scheduled-start">
                    <div className="timing-header">Scheduled Start</div>
                    <div className="timing-value">Started at</div>
                    <div className="timing-header">Laterality</div>
                    <div className="timing-value">{laterality}</div>
                  </Grid>
                  <Grid item xs className="actual-start">

                    <div className="timing-header">{moment(scheduledStart).format("HH:mm")}</div>
                    <div className="timing-value">{moment(wheelsIn).format("HH:mm")}</div>
                    <div className="laterality">
                      {lateralityIcon}
                    </div>
                  </Grid>
                  <Grid item xs className="difference">
                    <div className="timing-header" style={{ visibility: 'hidden' }}>placeholder</div>
                    {Math.abs(startDiff) < 1 ?
                      <div className={`early`}>
                        On Time
                      </div>
                      :
                      <div className={`${startDiff > 0 ? 'late' : 'early'}`}>
                        {globalFunctions.formatSecsToTime(Math.abs(startDiff - (startDiff % 60)), true, true)} {`${startDiff > 0 ? 'late' : 'early'}`}
                      </div>}
                  </Grid>
                </Grid>

              </Grid>
              <Grid item xs={6} className="procedure-time">
                <ProcedureDistribution {...procedureDistribution} duration={duration} />
              </Grid>
            </Grid>
            <HL7Chart hl7Data={hl7Parameters} timeline={timeline} flags={flags} />


          </div>

        </Grid>
      }
      <Grid item xs className="schedule">
        <div className="header">
          <div className="log-click" id="or-schedule-header">{`${roomName}${!blockStart ? ' Off' : ''} Block`}</div>
          <div className="log-click" id="or-schedule-date">{moment(scheduledStart).format('dddd, MMMM DD, YYYY')}</div>

        </div>
        <div className="timeline relative"
          style={{
            height: `${scheduleDuration * HOUR_SIZE}px`
          }}
        >
          {/* Highlight Scheduled block */}
          <div className="scheduled-block absolute"
            style={{
              top: `${(bStartTime - earliestStartTime) * HOUR_SIZE}px`,
              height: `${(bEndTime - bStartTime) * HOUR_SIZE}px`
            }}
            hidden={!blockStart}
          >
          </div>

          {/* Add time markers */}
          {Array.from({ length: Math.ceil(scheduleDuration) }, (x, i) => {
            const now = moment().toDate()
            let cTime = Math.floor(earliestStartTime) + i;
            now.setHours(cTime);
            now.setMinutes(0);
            const formattedTime = moment(now).format("HH:mm");
            return (
              <div className="hour-marker log-click"
                id={`hour-block-${formattedTime}`}
                style={{
                  // top: `${i * HOUR_SIZE}px`,
                  height: `${HOUR_SIZE}px`,
                }}>
                <div className="log-click" id={`hour-marker-${formattedTime}`}>{formattedTime}</div>
              </div>
            )
          })}
          {blockStart && <LightTooltip
            title={`Block hours: ${moment(blockStartTime).format('HH:mm')} - ${moment(blockEndTime).format('HH:mm')}`}
            placement='left'
          >
            <div className="absolute log-mouseover"
              id="block-hours-tooltip"
              style={{
                top: `${(bStartTime - earliestStartTime) * HOUR_SIZE}px`,
                height: `${(bEndTime - bStartTime) * HOUR_SIZE}px`,
                width: `100%`
              }}
            >
            </div>
          </LightTooltip>}
          {/* Display all cases given  */}
          {roomCases.map((c) => {
            const { procedureName, wheelsIn, wheelsOut } = c;
            // We offset by "Earliest start time" (could be 6:22 am) + the straggling minutes (22mins) since the labels display only 6am
            const offset = ((earliestStartTime + (1 - earliestStartTime % 1) - 1) * 60);
            let startMins = globalFunctions.getDiffFromMidnight(wheelsIn, 'minutes') - offset;
            let endMins = globalFunctions.getDiffFromMidnight(wheelsOut, 'minutes') - offset;
            const caseHeight = (endMins - startMins) / 60;
            return (
              <div className={`absolute case-block ${c.caseId == caseId && 'is-current-case'} ${caseHeight * HOUR_SIZE <= 34 && 'short'} ${caseHeight * HOUR_SIZE <= 83 && 'medium'}`}
                onClick={() => updateCaseId(c.caseId)}
                style={{
                  top: `${(startMins / 60) * HOUR_SIZE}px`,
                  height: `${caseHeight * HOUR_SIZE}px`,
                  minHeight: HOUR_SIZE
                }}>
                <div className="case-title">{procedureName}</div>
                {caseHeight > 1 && <div className="case-time">{moment(wheelsIn).format("HH:mm")} - {moment(wheelsOut).format("HH:mm")}</div>}
              </div>
            )
          })}


        </div>
      </Grid>
      <Modal
        open={openRequestEMM}
        onClose={() => handleOpenRequestEMM(false)}
      >
        <div className="request-emm-modal">
          <div className="close-button">
            <img src={Close} onClick={() => handleOpenRequestEMM(false)} />
          </div>
          {isRequestSubmitted ?
            (<Grid container spacing={2} direction="column">
              <Grid item xs={12} className="header" style={{ maxWidth: 'none', marginBottom: 0 }}>
                <p>Thank you for submitting your request!</p>
              </Grid>
              <Grid item xs>
                Please note the Enhanced M&M ID for the report to be generated:
                <span style={{ fontWeight: 'bold' }}>{` ${isRequestSubmitted}`}</span>
              </Grid>
              <Grid item xs>
                We will notify you when the report is ready on Insights for viewing.
              </Grid>
              <Grid item xs>
                <Button variant="outlined" className="primary" style={{ marginTop: 26 }} onClick={() => handleOpenRequestEMM(false)}>Close</Button>
              </Grid>
            </Grid>
            ) :
            <div className="request-emm">
              <div className="header">
                Request for Enhanced M&M
              </div>
              <div className="subtitle">
                {procedureTitle}
              </div>
              <div className="description">
                {requestEMMDescription}
              </div>

              <TagsSelect
                title="Complications"
                placeholder="Select 1 or more"
                options={COMPLICATIONS}
                id="complications"
                handleChange={handleChange}
                searchData={requestData}
              />
              {!isComplicationFilled && !isComplicationOtherChecked && <FormHelperText className="Mui-error" >Please select a complication</FormHelperText>}
              <div className="input-label">
                <Checkbox
                  disableRipple
                  id="other-complication-checkbox"
                  icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                  checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                  checked={isComplicationOtherChecked} onChange={(e) => setIsComplicationOtherChecked(e.target.checked)} />Other
              </div>
              {isComplicationOtherChecked && <TextField
                id="complication-other"
                variant="outlined"
                size="small"
                name="complicationValue"
                onChange={(e) => handleChange('complicationOther', e.target.value)}
              />}
              {!isComplicationFilled && isComplicationOtherChecked && <FormHelperText className="Mui-error" >Please enter a complication</FormHelperText>}
              <InputLabel className={classes.inputLabel}>Date of Complication</InputLabel>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableToolbar
                  size="small"
                  variant="inline"
                  format="MM/dd/yyyy"
                  name="complicationDate"
                  minDate={scheduledStart}
                  maxDate={moment()}
                  placeholder="Pick Date"
                  inputVariant="outlined"
                  className="complicationDate"
                  autoOk
                  value={requestData.complicationDate || null}
                  inputProps={{ autoComplete: 'off' }}
                  onChange={(e, v) => handleChange('complicationDate', e)}
                  id="complicationDate"
                />
              </MuiPickersUtilsProvider>
              {!isComplicationDateFilled && <FormHelperText className="Mui-error" >Please select a complication date</FormHelperText>}
              <TagsSelect
                title="Additional users to receive updates on request status (Optional)"
                placeholder="Select users"
                options={USERS.map((u) => { return { "display": `${u.firstName} ${u.lastName}`, "id": u.userName } })}
                id="users"
                handleChange={handleChange}
                searchData={requestData}
              />
              <InputLabel className={classes.inputLabel}>Notes (Optional)</InputLabel>
              <TextField
                multiline
                className="notes-field"
                rows="8"
                variant="outlined"
                onChange={(e) => handleChange('notes', e.target.value)}
              />

              <Button variant="outlined" className="primary send-request"
                onClick={() => submit()}
                disabled={isSending}

              >
                {isSending ? <div className="loader"></div> : 'Request eM&M'}
              </Button>
            </div>}
        </div>

      </Modal>
      <Modal
        open={openAddFlag}
        onClose={() => handleOpenAddFlag(false)}
      >
        <AddFlagForm 
          isFlagSubmitted={isFlagSubmitted}
          handleOpenAddFlag={handleOpenAddFlag}
          reportId={flagReport && flagReport.reportId}
          flagData={flagData}
          renderFlagQuestion={renderFlagQuestion}
          procedureTitle={procedureTitle}
          requestEMMDescription={requestEMMDescription} 
          handleFlagSubmit={handleFlagSubmit}
          setIsFlagSubmitted={setIsFlagSubmitted}
          setChoiceOtherOptionObject={setChoiceOtherOptionObject}
          choiceOtherOptionObject={choiceOtherOptionObject}
          roomIds={roomIds}
          roomName={roomName}
          wheelsInLocal={wheelsIn}
          wheelsInUtc={wheelsInUtc}
          setReloadCase={setReloadCase}
          caseId={caseId}
        />
      </Modal>
    </Grid>
  )
}

/***  ADD FLAG FORM COMPONENT. ***/
const AddFlagForm = ({ isFlagSubmitted, handleOpenAddFlag, flagData, reportId, renderFlagQuestion, procedureTitle, requestEMMDescription, handleFlagSubmit, setIsFlagSubmitted, setChoiceOtherOptionObject, choiceOtherOptionObject, roomIds, roomName, wheelsInLocal, wheelsInUtc, setReloadCase, caseId }) => {
  
  const translateRoomNametoId = () => {
    if(roomIds && roomName) {
      const room = roomIds.find(room => room.display === roomName);
      if(room) return room.id;
    }
  };
  
  const [roomId, setRoomId] = useState(() => translateRoomNametoId()); 

  useEffect(() => {
    setIsFlagSubmitted(false);
  }, []);

  useEffect(() => {
    setRoomId(translateRoomNametoId());
  }, [roomName]);

  const onFlagSubmit = () => {
    if(reportId, flagData) {
      const newFlag = {
        reportId,
        roomId,
        localTime: wheelsInLocal,
        utcTime: wheelsInUtc,
        options: flagData.map(el => {
          return {
            optionId: el.choices[0].id,
            attribute: el.choices[0].attribute
          }
        })
      };
      handleFlagSubmit(newFlag, setIsFlagSubmitted);
    
      setTimeout(() => {
        setReloadCase(caseId);
      }, 500);
      setTimeout(() => {
        setReloadCase(null);
      }, 600);
    }
  };
  return (
    <div className="request-emm-modal">
      <div className="close-button">
        <img src={Close} onClick={() => handleOpenAddFlag(false)} />
      </div>
      {isFlagSubmitted ?
        (<Grid container spacing={2} direction="column">
          <Grid item xs={12} className="header" style={{ maxWidth: 'none', marginBottom: 0 }}>
            <p>Thank you for submitting flag!</p>
          </Grid>
          <Grid item xs>
            {/* Please note the Enhanced M&M ID for the report to be generated: */}
            {/* <span style={{ fontWeight: 'bold' }}>{` ${isFlagSubmitted}`}</span> */}
          </Grid>
          <Grid item xs>
            {/* We will notify you when the report is ready on Insights for viewing. */}
          </Grid>
          <Grid item xs>
            <Button variant="outlined" className="primary" style={{ marginTop: 26 }} onClick={() => handleOpenAddFlag(false)}>Close</Button>
          </Grid>
        </Grid>
        ) :
        <div className="request-emm">
          <div className="header">
            Submit Flag
          </div>
          <div className="subtitle">
            {procedureTitle}
          </div>
          <div className="description">
            {requestEMMDescription}
          </div>
          {flagData && flagData.map(el => renderFlagQuestion(el))}
          <Button 
            variant="outlined" 
            className="primary send-request submit-flag"
            onClick={onFlagSubmit}
            disabled={flagData && flagData.length < 4 || flagData && flagData.some(el => !el.completed)/*isSending*/}
          >
            {/*isSending*/false ? <div className="loader"></div> : 'Submit Flag'}
          </Button>
        </div>}
    </div>
  );
};

const FlagSelect = ({ title, questionType, options, onSelect, isRequired, setIsFlagChoiceOther, questionId, setChoiceOtherOptionObject }) => {
  const [value, setValue] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
     // 1. Animate state set to true.
     const timeout = setTimeout(() => {
      setAnimate(true);
    }, 200);
    // Clean up timeout before effect runs.
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    setValue(null)
  }, [questionId])

  const classes = useStyles();

  // OnChange handler.
  const onOptionChange = (event, newValue) => {
    // console.log('new value', newValue)
    // console.log('current value', value);
    // Retrieve selected options index.
    const optionIndex = options.findIndex(opt => opt.id === newValue.id);
    const optionObj  = { ...newValue, optionIndex };

    if(newValue.type === 'choice-other') {
      setIsFlagChoiceOther(prevState => {
        return { ...prevState, [questionId]: true}
      });
      setChoiceOtherOptionObject(optionObj);
    } else {
      setIsFlagChoiceOther(prevState => {
        return { ...prevState, [questionId]: false}
      });
    }
    if(newValue) onSelect(questionType, questionId, title, optionObj);
    // If value is already selected.
    // if(value) {
    //   // Load next flag question.
    //   if(newValue) onSelect[1](questionType, questionId, title, optionObj)
    // } else {
    //   if(newValue) onSelect[0](questionType, questionId, title, optionObj);
    // }
    setValue(newValue);
  };

  return (
    <div className={`flag-select ${animate ? 'animate' : ''}`}>
      <div className="select-header">
        <InputLabel className={classes.inputLabel}>{`${title} ${isRequired ? '' : '(optional)'}`}</InputLabel>
        {/* <div hidden={!value || value.length <= 0} className={classes.clear} onClick={() => handleChange(id, [])}>
          Clear
        </div> */}
      </div>
      <Autocomplete
        id="combo-box-demo"
        size="small"
        value={value}
        onChange={onOptionChange}
        options={options}
        getOptionLabel={(option) => option.title || ''}
        style={{ width: '100%' }}
        multiple={questionType === 'multiple-choice'}
        disableCloseOnSelect={false}
        renderInput={(params) => <TextField {...params} label={questionType === 'multiple-choice' ? 'Select 1 or more' : 'Select 1'} variant="outlined" />}
        autoFocus
        disableClearable
      />
    </div>
  );
};

const FlagTextInput = ({ choiceOtherInputActive, flagData, choiceOtherOptionObject, handleChoiceOtherSelect, setChoiceOtherInputActive }) => {
  const [flagInputOtherValue, setFlagInputOtherValue] = useState('');

  const handleFlagInputChange = (event, title)  => {
    const val = event.target.value;

    setFlagInputOtherValue(prevState => ({ ...prevState, [title]: val }));
    // scrollToTop();
  };

  return (
    <TextField
      // id="complication-other"
      disabled={!choiceOtherInputActive}
      id={`${flagData.title}-other`}
      variant="outlined"
      size="small"
      name={`${flagData.title}Other`}
      type="text"
      placeholder="Your custom text here"
      value={flagInputOtherValue[flagData.title]}
      onChange={(e) => handleFlagInputChange(e, flagData.title)}
      InputProps={{
        endAdornment: (
          <InputAdornment title={choiceOtherInputActive ? 'Submit' : 'Edit'}>
            <IconButton 
              onClick={() => choiceOtherInputActive ? handleChoiceOtherSelect(flagData.id, flagInputOtherValue[flagData.title], choiceOtherOptionObject ) : setChoiceOtherInputActive(true)}
              disabled={!flagInputOtherValue[flagData.title]}
            >
              {!choiceOtherInputActive && <EditIcon />} 
              {choiceOtherInputActive && <CheckIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
      style={{color: choiceOtherInputActive ? 'blue' : ''}}
    />
  )
};

const MemoizedFlagTextInput = React.memo(FlagTextInput);

const AddFlagInput = ({ optionType, title }) => (
  <React.Fragment>
    <InputLabel className={classes.inputLabel}>{title}</InputLabel>
    {renderFlagInput(optionType)}
  </React.Fragment>
);

const AddFlagDatePicker = props => (
  <React.Fragment>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        disableToolbar
        size="small"
        variant="inline"
        format="MM/dd/yyyy"
        name="complicationDate"
        minDate={scheduledStart}
        maxDate={moment()}
        placeholder="Pick Date"
        inputVariant="outlined"
        className="complicationDate"
        autoOk
        value={requestData.complicationDate || null}
        inputProps={{ autoComplete: 'off' }}
        onChange={(e, v) => handleChange('complicationDate', e)}
        id="complicationDate"
      />
    </MuiPickersUtilsProvider>
    {!isComplicationDateFilled && <FormHelperText className="Mui-error" >Please select a complication date</FormHelperText>}
  </React.Fragment>
);


const requestReducer = (state, event) => {
  if (event.name == 'date-clear') {
    event.name = 'date'
  } else if (event.name == 'date') {
    event.value = {
      selected: event.value.key,
      ...getPresetDates(event.value.key)
    }
  } else if (event.name == 'custom-to') {
    event.name = 'date'
    event.value = {
      ...state.date,
      to: event.value,
    }

  } else if (event.name == 'custom-from') {
    event.name = 'date'
    event.value = {
      ...state.date,
      from: event.value
    }
  }
  const logger = event.logger
  logger && logger.manualAddLog('onchange', event.name, event.value);

  return {
    ...state,
    [event.name]: event.value
  }
}


function ProcedureDistribution(props) {
  const { shape, scale, duration, sampleSize } = props;
  const logger = useSelector(makeSelectLogger());
  const mu = scale;
  const sigma = shape * scale;
  const range = [duration, ...globalFunctions.range(Math.max(0, mu - 4.5 * sigma), mu + 4.5 * sigma, sigma / 20)].sort();
  // console.log(range)
  const chartRef = useRef(null);
  if (!shape || !scale) {
    return <div></div>
  }

  const createCustomTooltip = (d, defaultTitleFormat, defaultValueFormat, color) => {
    d = d[0]
    let seconds = d.x;

    const time = globalFunctions.formatSecsToTime(seconds, true, true);
    const percentile = `${globalFunctions.ordinal_suffix_of(Math.round(log_norm_cdf(d.x, scale, shape) * 100))} percentile`;
    logger && logger.manualAddLog('mouseover', `procedure-time-tooltip`, { xValue: time, yValue: percentile })
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext">
        <div>{time}</div>
        <div>{percentile}</div>
      </div>);
  }

  const data = {
    size: {
      height: 130,
      width: 500
    },
    data: {
      x: 'x',
      columns: [
        ['x', ...range],
        ['y', ...range.map((x) => log_norm_pdf(x, scale, shape))]
      ],
      type: 'area-spline'
    },
    tooltip: {
      grouped: true,
      // show: false,
      contents: (d, defaultTitleFormat, defaultValueFormat, color) => createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color),
      position: function (data, width, height, element) {
        // var top = d3.mouse(element)[1] ;
        let left = parseInt(element.getAttribute('x')) - width / 2 + parseInt(element.getAttribute('width'));
        return { top: 130, left: left }
      }
    },
    axis: {
      x: {
        show: false
      },
      y: {
        show: false
      }
    },
    grid: {
      x: duration > 0 ? {
        lines: [{ "value": duration, "text": globalFunctions.formatSecsToTime(duration, true, true), "class": "marker" }]
      } : {},
    },
    legend: {
      show: false
    },
    point: {
      show: false
    }
  }

  // Move marker behind the ggraph for tooltip to still display
  useEffect(() => {
    var content = document.getElementById('procedure-dist').getElementsByClassName('c3-grid c3-grid-lines')[0];
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild)
  }, []);

  return (
    <div className="procedure-distribution" id="procedure-dist" >
      <div className="title">Procedure Time <LightTooltip interactive arrow title={`Procedure time distribution is a best approximation based on ${sampleSize} case${sampleSize == 1 ? '' : 's'} of the same procedure type`} placement="top" fontSize="small">
        <InfoOutlinedIcon className="log-mouseover" id="procedure-time-info-tooltip" style={{ fontSize: 16, margin: '0 0 4px 0px' }} />
      </LightTooltip></div>
      <C3Chart ref={chartRef} {...data} />
    </div>
  )
}


function HL7Chart(props) {
  const { hl7Data, timeline, flags } = props;
  const logger = useSelector(makeSelectLogger());
  const chartRef = useRef(null);
  if (!hl7Data) {
    return <span></span>
  }

  const unitMap = {};
  hl7Data.forEach((d) => {
    unitMap[d.title] = `${d.isSpacedUnit ? ' ' : ''}${d.unit}`;
  });

  const hasHL7Data = hl7Data.length > 0;
  const hasClips = flags && flags.some((f) => f.clips && f.clips.length > 0);
  const max = Math.max(...(hasHL7Data ? hl7Data[0].times : []), ...timeline.map((t) => t.time));

  const createCustomTooltip = (d, defaultTitleFormat, defaultValueFormat, color) => {

    if (!hasHL7Data) {
      d = d[0]
      let value = timeline.find((e) => e.time == d.x)
      if (!value || !value.text) {
        return;
      }
      const time = globalFunctions.formatSecsToTime(d.x);
      const text = value.text;
      logger && logger.manualAddLog('mouseover', `hl7-tooltip-${d.name}`, { xValue: time, zValue: text, name: d.name })
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext">
          <div>{time}</div>
          <div>{text}</div>
        </div>);
    }

    let hl7 = d.find((e) => e && e.id != "y");
    let y = d.find((e) => e && e.id == "y");
    let value = y && timeline.find((e) => e.time == y.x);
    let x = hl7 && hl7.x || y && y.x;
    const time = globalFunctions.formatSecsToTime(x);
    logger && logger.manualAddLog('mouseover', `hl7-tooltip-${hl7 && hl7.name}`, { xValue: time, yValue: hl7 && hl7.value, zValue: value && value.text, name: hl7 && hl7.name })
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext">
        <div>{time}</div>
        {value && <div>{value.text}</div>}
        {hl7 && hl7.value && <div>{`${hl7.id}: ${hl7.value}${unitMap[hl7.id]}`}</div>}
      </div>);
  }

  const xRange = globalFunctions.range(0, max, 900);
  let xValues = [];
  let maxVal = 5;

  let delta = Math.floor(xRange.length / maxVal);

  if (delta) {
    for (let i = 0; i < xRange.length; i = i + delta) {
      xValues.push(xRange[i]);
    }
  } else {
    xValues = xRange
  }


  const data = {
    padding: {
      left: 45,
      bottom: 80
    },
    size: hasHL7Data ? {} : {
      height: 265
    },
    data: {
      x: 'x',
      columns: []
    },
    legend: {
      show: false
    },
    point: {
      show: hasHL7Data
    },
    axis: {
      x: {
        tick: {
          outer: false,
          values: xValues,
          format: (x) => {
            return globalFunctions.formatSecsToTime(x).substring(0, 5);
          }
        },
        padding: hasHL7Data ? {
          // left: max * .025,
          // right: max * .025,
          left: 3,
          right: max * .025,
        } : {
          // left: max * .05,
          left: 0,
          right: max * .025,
        }
      },
      color: {
        pattern: ['#028CC8']
      },
      y: {
        tick: {
          outer: false,
          // count: hasHL7Data ? 10 : 1,
          min: 0,
          format: (x) => {
            if (x < 0) {
              return
            }
            return parseInt(x) == parseFloat(x) ? x : parseFloat(x).toFixed(1)
          }

        },
        show: hasHL7Data,
        // show: false,
        padding: hasClips ? { top: 20, bottom: 50 } : {
          top: 20,
        }
      }
    },
    grid: {
      x: {
        lines: timeline.map((t) => {
          return { ...t, value: t.time, "class": 'marker' }
        })
      },
      focus: {
        show: hasHL7Data
      }
    },
    tooltip: {
      // grouped: false,
      // show: hasHL7Data,
      contents: (d, defaultTitleFormat, defaultValueFormat, color) => createCustomTooltip(d, defaultTitleFormat, defaultValueFormat, color)
    },
    line: {
      connectNull: true
    },
    point: {
      show: false
    }
  }

  // Pad HL7 with timeline data
  if (hasHL7Data) {
    for (let i = 0; i < hl7Data.length; i++) {

      const { times, values, unit, title } = hl7Data[i];
      const min = Math.min(...values.filter((x) => x))

      for (let t = 0; t < timeline.length; t++) {
        const { time } = timeline[t];
        const x = times.findIndex((x) => time < x);
        times.splice(x, 0, time)
        values.splice(x, 0, null)
      }

      hl7Data[i].y = ['y', ...Array(times.length).fill().map(() => min)]
    }
  }


  let [index, setIndex] = React.useState(0);
  const handleChangeIndex = (index) => {
    setIndex(index);
    const { times, values, unit, title, y } = hl7Data[index];
    logger && logger.manualAddLog('click', `change-hl7-selection-${title}`, title);
  }
  if (hasHL7Data) {
    const { times, values, unit, title, y } = hl7Data[index];

    data.data.columns = [
      ['x', ...times],
      [title, ...values],
      y,
    ]
  } else {
    data.data.columns = [
      ['x', ...globalFunctions.range(0, max, max / 5), ...timeline.map((t) => t.time)],
      ['y', ...Array(max / 10 + timeline.length).fill().map(() => 0)],
    ]
  }


  useEffect(() => {
    const chart = chartRef && chartRef.current && chartRef.current.chart;
    if (chart) {
      setTimeout(() => {
        d3.selectAll(`#hl7-chart .marker text`).style('transform', 'translate(18px, 0px) rotate(-90deg)')
        // d3.selectAll(`#hl7-chart .c3-axis-x`).attr('dy', '-20')
        // const t = d3.transform(d3.select('#hl7-chart .c3-axis-x').attr("transform")),
        //   x = t.translate[0],
        //   y = t.translate[1]
        // d3.select(`#hl7-chart .c3-axis-x`).style('transform', `translate(${x}px, ${y + 30}px)`)
      }, 200)
    }
  });

  // Move marker behind the ggraph for tooltip to still display
  useEffect(() => {
    var content = document.getElementById('hl7-chart').getElementsByClassName('c3-grid c3-grid-lines')[0];
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild)

    //Log initial setup 
    logger && logger.manualAddLog('session', `initial-hl7`, hl7Data.map((h) => {
      return { abbreviation: h.abbreviation, title: h.title }
    }));

  }, []);

  useEffect(() => {
    if (!hasHL7Data) {
      return;
    }
    const { times, values, unit, title, y } = hl7Data[index];

    const chart = chartRef && chartRef.current && chartRef.current.chart;
    chart && chart.load({
      columns: [
        ['x', ...times],
        [title, ...values],
        y
      ],
      unload: [...hl7Data.map((d) => d.title == title ? '' : d.title), 'y'],
    });

  }, [index]);

  return (
    <div className="hl7-chart" id="hl7-chart" >
      <div className="header">Case Timeline</div>
      <Divider style={{ backgroundColor: '#C8C8C8' }} />
      <div className="chart-container">
        {hasHL7Data && <div className="patient-vitals" >
          <div className="sub header">Patient Vitals</div>
          <div className="selector">
            {hl7Data.map((d, i) => {
              return (
                <div className={`${i == index && 'selected'} hl7-value`} onClick={() => handleChangeIndex(i)}>{d.abbreviation}</div>
              )
            })}
          </div>
        </div>}
        <div style={{ width: '100%' }}>
          <div className="sub header center">{hasHL7Data ? `${hl7Data[index].title} (${hl7Data[index].unit})` : ''}</div>
          <C3Chart ref={chartRef} {...data} />
          {hasClips && <ClipTimeline flags={flags} max={max} />}
        </div>
      </div>


    </div>
  )
}
export const Thumbnail = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '0',
  },
  arrow: {
    color: '#d42828'
  },
  tooltipPlacementBottom: {
    marginLeft: "-7px",
    // marginRight: "-7px",
  },
}))(Tooltip);

function ClipTimeline(props) {
  const { flags, max } = props;
  const duration = max + max * .025
  const isSafari = navigator.vendor.includes('Apple');
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());
  const [presenterMode, setPresenterMode] = React.useState(false);
  const [presenterDialog, setPresenterDialog] = React.useState(false);
  const closePresenterDialog = (choice) => {
    (choice) && setPresenterMode(choice);
    setPresenterDialog(false);
    logger && logger.manualAddLog('click', `toggle-presenter-mode`, { checked: choice });
  }
  const ConfirmPresenterDialog = (props) => {
    return (
      <Dialog
        open={presenterDialog}
        onClose={() => setPresenterDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="publish-dialog"
      >
        <DialogTitle className="red">Warning</DialogTitle>
        <DialogContent>
          <DialogContentText className="confirm-publish-text subtle-subtext">
            By enabling Presentation Mode, this report will no longer be protected by Digital Rights Management (DRM). The Presentation Mode feature will allow you to broadcast this report over web conferencing apps such as MS Teams, however, as a result, it will also decrease the level of protection. Please ensure you enable Presentation Mode only prior to your presentation and disable it immediately thereafter. Do you wish to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closePresenterDialog(false)} className="cancel-publish" color="primary">
            Cancel
          </Button>
          <Button onClick={() => closePresenterDialog(true)} variant="outlined" className="primary publish-button" color="primary" autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  const switchPresenterMode = () => {
    if (!presenterMode) {
      //need to show warning if previous state is non presentation mode
      setPresenterDialog(true)
    } else {
      //otherwise, can just turn off presentation mode
      setPresenterMode(false)
      logger && logger.manualAddLog('click', `toggle-presenter-mode`, { checked: false });
    }
  }
  const [timeline, setTimeline] = React.useState(flags.map((f) => {
    const { clips, flagId, description } = f;
    return clips.map((c) => {
      return { ...c, flagId, description }
    })
  }).flat());
  useEffect(() => {
    const fetchData = async () => {
      const getCookie = await getCdnStreamCookies(process.env.CASE_DISCOVERY_API, userToken);
    }
    fetchData();
  }, [])
  const [selectedMarker, setSelect] = React.useState(false);
  const handleSelect = (t, i) => {
    if (t) {
      t.params = `?flag_id=${t.flagId}&clip_id=${t.clipId}`;
      logger && logger.manualAddLog('click', `open-clip-${t.clipId}`, t)
      t.index = i;
    } else {
      logger && logger.manualAddLog('click', `close-clip-${selectedMarker.clipId}`)
    }

    setSelect(t);

  }

  const publishClip = () => {
    globalFunctions.genericFetch(`${process.env.CASE_DISCOVERY_API}flag_clip?clip_id=${selectedMarker.clipId}`, 'post', userToken, {})
      .then(result => {
        const tLine = [...timeline];
        tLine[selectedMarker.index].isActive = true;
        logger && logger.manualAddLog('click', `publish-clip-${selectedMarker.clipId}`, selectedMarker)
        setTimeline(tLine)
      }).catch((results) => {
        console.error("oh no", results)
      })
  }

  const publishButton = selectedMarker && selectedMarker.isActive == null && (
    <div className="button">
      <Button variant="outlined" className="primary" onClick={() => publishClip()}>Publish</Button>
    </div>
  ) || ''

  return (
    <div className="timeline-container">
      <div className='clip-timeline'>
        {timeline.map((t, i) => {
          const thumbnail = (
            <div style={{ position: 'relative' }}>
              <img src={t.thumbnailSrc}
                alt=""
                style={{ width: 140, height: 78, padding: 0, borderRadius: 3 }} />
              <img src={Play} style={{ position: 'absolute', left: 'calc(50% - 13px)', top: 'calc(50% - 13px)', width: 26, height: 26 }} />
            </div>
          )
          return (
            <div className='clip-marker'
              style={{ left: `${Math.abs(t.startTime) / duration * 100}%`, width: `${(t.duration / duration * 100)}%` }}
              key={`t-${i}`}>
              <Thumbnail
                position="bottom"
                title={thumbnail}
                arrow>
                <svg className="log-mouseover" id={`thumbnail-${t.clipId}`} onClick={() => handleSelect(t, i)} width="20" height="20" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 0C1.26522 0 1.51957 0.105357 1.70711 0.292893C1.89464 0.48043 2 0.734784 2 1V1.88C3.06 1.44 4.5 1 6 1C9 1 9 3 11 3C14 3 15 1 15 1V9C15 9 14 11 11 11C8 11 8 9 6 9C3 9 2 11 2 11V18H0V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0Z" fill="#d42828" />
                </svg>
              </Thumbnail>
            </div>
          )
        })}
      </div>
      <Modal
        open={selectedMarker}
        onClose={() => handleSelect(false)}
      >
        <div className="Modal clip-modal" style={presenterMode ? {paddingTop:0} : {}}>
          {(presenterMode) &&
            <div className="Presenter-Mode-Banner">You are in Presentation Mode</div>
          }
          <div className="close-button">
            <img src={Close} onClick={() => handleSelect(false)} />
          </div>

          {isSafari && <SafariWarningBanner message={'Case Discovery contains videos that are currently not supported on Safari. We recommend using the latest version of Google Chrome or Microsoft Edge browsers for the full experience.'} />}
          <Grid container spacing={0} className="clip-details">
            <Grid item xs={9}><VideoPlayer params={selectedMarker.params} presenterMode={presenterMode} /></Grid>
            <Grid item xs={3} className="flag-details normal-text">
              <div>
                <FormControlLabel
                  control={
                    <SSTSwitch
                      checked={presenterMode}
                      onChange={switchPresenterMode}
                    />
                  }
                  label="Presentation Mode"
                />
              </div>
              <div className="details-header">Flag Details</div>
              {selectedMarker.description && selectedMarker.description.map((d, i) => {
                return (
                  <div className="detail-entry subtext" key={`${d.answer}-${i}`}>
                    <div className="title">{d.questionTitle}:</div>
                    <div className="body">{d.answer}</div>
                  </div>
                )
              })}
              {publishButton}
            </Grid>

          </Grid>
        </div>
      </Modal>
      <ConfirmPresenterDialog
        dialogOpen={presenterDialog}
      />
    </div>
  )
}




