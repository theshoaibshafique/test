/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useReducer, useState } from 'react';
import './style.scss';
import { Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Radio, RadioGroup, Select, TextField, withStyles } from '@material-ui/core';
import { SPECIALTIES, PROCEDURES, DATE_OPTIONS, ORS, TAGS } from './constants';

import Autocomplete from '@material-ui/lab/Autocomplete';
import MagnifyingGlass from './icons/MagnifyingGlass.svg';
import ArrowsDownUp from './icons/ArrowsDownUp.svg';
import moment from 'moment/moment';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles((theme) => ({
  inputLabel: {
    marginBottom: 10,
    marginTop: 30
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

const getPresetDates = (option) => {
  switch (option) {
    case 'Any Time':
      return { from: moment("2020-08-15"), to: moment('2021-04-04') }
    case 'Last 24 hours':
      return { from: moment().subtract(1, 'days'), to: moment() }
    case 'Last week':
      return { from: moment().subtract(7, 'days'), to: moment() }
    case 'Last month':
      return { from: moment().subtract(1, 'months'), to: moment() }
    case 'Last year':
      return { from: moment().subtract(1, 'years'), to: moment() }
    default:
      return {}
  }
}

const searchReducer = (state, event) => {
  if (event.reset) {
    return {
      date: {
        selected: null,
        from: moment("2020-08-15"),
        to: moment('2021-04-04')
      },
      specialties: {},
      procedures: {}
    }
  }

  if (event.name == 'date') {
    event.value = {
      selected: event.value.key,
      ...getPresetDates(event.value.key)
    }
  }

  console.log(event.value)
  return {
    ...state,
    [event.name]: event.value
  }
}

function Case(props) {
  const { specialtyProcedures, caseId, startTime, endTime, roomName, tags } = props;
  const sTime = moment(startTime).format("hh:mm A");
  const eTime = moment(endTime).format("hh:mm A");
  const diff = moment().diff(moment(startTime), 'days');
  const date = moment(endTime).format("MMMM DD");
  const { specialtyName, procedureName } = specialtyProcedures && specialtyProcedures.length && specialtyProcedures[0];

  const tagDisplays = tags.map((tag) => {
    return (
      <span className="case-tag">
        <span><div className="display">{tag.display || tag}</div></span>
        <span>

        </span>
      </span>
    )
  })

  const description = `Case ID ${caseId}  Started at ${sTime} / Ended at ${eTime} ${date} (${diff} Days ago)  ${roomName}`
  return (
    <div className="case" key={caseId}>
      <div className="title">
        {procedureName}
      </div>
      <div className="subtitle">
        {specialtyName}
      </div>
      <div className="description">
        {description}
      </div>
      {tagDisplays.length > 0 && <div className="tags">
        {tagDisplays}
      </div>}
    </div>
  )
}

const useStylesRadio = makeStyles({
  root: {
    '&:hover': {
      // backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#014F6E,#014F6E 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    // backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
});

function CustomRadio(props) {
  const classes = useStylesRadio();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.checkedIcon} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

function TagsSelect(props) {
  const { title, options, id, handleChange, searchData, classes, includeToggle, includeAllTags, setIncludeAllTags } = props;
  let [value, setValue] = React.useState(searchData[id]);
  let [includeAll, setIncludeAll] = React.useState(includeAllTags);

  useEffect(() => {
    setValue(searchData[id]);
  }, [props.searchData]);

  useEffect(() => {
    setIncludeAll(includeAllTags);
  }, [props.includeAllTags]);
  return (
    <div>
      <InputLabel className={classes.inputLabel}>{title}</InputLabel>
      <Autocomplete
        multiple
        size="small"
        id={id}
        options={options}
        disableClearable
        getOptionLabel={option => option.display || option}
        value={value || []}
        renderTags={() => null}
        onChange={(event, value) => handleChange(id, value)}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            name={id}
            placeholder={`Filter by ${id}`}
          />
        )}
      />

      {includeToggle && (
        <div className="include-toggle">
          <RadioGroup aria-label="position" name="position" value={includeAll}>
            <FormControlLabel value={1} control={<CustomRadio checked={includeAll == 1} small color="primary" onChange={(e) => setIncludeAllTags(e.target.value)} />} label={<span className="include-label">Match all tags (and)</span>} />
            <FormControlLabel value={0} control={<CustomRadio checked={includeAll == 0} small color="primary" onChange={(e) => setIncludeAllTags(e.target.value)} />} label={<span className="include-label">Matches any of these tags (or)</span>} />
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


export default function CaseDiscovery(props) { // eslint-disable-line react/prefer-stateless-function
  // const { children, index, ...other } = props;

  const classes = useStyles();
  const [searchData, setSearchData] = useReducer(searchReducer, {
    date: {
      selected: DATE_OPTIONS[0],
      from: moment("2020-08-15"),
      to: moment('2021-04-04')
    },
    caseId: "",
    specialties: [],
    procedures: [],
    tags: [],
    roomNames: []
  });
  // Change/update the filter
  const handleChange = (event, value) => {
    setSearchData({
      name: event,
      value: value
    })
  }


  const specialties = searchData.specialties.map((s) => s.display)
  const procedures = searchData.procedures.map((s) => s.display)
  const roomNames = searchData.roomNames.map((s) => s.display)

  // for any
  const [includeAllTags, setIncludeAllTags] = React.useState(1);

  //Filter cases
  console.log(includeAllTags)
  let filterCases = CASES.filter((c) => {
    return (
      (`${c.caseId}`.includes(searchData.caseId)) &&
      (!specialties.length || specialties.includes(c.specialtyProcedures[0].specialtyName)) &&
      (!procedures.length || procedures.includes(c.specialtyProcedures[0].procedureName)) &&
      (!roomNames.length || roomNames.includes(c.roomName)) &&
      (!searchData.tags.length || (includeAllTags == 1 && searchData.tags.every((t) => c.tags.includes(t))) || (includeAllTags == 0 && c.tags.some((t) => searchData.tags.includes(t))))
    );
  })
  filterCases.sort((a, b) => moment(b.endTime).valueOf() - moment(a.endTime).valueOf())


  // for Sorting the cases
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  return (
    <section className="case-discovery">
      <Grid container spacing={5} className="case-discovery-grid">
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

          <InputLabel className={classes.inputLabel}>Search by Date</InputLabel>
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

          <TagsSelect
            title="Filter by specialty"
            classes={classes}
            options={SPECIALTIES}
            id="specialties"
            handleChange={handleChange}
            searchData={searchData}
          />

          <TagsSelect
            title="Filter by procedure"
            classes={classes}
            options={PROCEDURES}
            id="procedures"
            handleChange={handleChange}
            searchData={searchData}
          />

          <TagsSelect
            title="Operating room"
            classes={classes}
            options={ORS}
            id="roomNames"
            handleChange={handleChange}
            searchData={searchData}
          />

          <TagsSelect
            title="Tags"
            classes={classes}
            options={TAGS}
            id="tags"
            handleChange={handleChange}
            searchData={searchData}
            includeToggle={true}
            includeAllTags={includeAllTags}
            setIncludeAllTags={setIncludeAllTags}
          />

        </Grid>
        <Grid item xs className="cases">
          <div className="header">
            <div className="header-label">
              {`Showing ${filterCases && filterCases.length || 0} cases`}
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

          {filterCases.map((c) => (<Case {...c} />))}
        </Grid>
      </Grid>
    </section>
  );
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

const CASES = generateFakeCases(500);
