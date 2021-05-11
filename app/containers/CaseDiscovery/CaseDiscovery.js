/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useReducer, useState } from 'react';
import './style.scss';
import { Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Radio, RadioGroup, Select, TextField, withStyles } from '@material-ui/core';
import { DATE_OPTIONS, TAGS, DETAILED_CASE } from './constants';
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
import TurnoverDuration from './icons/TurnoverDuration.svg';
import moment from 'moment/moment';
import CloseIcon from '@material-ui/icons/Close';
import { LightTooltip, StyledRadio } from '../../components/SharedComponents/SharedComponents';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import globalFunctions from '../../utils/global-functions';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30,
    color: '#323232',
    opacity: .8
  },
  clear: {
    fontFamily: 'Helvetica',
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
      return <img src={Flagged} />
    case "hypothermia":
      return <img src={Hypothermia} />
    case "hypoxia":
      return <img src={Hypoxia} />
    case "hypotension":
      return <img src={Hypotension} />
    case "procedure duration":
      return <img src={CaseDuration} />
    case "late start":
      return <img src={LateStart} />
    case "turnover duration":
      return <img src={TurnoverDuration} />
    case "first case":
      return <img src={FirstCase} />
    case "eM&M":
      return <img src={eMM} />
    default:
      break;
  }
}

function Case(props) {
  const { procedures, emrCaseId, wheelsIn, wheelsOut, roomName, tags, onClick } = props;
  const sTime = moment(wheelsIn).format("h:mm A");
  const eTime = moment(wheelsOut).format("h:mm A");
  const diff = moment().diff(moment(wheelsIn), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const { specialtyName, procedureName } = procedures && procedures.length && procedures[0];

  const tagDisplays = tags.map((tag, i) => {
    let desc = tag.description || "";
    tag = tag.tagName || tag;
    return (
      <LightTooltip title={desc} arrow={true}>
        <span className={`case-tag ${tag}`} key={tag}>
          <span>
            {getTag(tag)}
          </span>
          <div className="display">{tag}</div>

        </span>
      </LightTooltip>

    )
  })


  return (
    <div className="case" key={emrCaseId}  >
      <div className="title" onClick={onClick}>
        {procedureName}
      </div>
      <div className="subtitle">
        {specialtyName}
      </div>
      <div className="description">
        <span>Case ID {emrCaseId}</span>
        <span>{date} ({diff} Days ago)</span>
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
  const { title, options, id, handleChange, searchData, placeholder, includeToggle, includeAllTags, setIncludeAllTags, freeSolo, groupBy } = props;
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
            <FormControlLabel value={1} control={<StyledRadio checked={includeAll == 1} color="primary" onChange={(e) => setIncludeAllTags(e.target.value)} />} label={<span className="include-label">Matches all tags</span>} />
            <FormControlLabel value={0} control={<StyledRadio checked={includeAll == 0} color="primary" onChange={(e) => setIncludeAllTags(e.target.value)} />} label={<span className="include-label">Matches any of these tags</span>} />
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

  return {
    ...state,
    [event.name]: event.value
  }
}


export default function CaseDiscovery(props) { // eslint-disable-line react/prefer-stateless-function
  const { showEMMReport, userFacility, userToken } = props;
  const [CASES, setCases] = useState([]);
  const [SPECIALTIES, setSpecialties] = useState([]);
  const [PROCEDURES, setProcedures] = useState([]);
  const [ORS, setORs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      const result = await globalFunctions.axiosFetch('https://utils.surgicalsafety.com/api/case_discovery/v1/' + 'cases?facility_id=' + userFacility, 'get', userToken, {})
        .then(result => {
          result = result.data
          setCases(result);
          console.time('timeTest');
          let spec = new Set();
          let proc = new Set();
          let ors = new Set();
          result.forEach((c) => {
            const { procedures, roomName } = c;

            procedures.forEach((p) => {
              const { specialtyName, procedureName } = p;
              spec.add(specialtyName);
              proc.add(procedureName);
            })

            ors.add(roomName);
          });

          setSpecialties(Array.from(spec));
          setProcedures(Array.from(proc));
          setORs(Array.from(ors));
          console.timeEnd('timeTest');
        }).catch((error) => {
          console.log("uh oh")
          setCases(generateFakeCases(100));
        }).finally(() => {
          setIsLoading(false);
        });
    }
    fetchCases()


  }, []);

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
    console.log(event, value)
    setSearchData({
      name: event,
      value: value
    })
  }


  const specialties = searchData.specialties.map((s) => s.display || s)
  const procedures = searchData.procedures.map((s) => s.display || s)
  const roomNames = searchData.roomNames.map((s) => s.display || s)
  const { to, from } = searchData.date;
  // for any
  const [includeAllTags, setIncludeAllTags] = React.useState(1);

  //Filter cases
  let filterCases = CASES.filter((c) => {
    let cTags = c.tags.map((t) => t.tagName);
    return (
      (`${c.emrCaseId}`.includes(searchData.caseId)) &&
      (!from || moment(c.wheelsIn).isAfter(from)) &&
      (!to || moment(c.wheelsOut).isBefore(to)) &&
      (!specialties.length || specialties.includes(c.procedures && c.procedures[0].specialtyName)) &&
      (!procedures.length || procedures.every((p) => c.procedures && c.procedures[0].procedureName.toLowerCase().includes(p.toLowerCase()))) &&
      (!roomNames.length || roomNames.includes(c.roomName)) &&
      (!searchData.tags.length || (includeAllTags == 1 && searchData.tags.every((t) => cTags.includes(t))) || (includeAllTags == 0 && cTags.some((t) => searchData.tags.includes(t))))
    );
  })
  filterCases.sort((a, b) => moment(b.wheelsOut).valueOf() - moment(a.wheelsOut).valueOf())

  // for Sorting the cases
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Check if sorting by oldest
  const [isOldest, setIsOldest] = React.useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    setIsOldest(event.target.value)
  };
  if (isOldest) {
    filterCases = filterCases.reverse()
  }

  const isCustomDate = searchData.date.selected == "Custom";

  // Set CaseID for detailed case view
  const [caseId, setCaseId] = React.useState(null);

  const [numShownCases, setNumShownCases] = React.useState(5);


  const getCasesView = () => {
    if (filterCases && filterCases.length) {
      return filterCases.map((c, i) => (<Case key={i} onClick={() => setCaseId(c.caseId)} {...c} />))
        .slice(0, numShownCases)
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

  const searchView = (
    <Grid container spacing={5} className="case-discovery-search">
      <Grid item xs className="filters">
        <TextField
          size="small"
          fullWidth
          id="filled-start-adornment"
          className={classes.search}
          placeholder="Search case ID#"
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
          title="Tags"
          placeholder="Filter by tags"
          options={TAGS}
          id="tags"
          handleChange={handleChange}
          searchData={searchData}
          includeToggle={true}
          includeAllTags={includeAllTags}
          setIncludeAllTags={setIncludeAllTags}
        />

      </Grid>
      <Grid item xs style={{ position: 'relative' }}>
        <div className="header">
          <div className="header-label">
            {`${filterCases && filterCases.length || 0} Cases`}
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
          <div className="cases">

            {getCasesView()}
            {(numShownCases < filterCases.length) && <Button variant="contained" className="load-more" disableElevation onClick={() => setNumShownCases(numShownCases + 10)}>
              Load More
          </Button>}
          </div>
        )
        }


      </Grid>
    </Grid>
  )

  console.log(caseId);
  return (
    <section className="case-discovery">
      <div hidden={caseId}>{searchView}</div>
      <DetailedCase {...DETAILED_CASE} setCaseId={setCaseId} hidden={!caseId} showEMMReport={showEMMReport} />
    </section>
  );
}

function DetailedCase(props) {
  const { blockStartTime, blockEndTime, roomName, schedule, procedures, reportId, setCaseId, caseId, hidden, showEMMReport } = props;
  const procedureTitle = procedures[0].procedureName;
  let [value, setValue] = React.useState(null);

  const startTime = getDiffFromMidnight(blockStartTime);
  const endTime = getDiffFromMidnight(blockEndTime);
  const duration = (endTime + 1) - (startTime - 1);
  console.log("startTime " + startTime)
  console.log("endTime " + endTime)
  console.log("duration " + duration)
  // Hour block size in pixels
  const HOUR_SIZE = 160;
  return (
    <Grid container spacing={0} className="case-discovery-detailed" hidden={hidden}>
      <Grid item xs className="detailed-case">
        <div className="back" onClick={() => setCaseId(null)} ><ArrowBack style={{ fontSize: 12, marginBottom: 2 }} /> Back</div>
        <div className="case-header">
          <div className="case-title">{procedureTitle}</div>
          <div className="button"><Button variant="outlined" className="primary" onClick={() => showEMMReport(reportId)}>Open Report</Button></div>
        </div>
        <div className="case-description">
          <div className=""></div>
          <div></div>
        </div>
      </Grid>
      <Grid item xs className="schedule">
        <div className="header">
          {roomName} — {moment(blockStartTime).format('DD MMM')}.
        </div>
        <div className="timeline relative"
          style={{
            height: `${duration * HOUR_SIZE}px`
          }}
        >
          {/* Highlight Scheduled block */}
          <div className="scheduled-block absolute"
            style={{
              top: `${(duration - startTime) * HOUR_SIZE}px`,
              height: `${(endTime - startTime) * HOUR_SIZE}px`
            }}
          >
          </div>
          {/* Add time markers */}
          {Array.from({ length: duration }, (x, i) => {
            const now = moment().toDate()
            let cTime = startTime - 1 + i;
            now.setHours(cTime);
            now.setMinutes(0);
            return (
              <div className="hour-marker"
                style={{
                  top: `${i * HOUR_SIZE}px`,
                  height: `${HOUR_SIZE}px`,
                  padding: 12
                }}>
                {moment(now).format("h:mm a")}
              </div>
            )
          })}
          {/* Display all cases given  */}
          {schedule.map((c) => {
            const { procedures, startTime, endTime } = c;
            const procedure = procedures[0].procedureName;
            const startMins = getDiffFromMidnight(startTime, 'minutes') - getDiffFromMidnight(blockStartTime, 'minutes') + 60;
            const endMins = getDiffFromMidnight(endTime, 'minutes') - getDiffFromMidnight(blockStartTime, 'minutes') + 60;
            return (
              <div className={`absolute case-block ${c.caseId == caseId && 'is-current-case'}`}
                onClick={() => setCaseId(c.caseId)}
                style={{
                  top: `${(startMins / 60) * HOUR_SIZE}px`,
                  height: `${(endMins - startMins) / 60 * HOUR_SIZE}px`,
                }}>
                <div className="case-title">{procedure}</div>
                <div className="case-time">{moment(startTime).format("h:mm")} - {moment(endTime).format("h:mm")}</div>
              </div>
            )
          })}

        </div>
      </Grid>
    </Grid>
  )
}

function getDiffFromMidnight(timeString, unit = 'hours') {
  return moment(timeString).diff(moment(timeString).startOf('day'), unit)
}




function momentRandom(end = moment(), start) {
  const endTime = +moment(end);
  const randomNumber = (to, from = 0) =>
    Math.floor(Math.random() * (to - from) + from);

  if (start) {
    const startTime = +moment(start);
    if (startTime > endTime) {
      throw new Error('End date is before start date!');
    }
    return moment(randomNumber(endTime, startTime));
  }
  return moment(randomNumber(endTime));
}

function fakeCase() {
  var randomStart = momentRandom(moment(), moment().subtract(1, 'years'));
  var randomSpecialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
  var randomProcedure = PROCEDURES[Math.floor(Math.random() * PROCEDURES.length)];
  return {
    "procedures": [
      {
        "specialtyName": randomSpecialty.display,
        "procedureName": randomProcedure.display
      }
    ],
    "caseId": Math.floor(100000 + Math.random() * 900000),
    "startTime": randomStart.format(),
    "endTime": randomStart.add(Math.ceil(Math.random() * 12), 'hours').format(),
    "roomName": ORS[Math.floor(Math.random() * ORS.length)].display,
    "tags": TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3).map((tag) => {
      return { "title": tag, "description": "Hey this is a placeholder description. idk what to write here" }
    })
  }
}

function generateFakeCases(numCases) {
  return Array.from({ length: numCases }, () => fakeCase());
}


