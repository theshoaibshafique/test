/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useReducer, useState } from 'react';
import './style.scss';
import { Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Radio, RadioGroup, Select, TextField, withStyles } from '@material-ui/core';
import { SPECIALTIES, PROCEDURES, DATE_OPTIONS, ORS, TAGS, DETAILED_CASE } from './constants';
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
import { StyledRadio } from '../../components/SharedComponents/SharedComponents';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import { groupBy } from 'lodash';

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



function Case(props) {
  const { specialtyProcedures, caseId, startTime, endTime, roomName, tags, onClick } = props;
  const sTime = moment(startTime).format("hh:mm A");
  const eTime = moment(endTime).format("hh:mm A");
  const diff = moment().diff(moment(startTime), 'days');
  const date = moment(endTime).format("MMMM DD");
  const { specialtyName, procedureName } = specialtyProcedures && specialtyProcedures.length && specialtyProcedures[0];


  const getTag = (tag) => {
    switch (`${tag}`.toLowerCase()) {
      case "flagged":
        return <img src={Flagged} />
      case "hypothermia":
        return <img src={Hypothermia} />
      case "hypoxia":
        return <img src={Hypoxia} />
      case "hypotension":
        return <img src={Hypotension} />
      case "case duration":
        return <img src={CaseDuration} />
      case "late start":
        return <img src={LateStart} />
      case "turnover duration":
        return <img src={TurnoverDuration} />
      case "first case":
        return <img src={FirstCase} />
      case "emm":
        return <img src={eMM} />
      default:
        break;
    }
  }

  const tagDisplays = tags.map((tag, i) => {
    tag = tag.display || tag;
    return (
      <span className={`case-tag ${tag}`} key={tag}>
        <span>
          {getTag(tag)}
        </span>
        <div className="display">{tag}</div>

      </span>
    )
  })


  return (
    <div className="case" key={caseId}  >
      <div className="title" onClick={onClick}>
        {procedureName}
      </div>
      <div className="subtitle">
        {specialtyName}
      </div>
      <div className="description">
        <span>Case ID {caseId}</span>
        <span>Started at {sTime} / Ended at {eTime}</span>
        <span>{date} ({diff} Days ago)</span>
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

      {includeToggle && (value && value.length > 1) && (
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
  // const { children, index, ...other } = props;
  //TODO: replace min/maxDate
  const minDate = moment("2019-08-15");
  const maxDate = moment();

  const classes = useStyles();
  const defaultDate = {
    selected: "Any Time",
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


  const specialties = searchData.specialties.map((s) => s.display)
  const procedures = searchData.procedures.map((s) => s.display || s)
  const roomNames = searchData.roomNames.map((s) => s.display)
  const { to, from } = searchData.date;
  // for any
  const [includeAllTags, setIncludeAllTags] = React.useState(1);

  //Filter cases
  let filterCases = CASES.filter((c) => {
    return (
      (`${c.caseId}`.includes(searchData.caseId)) &&
      (!from || moment(c.startTime).isAfter(from)) &&
      (!to || moment(c.endTime).isBefore(to)) &&
      (!specialties.length || specialties.includes(c.specialtyProcedures[0].specialtyName)) &&
      (!procedures.length || procedures.every((p) => c.specialtyProcedures[0].procedureName.toLowerCase().includes(p.toLowerCase()))) &&
      (!roomNames.length || roomNames.includes(c.roomName)) &&
      (!searchData.tags.length || (includeAllTags == 1 && searchData.tags.every((t) => c.tags.includes(t))) || (includeAllTags == 0 && c.tags.some((t) => searchData.tags.includes(t))))
    );
  })
  filterCases.sort((a, b) => moment(b.endTime).valueOf() - moment(a.endTime).valueOf())

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
            <MenuItem key={"Any Time"} value={"Any Time"} >
              <div className="empty-date">Any Time</div>
            </MenuItem>
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
          title="Operating room"
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
        <div className="cases">

          {getCasesView()}
          {(numShownCases < filterCases.length) && <Button variant="contained" className="load-more" disableElevation onClick={() => setNumShownCases(numShownCases + 10)}>
            Load More
          </Button>}
        </div>

      </Grid>
    </Grid>
  )

  console.log(caseId)

  return (
    <section className="case-discovery">
      <div hidden={caseId}>{searchView}</div>
      <div hidden={!caseId} className="case-discovery-detailed">
        <DetailedCase {...DETAILED_CASE} setCaseId={setCaseId} />


      </div>
    </section>
  );
}

function DetailedCase(props) {
  const { title, setCaseId, caseId } = props;
  let [value, setValue] = React.useState(null);
  return (
    <div>
      <div className="back" onClick={() => setCaseId(null)} ><ArrowBack style={{ fontSize: 12, marginBottom: 2 }} /> Back</div>

    </div>
  )
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
    "specialtyProcedures": [
      {
        "specialtyName": randomSpecialty.display,
        "procedureName": randomProcedure.display
      }
    ],
    "caseId": Math.floor(100000 + Math.random() * 900000),
    "startTime": randomStart.format(),
    "endTime": randomStart.add(Math.ceil(Math.random() * 12), 'hours').format(),
    "roomName": ORS[Math.floor(Math.random() * ORS.length)].display,
    "tags": TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.random() * 3)
  }
}

function generateFakeCases(numCases) {
  return Array.from({ length: numCases }, () => fakeCase());
}

const CASES = generateFakeCases(100);
