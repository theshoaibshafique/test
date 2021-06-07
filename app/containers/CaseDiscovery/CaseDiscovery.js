/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import 'c3/c3.css';
import C3Chart from 'react-c3js';
import './style.scss';
import { Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, Grid, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Modal, Radio, RadioGroup, Select, TextField, withStyles } from '@material-ui/core';
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
import TurnoverDuration from './icons/TurnoverDuration.svg';
import Close from './icons/Close.svg';
import moment from 'moment/moment';
import CloseIcon from '@material-ui/icons/Close';
import { LightTooltip, StyledRadio } from '../../components/SharedComponents/SharedComponents';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import globalFunctions from '../../utils/global-functions';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import ReactDOMServer from 'react-dom/server';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import { isUndefined } from 'lodash';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { log_norm_cdf, log_norm_pdf } from './Utils';
import { useSelector } from 'react-redux';
import { makeSelectComplications, makeSelectLogger, makeSelectToken, makeSelectUserFacility } from '../App/selectors';

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
    marginBottom: 10,
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
      return <img src={Flagged} style={{ height: 20, width: 24 }} />
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

function displayTags(tags, emrCaseId) {
  return tags.map((tag, i) => {
    let desc = tag.toolTip || [];
    tag = tag.tagName || tag;
    return (
      <LightTooltip key={`${tag}-${i}`} title={desc.map((line) => {
        return <div>{line}</div>
      })} arrow={true}>
        <span className={`case-tag ${tag} log-mouseover`} id={`${tag}-tag`} description={JSON.stringify({ emrCaseId: emrCaseId })} key={tag}>
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
  const { procedures, emrCaseId, wheelsIn, wheelsOut, roomName, tags, onClick } = props;
  const sTime = moment(wheelsIn).format("HH:mm");
  const eTime = moment(wheelsOut).format("HH:mm");
  const diff = moment().diff(moment(wheelsIn), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const { specialtyName, procedureName } = procedures && procedures.length && procedures[0];

  const tagDisplays = displayTags(tags, emrCaseId);

  const procedureList = [...new Set(procedures.slice(1).map((p) => p.procedureName))];
  const specialtyList = [...new Set(procedures.map((p) => p.specialtyName))];


  return (
    <div className="case log-click" id={`open-case`} description={JSON.stringify({ emrCaseId: emrCaseId })} key={emrCaseId} onClick={onClick} >

      <div className="title" >
        {procedureName}
      </div>
      {procedureList.length > 0 && (
        <div className="description">
          {`Secondary Procedure${procedureList.length == 1 ? '' : 's'}`}
          <LightTooltip arrow title={
            <div>
              <span>{`Secondary Procedure${procedureList.length > 1 ? 's' : ''}`}</span>
              <ul style={{ margin: '4px 0px' }}>
                {procedureList.map((line, index) => { return <li key={index}>{line}</li> })}
              </ul>
            </div>
          }>
            <InfoOutlinedIcon className="log-mouseover" id="secondary-procedure-tooltip" description={JSON.stringify({ emrCaseId: emrCaseId })} style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
          </LightTooltip>
        </div>
      )
      }

      <div className="subtitle">
        {specialtyList.join(" & ")}
      </div>
      <div className="description">
        <span>Case ID: {emrCaseId}</span>
        <span>{date} {`(${diff} ${diff == 1 ? 'Day' : 'Days'} ago)`}</span>
        <span>{sTime} - {eTime}</span>
        <span>{roomName}</span>
      </div>
      {tagDisplays.length > 0 && <div className="tags">
        {tagDisplays}
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

      <div className="tags">
        {value && value.map((tag, i) => {
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
      </div>
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
    facilityName: "",
    gracePeriod: 0,
    outlierThreshold: 0
  });
  const { CASES, SPECIALTIES, PROCEDURES, ORS, isLoading } = DATA;
  const { facilityName, gracePeriod, outlierThreshold } = DATA;
  const [USERS, setUsers] = useState([]);

  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());

  useEffect(() => {
    if (!logger){
      return;
    }
    logger.manualAddLog('session', 'open-case-discovery');
    logger.exitLogs.push(['session', 'close-case-discovery', "Exited/Refreshed page"]);
    return () => {
      if (!logger){
        return
      }
      logger.exitLogs = [];
      logger.manualAddLog('session', 'close-case-discovery', "Redirected page");
    }
  }, [logger])

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
          console.time('Process Filters')
          result = result.data
          let spec = [];
          let proc = [];
          let ors = [];
          result.forEach((c) => {
            const { procedures, roomName } = c;

            procedures.forEach((p) => {
              const { specialtyName, procedureName } = p;
              if (spec.indexOf(specialtyName) < 0) {
                spec.push(specialtyName);
              }
              if (proc.indexOf(procedureName) < 0) {
                proc.push(procedureName);
              }
            });
            if (ors.indexOf(roomName) < 0) {
              ors.push(roomName);
            }
          });

          setData({
            CASES: result,
            SPECIALTIES: spec,
            PROCEDURES: proc,
            ORS: ors,
            isLoading: false
          })
          console.timeEnd('Process Filters')

        }).catch((error) => {
          console.log("uh oh")
        })

    }

    fetchCases();

    fetchUsers();

    fetchFacilityConfig();

  }, []);

  useEffect(() => {
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
  });


  // Scrol to top on filter change 
  const topElementRef = useRef(null)
  const scrollToTop = () => {
    topElementRef.current.scrollIntoView(true);
    document.getElementById("cases-id").scrollTop -= 100;
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
    roomNames: []
  });
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
      (!from || moment(c.wheelsIn).isAfter(from)) &&
      (!to || moment(c.wheelsOut).isBefore(to)) &&
      //given the filtered `specialties` list - check that the case has at least ONE matching specialty (including secondary specialties)
      (!specialties.length || c.procedures && c.procedures.some((p) => specialties.includes(p.specialtyName))) &&
      //Given the filtered `procedures` list match every item with at least one procedure (including secondary procedures)
      (!procedures.length || procedures.every((p) => c.procedures && c.procedures.some(pr => pr.procedureName.toLowerCase().includes(p.toLowerCase())))) &&
      (!roomNames.length || roomNames.includes(c.roomName)) &&
      (!searchData.tags.length || (includeAllTags == 1 && searchData.tags.every((t) => cTags.includes(t))) || (includeAllTags == 0 && cTags.some((t) => searchData.tags.includes(t))))
    );
  })
  filterCases.sort((a, b) => moment(b.wheelsIn).valueOf() - moment(a.wheelsIn).valueOf())

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

  // Set CaseID for detailed case view
  const [caseId, setCaseId] = React.useState(null);
  const handleChangeCaseId = (cId) => {
    //Handle close case
    if (!cId && DETAILED_CASE) {
      logger && logger.manualAddLog('click', 'close-case', DETAILED_CASE.metaData && DETAILED_CASE.metaData.emrCaseId);
    }
    setCaseId(cId);
  }
  const [numShownCases, setNumShownCases] = React.useState(10);
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
              <Case key={i} onClick={() => handleChangeCaseId(c.caseId)} {...c} />
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


  const renderTagInfo = () => {
    const result = []
    const tag_info = TAG_INFO;
    tag_info['Late First Case'] = `Identifies cases that were the first case of the block and had a late start beyond the ${facilityName} specified grace period of ${globalFunctions.formatSecsToTime(gracePeriod, true, true)}`;
    tag_info['Slow Turnover'] = `Identifies cases where turnover time preceding case was above ${facilityName} defined outlier threshold of ${globalFunctions.formatSecsToTime(outlierThreshold, true, true)}`;
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
      result.push(<Grid item xs={9} className="info-column" key='info-col'>{value}</Grid>);
    }

    return (

      <Grid container spacing={0} className="subtle-subtext">
        {result}
      </Grid>

    )
  }

  const searchView = (
    <Grid container spacing={0} className="case-discovery-search">
      <Grid item xs className="filters">
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
      <Grid item xs style={{ position: 'relative' }}>
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
            {(numShownCases < filterCases.length) && <Button variant="contained" className="load-more log-click" id="load-more" disableElevation onClick={() => setNumShownCases(numShownCases + 10)}>
              Load More
          </Button>}
          </div>
        )
        }


      </Grid>
    </Grid>
  )

  // const [isLoading, setIsLoading] = useState(true);
  const [DETAILED_CASE, setDetailedCase] = useState(null);

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
            logger && logger.manualAddLog('click', `swap-case`, { emrCaseId: result.metaData.emrCaseId });
          }

          setDetailedCase(result)
        }).catch((error) => {
          console.log("oh no " + error)
        }).finally(() => {

        });
    }
    fetchCases()


  }, [caseId]);

  return (
    <section className="case-discovery">
      <div hidden={caseId}>{searchView}</div>
      <DetailedCase {...DETAILED_CASE} USERS={USERS} handleChangeCaseId={handleChangeCaseId} hidden={!caseId} showEMMReport={showEMMReport} />
    </section>
  );
}



function DetailedCase(props) {
  const { hidden, showEMMReport, handleChangeCaseId, USERS, } = props;
  if (props.metaData == null) {
    return <div hidden={hidden}><LoadingIndicator /></div>
  }

  const COMPLICATIONS = useSelector(makeSelectComplications());
  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());

  const { metaData: { caseId, emrCaseId, roomName, surgeonId, wheelsIn, wheelsOut, scheduledStart, startTime, endTime,
    duration, departmentId, intubationPlacement, intubationRemoval, intubationType, isLeftSided, isRightSided,
    procedures, timeline } } = props;
  const { roomSchedule: { blockStart, blockEnd, roomCases }, procedureDistribution, emmStatus: { reportId, isPublished }, hl7Parameters, tags } = props;

  const procedureTitle = procedures[0].procedureName;

  const dayDiff = moment().diff(moment(wheelsIn), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const blockStartTime = moment(blockStart, 'HH:mm:ss');
  const blockEndTime = moment(blockEnd, 'HH:mm:ss');
  const bStartTime = globalFunctions.getDiffFromMidnight(blockStartTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsIn, 'minutes') / 60;
  const bEndTime = globalFunctions.getDiffFromMidnight(blockEndTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsOut, 'minutes') / 60;

  const earliestStartTime = roomCases.reduce((min, c) => globalFunctions.getDiffFromMidnight(c.wheelsIn, 'minutes') / 60 < min ? globalFunctions.getDiffFromMidnight(c.wheelsIn, 'minutes') / 60 : min, bStartTime) - 1;
  const latestEndTime = roomCases.reduce((max, c) => globalFunctions.getDiffFromMidnight(c.wheelsOut, 'minutes') / 60 > max ? globalFunctions.getDiffFromMidnight(c.wheelsOut, 'minutes') / 60 : max, bEndTime) + 1;
  const scheduleDuration = (latestEndTime) - (earliestStartTime);

  const description = (
    <div>
      <span>Case ID: {emrCaseId}</span>
      <span>Surgeon ID: {`${surgeonId}`}</span>
      <span>{date} {`(${dayDiff} ${dayDiff == 1 ? 'Day' : 'Days'} ago)`}</span>
      <span>{roomName}</span>
      {intubationType && <span>Intubation Type: {intubationType}</span>}
    </div>
  );

  const requestEMMDescription = (
    <div>
      <span>Case ID: {emrCaseId}</span>
      <span>{date} {`(${dayDiff} ${dayDiff == 1 ? 'Day' : 'Days'} ago)`}</span>
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
  const handleOpenRequestEMM = (open) => {
    setOpenRequestEMM(open);
    logger && logger.manualAddLog('click', open ? 'openEMMRequest' : 'closeEMMRequest', !open && !isRequestSubmitted ? 'Closed without submission' : '');
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
    let complicationList = requestData.complications.map((c) => c.id);
    let jsonBody = {
      "roomName": roomName,
      "specialty": ["58ABBA4B-BEFC-4663-8373-6535EA6F1E5C"],
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
    globalFunctions.genericFetch(process.env.REQUESTEMM_API, 'post', userToken, jsonBody)
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

          <div className="back" onClick={() => handleChangeCaseId(null)} ><ArrowBack style={{ fontSize: 12, marginBottom: 2 }} /> Back</div>
          <div className="case-header">

            <div className="case-title">{procedureTitle}</div>

            <div className="button">{reportButton()}</div>
          </div>
          {procedureList.length > 0 && (
            <div className="case-description" style={{ marginBottom: 0 }}>
              {`Secondary Procedure${procedureList.length == 1 ? '' : 's'}`}
              <LightTooltip arrow title={
                <div>
                  <span>{`Secondary Procedure${procedureList.length > 1 ? 's' : ''}`}</span>
                  <ul style={{ margin: '4px 0px' }}>
                    {procedureList.map((line, index) => { return <li key={index}>{line}</li> })}
                  </ul>
                </div>
              }
              >
                <InfoOutlinedIcon className="log-mouseover" id="secondary-procedure-tooltip" description={JSON.stringify({ emrCaseId: emrCaseId })} style={{ fontSize: 16, margin: '0 0 4px 4px' }} />
              </LightTooltip>
            </div>
          )
          }
          <div className="case-description">
            <div className="case-specialty">{specialtyList.join(" & ")}</div>
            {description}
          </div>
          <div className="tags">
            {displayTags(tags, emrCaseId)}
          </div>

          <div className="timing-graphs" id="timing-graphs">
            <Grid container spacing={0}>
              <Grid item xs={8} className="timing">
                <Grid container spacing={0} className="start-timing">
                  <Grid item xs={4} className="scheduled-start">
                    <div className="timing-header">Scheduled Start</div>
                    <div className="timing-value">Started at</div>
                    <div className="timing-header">Laterality</div>
                    <div className="timing-value">{laterality}</div>
                  </Grid>
                  <Grid item xs={3} className="actual-start">

                    <div className="timing-header">{moment(scheduledStart).format("HH:mm:ss")}</div>
                    <div className="timing-value">{moment(wheelsIn).format("HH:mm:ss")}</div>
                    <div className="laterality">
                      {lateralityIcon}
                    </div>
                  </Grid>
                  <Grid item xs={5} className="difference">
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
              <Grid item xs className="procedure-time">
                <ProcedureDistribution {...procedureDistribution} duration={duration} />
              </Grid>
            </Grid>
            <HL7Chart hl7Data={hl7Parameters} timeline={timeline} />


          </div>

        </Grid>
      }
      <Grid item xs className="schedule">
        <div className="header">
          <div>{`${roomName}${!blockStart ? ' Off' : ''} Block`}</div>
          <div>{moment(scheduledStart).format('MMMM DD, YYYY')}</div>

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
          {Array.from({ length: Math.round(scheduleDuration) }, (x, i) => {
            const now = moment().toDate()
            let cTime = Math.round(earliestStartTime) + i;
            now.setHours(cTime);
            now.setMinutes(0);
            return (
              <div className="hour-marker"
                style={{
                  // top: `${i * HOUR_SIZE}px`,
                  height: `${HOUR_SIZE}px`,
                }}>
                <div >{moment(now).format("HH:mm")}</div>
              </div>
            )
          })}
          {blockStart && <LightTooltip
            title={`Block hours: ${moment(blockStartTime).format('HH:mm')} - ${moment(blockEndTime).format('HH:mm')}`}
            placement='left'
          >
            <div className="absolute"
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

            const startMins = globalFunctions.getDiffFromMidnight(wheelsIn, 'minutes') - (earliestStartTime * 60);
            const endMins = globalFunctions.getDiffFromMidnight(wheelsOut, 'minutes') - (earliestStartTime * 60);
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
    </Grid>
  )
}


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
        let left = parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width'));
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
      x: {
        lines: [{ "value": duration, "text": globalFunctions.formatSecsToTime(duration, true, true), "class": "marker" }]
      },
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
  const { hl7Data, timeline } = props;
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
      logger && logger.manualAddLog('mouseover', `hl7-tooltip`, { xValue: time, zValue: text, name: d.name })
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
    logger && logger.manualAddLog('mouseover', `hl7-tooltip`, { xValue: time, yValue: hl7 && hl7.value, zValue: value && value.text, name: hl7 && hl7.name })
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
      // top: 20
    },
    size: hasHL7Data ? {} : {
      height: 175
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
            return globalFunctions.formatSecsToTime(x);
          }
        },
        padding: hasHL7Data ? {
          left: max * .025,
          right: max * .025,
        } : {
          left: max * .05,
          right: max * .05,
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
            return parseInt(x) == parseFloat(x) ? x : parseFloat(x).toFixed(2)
          }

        },
        show: hasHL7Data,
        // show: false,
        padding: {
          top: 20,
          // bottom: 0
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
        // chart.resize();
      }, 200)
    }
  });

  // Move marker behind the ggraph for tooltip to still display
  useEffect(() => {
    var content = document.getElementById('hl7-chart').getElementsByClassName('c3-grid c3-grid-lines')[0];
    var parent = content.parentNode;
    parent.insertBefore(content, parent.firstChild)
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
    logger && logger.manualAddLog('click', 'change-hl7-selection', title);
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
                <div className={`${i == index && 'selected'} hl7-value`} onClick={() => setIndex(i)}>{d.abbreviation}</div>
              )
            })}
          </div>
        </div>}
        <div style={{ width: '100%' }}>
          <div className="sub header center">{hasHL7Data ? `${hl7Data[index].title} (${hl7Data[index].unit})` : ''}</div>
          <C3Chart ref={chartRef} {...data} />
        </div>
      </div>


    </div>
  )
}






