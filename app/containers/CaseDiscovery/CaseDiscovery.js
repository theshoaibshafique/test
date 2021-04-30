/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useReducer, useState } from 'react';
import './style.scss';
import { FormControl, Grid, InputAdornment, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import { CASES, SPECIALTIES, PROCEDURES, DATE_OPTIONS, ORS, TAGS } from './constants';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MagnifyingGlass from './icons/MagnifyingGlass.svg';
import moment from 'moment/moment';
const useStyles = makeStyles((theme) => ({
  inputLabel: {
    marginBottom: 10,
    marginTop: 30
  },
  search: {
    marginBottom: 10
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

function Case(props){
  const { specialtyProcedures, caseId, startTime, endTime, roomName, tags } = props;
  const sTime = moment(startTime).format("hh:mm A");
  const eTime = moment(endTime).format("hh:mm A");
  const diff = moment(endTime).diff(moment(startTime));
  const date = moment(endTime).format("MMMM DD");
  const {specialtyName, procedureName} = specialtyProcedures && specialtyProcedures.length && specialtyProcedures[0]

  const description = `Case ID ${caseId}  Started at ${sTime} / Ended at ${eTime} ${date} (${diff} Days ago)  ${roomName}`
  return (
    <div className="case">
      <div className="title">
        {procedureName}
      </div>
      <div className="subtitle">
        {specialtyName}
      </div>
      <div className="description">
        {description}
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
    // specialties: [SPECIALTIES[0]],
    // procedures: [PROCEDURES[0]]
  });

  const handleChange = (event, value) => {
    console.log(value)
    setSearchData({
      name: event,
      value: value
    })
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
            InputProps={{
              startAdornment: <InputAdornment position="start"><img src={MagnifyingGlass} /></InputAdornment>,
            }}
            variant="outlined"
          />

          <InputLabel className={classes.inputLabel}>Filter by specialty</InputLabel>
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

          <InputLabel className={classes.inputLabel}>Filter by specialty</InputLabel>
          <Autocomplete
            multiple
            size="small"
            id="specialties"
            options={SPECIALTIES}
            getOptionLabel={option => option.display}
            value={searchData.specialties}
            onChange={(event, value) => handleChange('specialties', value)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                name="specialties"
                placeholder="Filter by specialties"
              />
            )}
          />

          <InputLabel className={classes.inputLabel}>Filter by procedure</InputLabel>
          <Autocomplete
            multiple
            size="small"
            id="procedures"
            options={PROCEDURES}
            getOptionLabel={option => option.display}
            value={searchData.procedures}
            onChange={(event, value) => handleChange('procedures', value)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                name="procedures"
                placeholder="Filter by procedure"
              />
            )}
          />

          <InputLabel className={classes.inputLabel}>Operating room</InputLabel>
          <Autocomplete
            multiple
            size="small"
            id="roomNames"
            options={ORS}
            getOptionLabel={option => option.display}
            value={searchData.roomNames}
            onChange={(event, value) => handleChange('roomNames', value)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                name="roomNames"
                placeholder="Filter by OR"
              />
            )}
          />

          <InputLabel className={classes.inputLabel}>Tags</InputLabel>
          <Autocomplete
            multiple
            size="small"
            id="tags"
            options={TAGS}
            getOptionLabel={option => option}
            value={searchData.tags}
            onChange={(event, value) => handleChange('tags', value)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                name="tags"
                placeholder="Filter by tags"
              />
            )}
          />
        </Grid>
        <Grid item xs className="cases">
          {CASES.map((c) => (<Case {...c} />))}
        </Grid>
      </Grid>
    </section>
  );
}
