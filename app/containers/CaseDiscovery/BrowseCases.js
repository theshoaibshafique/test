import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Modal, Radio, RadioGroup, Select, Slide, TextField, Tooltip, withStyles } from '@material-ui/core';
import moment from 'moment/moment';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MagnifyingGlass from './icons/MagnifyingGlass.svg';
import ArrowsDownUp from './icons/ArrowsDownUp.svg';
import { DATE_OPTIONS, TAGS, TAG_INFO } from './constants';
import { getTag, TagsSelect, useStyles } from './helper-components';
import { Case } from './Case';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import Close from './icons/Close.svg';
import { makeSelectIsAdmin, makeSelectLogger } from '../App/selectors';
import { NavLink } from 'react-router-dom';
import globalFunctions, { getCdnStreamCookies } from '../../utils/global-functions';
import { useSelector } from 'react-redux';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
    }
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

export function BrowseCases(props) {
  const {handleChangeCaseId, handleSaveCase} = props;
  const {CASES, SPECIALTIES, PROCEDURES, ORS, isLoading, savedCases} = props;
  const { facilityName, gracePeriod, outlierThreshold } = props;
  //TODO: replace min/maxDate
  const minDate = moment().subtract(100, 'years');
  const maxDate = moment();
  const defaultDate = {
    selected: DATE_OPTIONS[0],
    from: minDate,
    to: maxDate
  };
  const [numShownCases, setNumShownCases] = React.useState(10);
  const logger = useSelector(makeSelectLogger());

  const [searchData, setSearchData] = useReducer(searchReducer, {
    date: defaultDate,
    caseId: "",
    specialties: [],
    procedures: [],
    tags: [],
    roomNames: [],
    onlySavedCases: false
  });
  const classes = useStyles();

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

  // Change/update the filter
  const handleChange = (event, value) => {
    scrollToTop();

    setSearchData({
      name: event,
      value: value,
      logger: logger
    })
  }

  

  // for Sorting the cases
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Check if sorting by oldest
  const [isOldest, setIsOldest] = React.useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    if (!event.target.value) {
      logger && logger.manualAddLog('click', 'sort-cases', event.target.value ? 'oldest to recent' : 'recent to oldest');
      setIsOldest(event.target.value)
    }

  };

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

  if (isOldest) {
    filterCases = filterCases.reverse()
  }

  const isCustomDate = searchData.date.selected == "Custom";


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

  const renderTagInfo = () => {
    const result = []
    const tag_info = TAG_INFO;
    const isAdmin = makeSelectIsAdmin();
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
      result.push(<Grid item xs={9} className="info-column" key='info-col'>{value}</Grid>);
    }

    return (

      <Grid container spacing={0} className="subtle-subtext">
        {result}
      </Grid>

    )
  }

  const [showTagsModal, setShowTagsModal] = React.useState(false);

  const handleShowTagsModal = (show) => {
    if (!show) {
      logger && logger.manualAddLog('click', 'close-learn-more-tags', null);
    }
    setShowTagsModal(show);
  }

  
  return (
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
        {/* <RecommendedCases
          savedCases={savedCases}
          handleSaveCase={handleSaveCase}
          handleChangeCaseId={handleChangeCaseId}
        /> */}
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
}
