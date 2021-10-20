import React, { useEffect, useReducer, useRef, useState } from 'react';
import 'c3/c3.css';
import C3Chart from 'react-c3js';
import './style.scss';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, Modal, Slide, TextField, Tooltip, withStyles, Snackbar, Portal } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/Close';
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Flagged from './icons/Flag.svg';
import FullPerson from './icons/FullPerson.svg';
import HalfPerson from './icons/HalfPerson.svg';
import EmptyPerson from './icons/EmptyPerson.svg';
import Play from './icons/Play.svg';
import Close from './icons/Close.svg';
import Plus from './icons/Plus.svg';
import moment from 'moment/moment';

import { LightTooltip, SSTSwitch, StyledRadio } from '../../components/SharedComponents/SharedComponents';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import globalFunctions, { getCdnStreamCookies } from '../../utils/global-functions';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import ReactDOMServer from 'react-dom/server';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import { CSSTransition } from "react-transition-group";
import { log_norm_cdf, log_norm_pdf, getQuestionByLocation, getQuestionCount, getPresetDates } from './misc/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectComplications, makeSelectFirstName, makeSelectIsAdmin, makeSelectLastName, makeSelectLogger, makeSelectRoles, makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../App/selectors';

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import 'react-multi-carousel/lib/styles.css';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';
import { displayTags, TagsSelect, useStyles } from './misc/helper-components';
import { selectCases, selectDetailedCase, selectFlaggedClip, selectFlagReport, selectOverviewData, selectSavedCases } from '../App/cd-selectors';
import { setCases, setFlaggedClip, setOverviewTile, setRecentFlags, setRecentSaved, setRecommendations, showDetailedCase } from '../App/cd-actions';
export function DetailedCase(props) {
  const { hidden, handleChangeCaseId, USERS, isSaved, handleSaveCase, roomIds } = props;
  if (props.metaData == null) {
    return <div hidden={hidden}><LoadingIndicator /></div>
  }

  const COMPLICATIONS = useSelector(makeSelectComplications());
  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());
  const isAdmin = useSelector(makeSelectIsAdmin());
  const flagReport = useSelector(selectFlagReport());

  const { metaData: { caseId, emrCaseId, roomName, surgeonId, wheelsIn, wheelsInUtc, wheelsOut, scheduledStart, startTime, endTime,
    duration, departmentId, intubationPlacement, intubationRemoval, intubationType, isLeftSided, isRightSided,
    procedures, timeline }, flags } = props;
  const { roomSchedule: { blockStart, blockEnd, roomCases }, procedureDistribution, emmStatus: { reportId, isPublished }, hl7Parameters, tags } = props;

  const procedureTitle = procedures[0].procedureName;
  const specialtyTitle = procedures[0].specialtyName;

  const dayDiff = moment().endOf('day').diff(moment(wheelsIn).endOf('day'), 'days');
  const date = moment(wheelsOut).format("MMMM DD");
  const blockStartTime = moment(blockStart, 'HH:mm:ss');
  const blockEndTime = moment(blockEnd, 'HH:mm:ss');
  const bStartTime = globalFunctions.getDiffFromMidnight(blockStartTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsIn, 'minutes') / 60;
  const bEndTime = globalFunctions.getDiffFromMidnight(blockEndTime, 'minutes') / 60 || globalFunctions.getDiffFromMidnight(roomCases[0].wheelsOut, 'minutes') / 60;

  // Array of all roomCases start and end dates as moment objects.
  const startDates = roomCases.map(d => moment(d.wheelsIn));
  const endDates = roomCases.map(d => moment(d.wheelsOut));

  const blockStartDate = moment.min(startDates).clone().set({hour: blockStartTime.hour(), minute: blockStartTime.minute()});
  const earliestStartDate = moment.min([blockStartDate, ...startDates]);
  //We convert from mins to hours manually to get decimals
  const earliestStartTime = globalFunctions.getDiffFromMidnight(earliestStartDate, 'minutes') / 60;
  const blockEndDate = earliestStartDate.clone().set({hour: blockEndTime.hour(), minute: blockEndTime.minute()});
  const latestEndTime = moment.max([blockEndDate, ...endDates]);
  const scheduleDuration = latestEndTime.diff(earliestStartDate, 'hours') + 2;
  //Get # of days the schedule spans
  const totalDays = latestEndTime.clone().startOf('day').diff(earliestStartDate.clone().startOf('day'), 'days');
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
  const HOUR_SIZE = Math.max((windowDimensions.height - HEADER_SIZE) / (scheduleDuration), 54);
  const [openRequestEMM, setOpenRequestEMM] = React.useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = React.useState(false);

  const handleOpenRequestEMM = (open) => {
    setOpenRequestEMM(open);
    logger?.manualAddLog('click', open ? 'open-emm-request' : 'close-emm-request', !open && !isRequestSubmitted ? 'Closed without submission' : '');
  }

  const reportButton = () => {
    if (isRequestSubmitted) {

      return <LightTooltip title={"eM&M request submitted successfully"} arrow>
        <div><Button variant="outlined" className="primary disabled" onClick={() => null} disabled>Request eM&M</Button></div>
      </LightTooltip>
    } else if (dayDiff <= 21 && isAdmin) {
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
    // Reset add flag - show state to initial value new case is rendered.
    if (!showAddFlag) setShowAddFlag(true);
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

  // Flag submission state.
  const [showAddFlag, setShowAddFlag] = React.useState(true);
  const [isMayo, setIsMayo] = React.useState(() => userFacility === 'e47585ea-a19f-4800-ac53-90f1777a7c96');
  const [openAddFlag, setOpenAddFlag] = React.useState(false);

  // Flag clip publish/hide snack bar state.
  const [snackBarOpen, setSnackBackOpen] = React.useState(false);
  const [snackBarMsg, setSnackBackMsg] = React.useState('');

  // Flag clip snackbar open/close-toggle click handler.
  const toggleSnackBar = (state, msg = '') => {
    setSnackBackOpen(state);
    if(state === true) setSnackBackMsg(msg);
  };

  /*** FLAG SUBMISSION HANDLERS ***/
  const handleOpenAddFlag = open => {
    logger.manualAddLog('click', open ? 'open-add-flag' : 'close-add-flag')
    setOpenAddFlag(open);
  };

  // Update isMayo state to true if current userFacility val is mayo's facility id.
  useEffect(() => {
    if (userFacility) setIsMayo(userFacility === 'e47585ea-a19f-4800-ac53-90f1777a7c96');
  }, [userFacility]);

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
        logger?.manualAddLog('click', 'submit-validation-error', 'complication-empty');
        return;
      }
    } else if (requestData.complications.length < 1) {
      logger?.manualAddLog('click', 'submit-validation-error', 'complication-empty');
      setIsComplicationFilled(false);
      return;
    }
    if (!requestData.complicationDate) {
      logger?.manualAddLog('click', 'submit-validation-error', 'complication-date-empty');
      setIsComplicationDateFilled(false);
      return;
    }
    let complicationList = requestData.complications.map((c) => c.display);
    let jsonBody = {
      "roomName": roomName,
      "specialty": [specialtyTitle || "Unknown Specialty"],
      "procedure": [procedureTitle],
      "complications": requestData.complicationOther ? [...complicationList, requestData.complicationOther] : complicationList,
      "postOpDate": requestData.complicationDate,
      "operationDate": globalFunctions.formatDateTime(wheelsIn),
      "notes": requestData.notes,
      "usersToNotify": requestData.users.map((c) => c.id),
      "facilityName": userFacility
    }
    logger?.manualAddLog('click', 'submit-emm-request', jsonBody);
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
      logger?.connectListeners();
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
            {displayTags(tags, emrCaseId, false, true)}
            {((isAdmin || isMayo) && showAddFlag && flagReport && flags.length <= 0 && dayDiff <= 21) && <span className={`case-tag add-flag ${!flagReport ? 'disabled' : ''} `} onClick={(e) => { if (flagReport) handleOpenAddFlag(true) }} >
              <span><img src={Plus} /></span>
              <div className="display">Add Flag</div>
            </span>}
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
            <HL7Chart hl7Data={hl7Parameters} timeline={timeline} flags={flags} toggleSnackBar={toggleSnackBar} />


          </div>
          <Portal>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={snackBarOpen}
              autoHideDuration={4000}
              onClose={() => toggleSnackBar(false)}
              message={snackBarMsg}
              action={
                <React.Fragment>
                  <IconButton size="small" aria-label="close" color="inherit" onClick={() => toggleSnackBar(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
          </Portal>
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
              top: `${(bStartTime - Math.floor(earliestStartTime)) * HOUR_SIZE}px`,
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
            const isMidnight = formattedTime == "00:00";
            return (
              <div className="hour-marker log-click"
                id={`hour-block-${formattedTime}`}
                style={{
                  // top: `${i * HOUR_SIZE}px`,
                  height: `${HOUR_SIZE}px`,
                }}>
                {isMidnight && <Divider style={{ position: 'absolute', width: '100%', border: '1px dashed rgb(200, 200, 200)', backgroundColor: 'unset' }} />}
                <div
                  className={`log-click${moment(blockStartTime).format('HH:mm') === formattedTime ? ' start-boundary' : ''}${moment(blockEndTime).format('HH:mm') === formattedTime ? ' end-boundary' : ''}${isMidnight && ' midnight'}`}
                  id={`hour-marker-${formattedTime}`}>
                  {formattedTime}
                </div>
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
                top: `${(bStartTime - Math.floor(earliestStartTime)) * HOUR_SIZE}px`,
                height: `${(bEndTime - bStartTime) * HOUR_SIZE}px`,
                width: `100%`
              }}
            >
            </div>
          </LightTooltip>}
          {totalDays > 0 && <LightTooltip
            title={earliestStartDate.clone().add(1, 'days').format('dddd, MMMM DD, YYYY')}
            placement='left'
          >
            <div className="absolute log-mouseover"
              id="block-hours-tooltip"
              style={{
                top: `${(scheduleDuration - globalFunctions.getDiffFromMidnight(latestEndTime, 'minutes') / 60 - 1) * HOUR_SIZE}px`,
                height: `${(globalFunctions.getDiffFromMidnight(latestEndTime, 'minutes') / 60) * HOUR_SIZE}px`,
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
            // let endMins = globalFunctions.getDiffFromMidnight(wheelsOut, 'minutes') - offset;
            let endMins = startMins + moment(wheelsOut).diff(moment(wheelsIn), 'minutes');
            const caseHeight = (endMins - startMins) / 60;
            const isShort = (caseHeight * HOUR_SIZE) <= 49;
            const isMedium = (caseHeight * HOUR_SIZE) <= 83;
            return (
              <div className={`absolute case-block ${c.caseId == caseId && 'is-current-case'} ${isShort && 'short'} ${isMedium && 'medium'}`}
                onClick={() => updateCaseId(c.caseId)}
                style={{
                  top: `${(startMins / 60) * HOUR_SIZE}px`,
                  height: `${caseHeight * HOUR_SIZE}px`,
                  minHeight: HOUR_SIZE
                }}>
                <div className="case-title" title={procedureName}>{procedureName}</div>
                {!isMedium && <div className="case-time">{moment(wheelsIn).format("HH:mm")} - {moment(wheelsOut).format("HH:mm")}</div>}
              </div>
            )
          })}


        </div>
      </Grid>
      <Modal
        open={openRequestEMM}
        onClose={() => handleOpenRequestEMM(false)}
      >
        <Slide direction="left" in={openRequestEMM} mountOnEnter unmountOnExit timeout={700}>
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
                  options={USERS.map((u) => { return { "display": `${u.firstName} ${u.lastName}`, "id": u.userId } })}
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
        </Slide>
      </Modal>
      <Modal
        open={openAddFlag}
        onClose={() => handleOpenAddFlag(false)}
      >
        <Slide direction="left" in={openAddFlag} mountOnEnter unmountOnExit timeout={700}>
          <div className="request-emm-modal">
            <AddFlagForm
              handleOpenAddFlag={handleOpenAddFlag}
              flagReport={flagReport}
              reportId={flagReport?.reportId}
              procedureTitle={procedureTitle}
              requestEMMDescription={requestEMMDescription}
              roomIds={roomIds}
              roomName={roomName}
              wheelsInLocal={wheelsIn}
              wheelsInUtc={wheelsInUtc}
              caseId={caseId}
              openAddFlag={openAddFlag}
              setShowAddFlag={setShowAddFlag}
            />
          </div>
        </Slide>
      </Modal>
    </Grid>
  )
}

/***  ADD FLAG FORM COMPONENT. ***/
const AddFlagForm = ({ handleOpenAddFlag, reportId, procedureTitle, requestEMMDescription, roomIds, roomName, wheelsInLocal, wheelsInUtc, caseId, openAddFlag, flagReport, setShowAddFlag }) => {
  // Retrieve userToken from redux store 
  const userToken = useSelector(makeSelectToken());
  const firstName = useSelector(makeSelectFirstName());
  const lastName = useSelector(makeSelectLastName());
  const logger = useSelector(makeSelectLogger());
  const DETAILED_CASE = useSelector(selectDetailedCase());
  const CASES = useSelector(selectCases());
  const savedCases = useSelector(selectSavedCases());
  //Used to update overview page when a flag is added
  const { recentFlags, recentClips, recommendations,
    recentSaved, overview } = useSelector(selectOverviewData())
  const dispatch = useDispatch();

  // USEREDUCER ACTION TYPES.
  const SET_INITIAL_QUESTION = 'SET_INITIAL_QUESTION';
  const UPDATE_QUESTIONS = 'UPDATE_QUESTIONS';
  const SELECT_TYPE_CHOICE = 'SELECT_TYPE_CHOICE';
  const SELECT_TYPE_CHOICE_OTHER = 'SELECT_TYPE_CHOICE_OTHER';
  const SELECT_OPTION = 'SELECT_OPTION';
  const GET_NEXT_FLAG_LOCATION = 'GET_NEXT_FLAG_LOCATION';
  const SAVE_CHOICE_OTHER = 'SAVE_CHOICE_OTHER';
  const CHOICE_OTHER_EMPTY = 'CHOICE_OTHER_EMPTY';
  const TOGGLE_CHOICE_OTHER_ACTIVE = 'TOGGLE_CHOICE_OTHER_ACTIVE';
  const SELECT_MULTI_OPTION = 'SELECT_MULTI_OPTION';
  const SENDING_FLAG = 'SENDING_FLAG';
  const FLAG_SUCCESS = 'FLAG_SUCCESS';
  const FLAG_FAIL = 'FLAG_FAIL';
  const CLEAR_INPUT_ERROR = 'CLEAR_INPUT_ERROR';
  const SET_OTHER_INPUT_ERROR = 'SET_OTHER_INPUT_ERROR';

  // UseReducer initial state.
  const initial_state = {
    flagReportLocation: [0],
    flagLocationPopped: false,
    flagData: [],
    // isFlagChoiceOther: {},
    choiceOtherOptionObject: null,
    choiceOtherInputActive: {},
    flagInputOtherValue: {},
    isSendingFlag: false,
    flagError: null,
    choiceOtherInputError: {},
    choiceOtherFocus: null
  };

  const flagReducer = (state, action) => {
    let questionId;
    let updatedFlagData = state.flagData;
    switch (action.type) {
      case SET_INITIAL_QUESTION:
        let currentFlagQuestion;
        // 1. Retrieve current question from the flagReport, based on the flagReportLocation value.
        currentFlagQuestion = getQuestionByLocation(flagReport, state.flagReportLocation);
        // 2. Update the flagData piece of state based on the current flag question value.
        if (currentFlagQuestion) {
          updatedFlagData = [{ ...currentFlagQuestion, location: state.flagReportLocation, completed: false, showChoiceOther: null, choices: [] }];
        }
        return {
          ...state,
          flagData: updatedFlagData
        }
      case UPDATE_QUESTIONS:
        updatedFlagData = [...state.flagData];
        const nextQuestion = getQuestionByLocation(flagReport, state.flagReportLocation);
        let transformedNextQuestion;
        if (nextQuestion) transformedNextQuestion = { ...nextQuestion, location: state.flagReportLocation, completed: false, showChoiceOther: null, choices: [] };
        if (nextQuestion) {
          const nextQuestionIndex = state.flagData.findIndex(ques => ques.id === nextQuestion.id || ques.title === nextQuestion.title);
          updatedFlagData = nextQuestionIndex !== -1 ? [...state.flagData.slice(0, nextQuestionIndex), transformedNextQuestion] : [...state.flagData, transformedNextQuestion];
        }
        return {
          ...state,
          flagData: updatedFlagData
        }
      // TODO: remove below case, not needed as this is being handled in SELECT_OPTION for option type of choice.
      case SELECT_TYPE_CHOICE:
        questionId = action.payload.questionId;
        return state;
      // return {
      //   ...state,
      // isFlagChoiceOther: {
      //   ...state.isFlagChoiceOther,
      //   [questionId]: false
      // }
      // flagData: state.flagData.map(ques => ques.id === questionId)
      // }
      case SELECT_TYPE_CHOICE_OTHER:
        questionId = action.payload.questionId;
        const choiceOtherOptionObject = action.payload.choiceOtherOptionObject;
        let updatedStateVal = {
          ...state
        };
        updatedStateVal = {
          ...updatedStateVal,
          // TODO: Line below is technically not needed as we are setting showChoiceOther to true in SELECT_OPTION action.
          flagData: updatedStateVal.flagData.map((ques) => ques.id === questionId ? { ...ques, showChoiceOther: true } : ques),
          // isFlagChoiceOther: {
          //   ...updatedStateVal.isFlagChoiceOther,
          //   questionId: true
          // },
          choiceOtherOptionObject: choiceOtherOptionObject
        };
        return updatedStateVal;
      case SELECT_OPTION:
        questionId = action.payload.questionId;
        let optionObject = action.payload.optionObject;

        let currentQuestionIndex = state.flagData.findIndex(ques => ques.id === questionId);

        const currentQuesOptions = state.flagData[currentQuestionIndex].options.sort((a, b) => a.optionOrder - b.optionOrder);

        let updatedStateValue = { ...state };

        // Check whether previous question's selected option is choie-other and if it's value is null.
        if ((currentQuestionIndex > 0) && (state.flagData[currentQuestionIndex - 1].choices.includes(choice => choice.type === 'choice-other' && choice.attribute === null))) {
          const prevQuestionId = state.flagData[currentQuestionIndex - 1].id;
          // const inputError = state.flagData[currentQuestionIndex - 1].choices.includes(choice => choice.type === 'choice-other' && choice.attribute === null)
          updatedStateValue = {
            ...updatedStateValue,
            choiceOtherInputError: {
              ...updatedStateValue.choiceOtherInputError,
              [prevQuestionId]: state.flagData[currentQuestionIndex - 1].choices.includes(choice => choice.type === 'choice-other' && choice.attribute === null)
            }
          }
        }

        if (state.flagData[currentQuestionIndex].choices.find(choice => choice.id === optionObject.id)) {
          // Do nothing,no need to update flagReportLocation.
          return updatedStateValue;
        } else {
          // updatedStateValue = {
          //   ...updatedStateValue,
          //   flagData: updatedStateValue.flagData.map((ques, i) => i > )
          // }
          // // Handle selection of choice-other option type.
          if (optionObject?.type?.toLowerCase() === 'choice-other') {
            updatedStateValue = {
              ...updatedStateValue,
              // isFlagChoiceOther: {
              //   ...updatedStateValue.isFlagChoiceOther,
              //   [questionId]: true
              // },
              flagData: updatedStateValue.flagData.map((ques, i) => {
                if (i === currentQuestionIndex) {
                  return { ...ques, showChoiceOther: true };
                } else if (i > currentQuestionIndex) {
                  return { ...ques, showChoiceOther: false };
                } else if (i < currentQuestionIndex) {
                  return ques;
                }
              }),
              choiceOtherFocus: `${questionId}Other`
            };
            // Handle selection of standard 'choice' option type.
          } else {
            // const updatedisFlagChoiceOther = {...updatedStateValue.isFlagChoiceOther};
            // delete updatedisFlagChoiceOther[questionId];
            updatedStateValue = {
              ...updatedStateValue,
              flagData: updatedStateValue.flagData.map((ques, i) => i >= currentQuestionIndex ? { ...ques, showChoiceOther: false } : ques)
              // isFlagChoiceOther: updatedisFlagChoiceOther,
            }
          }
          // TODO: may not be necessary.
          if (state.flagData[currentQuestionIndex].choices.length > 0) {
            updatedStateValue = { ...updatedStateValue, flagLocationPopped: false };

          }
          // TODO: refactor.
          let nextQuestion;

          // Set completed to true for current question answered if the selected option type is not choice-other.
          if (optionObject.type === 'choice') {
            updatedStateValue = {
              ...updatedStateValue,
              flagData: updatedStateValue.flagData.map(ques => ques.id === questionId ? { ...ques, completed: true, choices: [{ ...optionObject, attribute: null }] } : ques),
            };
          } else if (optionObject.type === 'choice-other') {
            updatedStateValue = {
              ...updatedStateValue,
              flagData: updatedStateValue.flagData.map(ques => ques.id === questionId ? { ...ques, completed: false, choices: [{ ...optionObject, attribute: null }] } : ques)
            };
          }
          let updatedLocation = [...state.flagData[currentQuestionIndex].location, optionObject.optionOrder - 1];

          let selectedOpt = getQuestionByLocation(flagReport, updatedLocation);
          // Sort returned questions by questionOrder property.
          if (selectedOpt.questions) selectedOpt = { ...selectedOpt, questions: selectedOpt.questions.sort((a, b) => a.questionOrder - b.questionOrder) };
          // const selectedOpt = currentQuesOptions[optionObject.optionOrder - 1];
          if (selectedOpt.questions) {
            updatedStateValue = {
              ...updatedStateValue,
              flagReportLocation: updatedLocation.concat(0),
            }

            // If selected options' questions value is null.
          } else {
            const currentQuestionCount = getQuestionCount(flagReport, state.flagReportLocation) - 1;
            updatedLocation.pop();
            // If there is another question at this level that has NOT been traversed.
            if (currentQuestionCount > updatedLocation[updatedLocation.length - 1]) {
              const tempLocation = [...updatedLocation];
              let lastLocEl = tempLocation[tempLocation.length - 1];
              lastLocEl = lastLocEl + 1;
              tempLocation[tempLocation.length - 1] = lastLocEl;
              updatedStateValue = {
                ...updatedStateValue,
                flagReportLocation: [...tempLocation]
              };
              // If all questions at this level have been traversed.
            } else {
              updatedStateValue = {
                ...updatedStateValue,
                flagReportLocation: updatedLocation.slice(0, -2),
                flagLocationPopped: true
              };
            }
          }
        }
        return updatedStateValue;
      case SAVE_CHOICE_OTHER:
        const { value } = action.payload;
        questionId = action.payload.questionId

        updatedFlagData = state.flagData.map(ques => ques.id === questionId ? { ...ques, completed: value ? true : false, choices: ques.choices.map(el => ({ ...el, attribute: value ? value : null })) } : ques);
        return {
          ...state,
          flagData: updatedFlagData
        };
      case CHOICE_OTHER_EMPTY:
        questionId = action.payload.questionId;
        updatedFlagData = [...state.flagData];
        updatedFlagData = updatedFlagData.map(ques => ques.id === questionId ? { ...ques, completed: false, choices: [{ ...ques.choices[0], attribute: null }] } : ques);
        return {
          ...state,
          flagData: updatedFlagData
        };
      case CLEAR_INPUT_ERROR:
        questionId = action.payload.questionId
        const updatedInputErrorState = { ...state.choiceOtherInputError };
        delete updatedInputErrorState[questionId];
        return {
          ...state,
          choiceOtherInputError: updatedInputErrorState
        };
      case SET_OTHER_INPUT_ERROR:
        questionId = action.payload.questionId;
        return {
          ...state,
          choiceOtherInputError: {
            ...state.choiceOtherInputError,
            [questionId]: true
          }
        };
      case SELECT_MULTI_OPTION:
        questionId = action.payload.questionId;
        optionObject = action.payload.optionObject;

        currentQuestionIndex = state.flagData.findIndex(ques => ques.id === questionId);

        updatedStateValue = { ...state };

        // If an already selected option is selected again
        if (state.flagData[currentQuestionIndex].choices.find(choice => choice.id === optionObject.id)) {
          // Do nothing,no need to update flagReportLocation.
          return;
          // If a new option is selected.
        } else {
          // Handle selection of choice-other option type.
          if (optionObject?.type?.toLowerCase() === 'choice-other') {
            updatedStateValue = {
              ...updatedStateValue,
              isFlagChoiceOther: {
                ...updatedStateValue.isFlagChoiceOther,
                [questionId]: true
              }
            };
            // Handle selection of standard 'choice' option type.
          } else {
            updatedStateValue = {
              ...updatedStateValue,
              isFlagChoiceOther: {
                // ...updatedStateValue.isFlagChoiceOther,
                // [questionId]: false
              }
            }
          }

          // TODO: may not be necessary.
          if (state.flagData[currentQuestionIndex].choices.length > 0) {
            updatedStateValue = { ...updatedStateValue, flagLocationPopped: false };

          }
          // TODO: refactor.
          let nextQuestion;

          // Set completed to true for current question answered if the select option type is not choice-other.
          if (optionObject.type === 'choice') {
            updatedStateValue = {
              ...updatedStateValue,
              flagData: updatedStateValue.flagData.map(ques => ques.id === questionId ? { ...ques, completed: true, choices: [...ques.choices, { ...optionObject, attribute: null }] } : ques)
            };
          } else if (optionObject.type === 'choice-other') {
            updatedStateValue = {
              ...updatedStateValue,
              flagData: updatedStateValue.flagData.map(ques => ques.id === questionId ? { ...ques, choices: [...ques.choices, { ...optionObject, attribute: null }] } : ques),
            };
          }
          // Append an option index of 0 to the end of the current location array since for multi-choice questions it does not matter which optionIndex is used to fetch the next question as long as atleast one option is selected we can fetch the next question.
          updatedLocation = [...state.flagData[currentQuestionIndex].location, 0];

          const selectedOpt = getQuestionByLocation(flagReport, updatedLocation);
          // If next questions value is not null
          if (selectedOpt.questions) {
            updatedStateValue = {
              ...updatedStateValue,
              flagReportLocation: updatedLocation.concat(0)
            };
            // If selected option's questions value is null.
          } else {
            const currentQuestionCount = getQuestionCount(flagReport, state.flagReportLocation) - 1;
            updatedLocation.pop();
            // If there is another question at this level that has NOT been traversed.
            if (currentQuestionCount > updatedLocation[updatedLocation.length - 1]) {
              const tempLocation = [...updatedLocation];
              let lastLocEl = tempLocation[tempLocation.length - 1];
              lastLocEl = lastLocEl + 1;
              tempLocation[tempLocation.length - 1] = lastLocEl;
              updatedStateValue = {
                ...updatedStateValue,
                flagReportLocation: [...tempLocation]
              };
              // If all questions at this level have been traversed.
            } else {
              updatedStateValue = {
                ...updatedStateValue,
                flagReportLocation: updatedLocation.slice(0, -2),
                flagLocationPopped: true
              };
            }
          }
        }
        return updatedStateValue;
      case GET_NEXT_FLAG_LOCATION:
        let updatedState = { ...state };
        let updatedLocation = [...state.flagReportLocation];
        if ((getQuestionCount(flagReport, state.flagReportLocation) - 1) > state.flagReportLocation[state.flagReportLocation.length - 1]) {
          let lastLoc = updatedLocation[updatedLocation.length - 1];
          lastLoc += 1;
          updatedLocation[updatedLocation.length - 1] = lastLoc;
          updatedState = {
            ...updatedState,
            flagReportLocation: updatedLocation
          };
        } else {
          updatedLocation = updatedLocation.slice(0, -2);
          updatedState = {
            ...updatedState,
            flagReportLocation: updatedLocation
          };
          if (state.flagReportLocation.length === 0) {
            updatedState = {
              ...updatedState,
              flagLocationPopped: false
            };
          }
        }
        const nextQuestionVal = getQuestionByLocation(flagReport, updatedLocation);
        let isNextQuestionPresent;
        if (nextQuestionVal) isNextQuestionPresent = state.flagData.find(ques => ques.id === nextQuestionVal.id || ques.title === nextQuestionVal.title);
        if (nextQuestionVal && !isNextQuestionPresent) {
          updatedState = {
            ...updatedState,
            flagData: [...updatedState.flagData, { ...nextQuestionVal, location: updatedLocation, completed: false, choices: [] }]
          }
        }
        return updatedState;
      case SENDING_FLAG:
        return {
          ...state,
          isSendingFlag: true,
          flagError: false,
        };
      case FLAG_SUCCESS:
        return {
          ...initial_state,
        }
      case FLAG_FAIL:
        return {
          ...state,
          isSendingFlag: false,
          flagError: true,
        }
      default:
        return state;
    }
  };

  const [flagState, flagDispatch] = useReducer(flagReducer, initial_state);

  // Set initial value of flagData array when component first mounts, thus rendering the first flag question.
  useEffect(() => {
    if (flagState.flagReportLocation.length > 0 && flagReport) {
      flagDispatch({ type: SET_INITIAL_QUESTION });
    }
  }, [flagReport]);

  // Update flagData array if necessary when flagReportLocation changes.
  useEffect(() => {
    if (flagState.flagReportLocation.length > 0 && flagReport && !flagState.flagLocationPopped) {
      flagDispatch({ type: UPDATE_QUESTIONS });
    }
  }, [flagState.flagReportLocation]);

  // Pop last 2 elements of flagReportLocation array off when the current questions array at the current 'level' has no more questions.
  useEffect(() => {
    // if atleast 2 elements have been removed from the end of the flagReportLocation array.
    if (flagState.flagLocationPopped && flagState.flagReportLocation.length > 0) {
      flagDispatch({ type: GET_NEXT_FLAG_LOCATION });
    }
  }, [flagState.flagLocationPopped, flagState.flagReportLocation.length]);

  // Flag Submission handlers 
  // TODO: Remove both functions below, not being used.
  const handleSelectTypeChoice = (questionId) => ({ type: SELECT_TYPE_CHOICE, payload: { questionId } });
  const handleSelectTypeChoiceOther = (questionId, optionObject) => ({ type: SELECT_TYPE_CHOICE_OTHER, payload: { questionId, choiceOtherOptionObject: optionObject } });
  const handleOptionSelect = (questionId, optionObject) => flagDispatch({
    type: SELECT_OPTION,
    payload: { questionId, optionObject }
  });
  const handleSaveChoiceOther = (value, questionId) => flagDispatch({ type: SAVE_CHOICE_OTHER, payload: { value, questionId } });
  const handleChoiceOtherEmpty = (questionId) => flagDispatch({ type: CHOICE_OTHER_EMPTY, payload: { questionId } });
  const handleToggleChoiceOtherActive = (questionId) => flagDispatch({ type: TOGGLE_CHOICE_OTHER_ACTIVE, payload: { questionId } });
  const handleMultiOptionSelect = (questionId, optionObject) => flagDispatch({
    type: SELECT_MULTI_OPTION,
    payload: { questionId, optionObject }
  });
  const handleClearInputError = (questionId) => flagDispatch({ type: CLEAR_INPUT_ERROR, payload: { questionId } });
  const handleSetOtherInputError = (questionId) => flagDispatch({ type: SET_OTHER_INPUT_ERROR, payload: { questionId } });

  const translateRoomNametoId = () => {
    if (roomIds && roomName) {
      const room = roomIds.find(room => room.display === roomName);
      if (room) return room.id;
    }
  };

  const [roomId, setRoomId] = useState(() => translateRoomNametoId());

  useEffect(() => {
    setRoomId(translateRoomNametoId());
  }, [roomName]);

  const classes = useStyles();
  // Render flag submission question based on question type property value.
  const renderFlagQuestions = flagData => {
    if (flagData) {
      return flagData.map(question => {
        switch (question.type.toLowerCase()) {
          case 'single-choice':
          case 'multiple-choice':
            // Render select list.
            return (
              <div style={{ marginBottom: '1rem' }} key={question.title}>
                <FlagSelect
                  key={question.title}
                  title={question.title}
                  options={question.options.map(opt => opt.type === 'choice-other' ? { ...opt, title: 'Other' } : opt).sort((a, b) => a.optionOrder - b.optionOrder)}
                  questionType={question.type}
                  handleOptionSelect={handleOptionSelect}
                  isRequired={question.isRequired}
                  questionId={question.id}
                  handleMultiOptionSelect={handleMultiOptionSelect}
                  flagData={flagState.flagData}
                  handleClearInputError={handleClearInputError}
                />
                {/*flagState.isFlagChoiceOther[question.id]*/ question.showChoiceOther &&
                  (<div className="flag-text-input-container">
                    {false &&
                      <div className="select-header">
                        <InputLabel className={classes.inputLabelFlag}>Other</InputLabel>
                      </div>
                    }
                    <MemoizedFlagTextInput
                      choiceOtherInputActive={flagState.choiceOtherInputActive[question.id]}
                      question={question}
                      handleSaveChoiceOther={handleSaveChoiceOther}
                      handleToggleChoiceOtherActive={handleToggleChoiceOtherActive}
                      handleChoiceOtherEmpty={handleChoiceOtherEmpty}
                      flagData={flagState.flagData}
                      choiceOtherInputError={flagState.choiceOtherInputError}
                      handleClearInputError={handleClearInputError}
                      handleSetOtherInputError={handleSetOtherInputError}
                      isFocused={flagState.choiceOtherFocus}
                    />
                  </div>
                  )
                }
              </div>
            )
          case 'input':
            // render AddFlagInput
            // pass down the option type to render correct input type. i.e. date / datetime / integer/ float /freetext
            return 'input';
          default:
            return null;
        }
      });
    }
  };

  // Submit flag.
  const handleFlagSubmit = (flag) => {
    flagDispatch({ type: SENDING_FLAG });

    globalFunctions.axiosFetchWithCredentials(process.env.CASE_DISCOVERY_API + 'case_flag', 'post', userToken, flag)
      .then(async result => {
        flagDispatch({ type: FLAG_SUCCESS });
        result = result.data;
        const toolTipArray = result.description.map(el => `${el.questionTitle}: ${el.answer}`).concat(`Submitted By: ${firstName} ${lastName}`);

        const newFlagObject = {
          tagName: 'Flagged',
          toolTip: toolTipArray
        };
        //Add flag to Detailed Case
        dispatch(showDetailedCase({
          ...DETAILED_CASE,
          tags: [newFlagObject, ...DETAILED_CASE.tags]
        }));
        const updateCases = (caseList) => {
          const index = caseList.findIndex(el => el.caseId === caseId);
          if (index > -1) {
            caseList[index] = { ...caseList[index], tags: [newFlagObject, ...caseList[index].tags] };
          }
          return index;
        }
        //Add flag to CASES list
        const index = updateCases(CASES) || 0;
        dispatch(setCases(CASES));
        //Add to recently flagged list (tag added CASES update)
        recentFlags.unshift(CASES[index]);
        dispatch(setRecentFlags(recentFlags.slice(0, 5)));
        //Update Overview tiles if the case exists there
        if (updateCases(recommendations) > -1) {
          dispatch(setRecommendations(recommendations));
        }
        if (updateCases(recentSaved) > -1) {
          dispatch(setRecentSaved(recentSaved))
        }

        logger.manualAddLog('click', 'submit-flag', flag)

        setShowAddFlag(false);
        handleOpenAddFlag(false);
        //Update Overview tile for Flag count
        const overviewData = await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'tag_overview', 'get', userToken, {});
        dispatch(setOverviewTile(overviewData.data))
      }).catch((error) => {
        flagDispatch({ type: FLAG_FAIL });
        console.log("oh no", error)
      }).finally(() => {

      });
  };

  const onFlagSubmit = () => {
    if (reportId, flagState.flagData) {
      const newFlag = {
        reportId,
        caseId,
        roomId,
        localTime: wheelsInLocal,
        utcTime: wheelsInUtc,
        options: flagState.flagData.map(el => {
          return {
            optionId: el.choices[0].id,
            attribute: el.choices[0].attribute
          }
        })
      };
      handleFlagSubmit(newFlag);
    }
  };
  return (
    <React.Fragment>
      <div className="close-button">
        <img src={Close} onClick={() => handleOpenAddFlag(false)} />
      </div>
      {flagState.flagError ?
        (<Grid container spacing={2} direction="column">
          <Grid item xs={12} className="header" style={{ maxWidth: 'none', marginBottom: 0 }}>
            <p>Unable to submit flag</p>
          </Grid>
          <Grid item xs>
            An Error was encountered while attempting to submit your flag:
            {/* <span style={{ fontWeight: 'bold' }}>{` ${isFlagSubmitted}`}</span> */}
          </Grid>
          <Grid item xs>
            Click below to retry submitting your flag.
          </Grid>
          <Grid item xs>
            <Button variant="outlined" className="primary" style={{ marginTop: 26 }} onClick={onFlagSubmit}>Retry</Button>
          </Grid>
        </Grid>
        ) :
        <div className="request-emm">
          <div className="header flag-submit">
            <img src={Flagged} style={{ height: 24, width: 24, opacity: 0.8, margin: '0 6px 0 0', color: '#7b2d2d' }} />
            Submit Flag
          </div>
          {renderFlagQuestions(flagState.flagData)}
          <Button
            variant="outlined"
            className="primary send-request submit-flag"
            onClick={onFlagSubmit}
            disabled={flagState?.flagData?.some(el => el.completed === false) || flagState.isSendingFlag}
          >
            {flagState.isSendingFlag ? <div className="loader"></div> : 'Submit Flag'}
          </Button>
        </div>}
    </React.Fragment>
  );
};

const FlagSelect = ({ title, questionType, options, isRequired, questionId, handleOptionSelect, handleMultiOptionSelect, flagData, handleClearInputError, key }) => {
  const [value, setValue] = useState({});
  const [animate, setAnimate] = useState(false);
  const [flagOptions, setflagOptions] = useState([options]);
  const logger = useSelector(makeSelectLogger());
  useEffect(() => {
    // 1. Animate state set to true.
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 100);
    // Clean up timeout before effect runs.
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    setValue(null)
    // setflagOptions([ ...options])
  }, [questionId])

  const classes = useStyles();

  // OnChange handler.
  const onOptionChange = (event, newValue) => {
    // Retrieve selected options index.
    const optionIndex = options.findIndex(opt => opt.id === newValue.id);
    const optionObj = { ...newValue, optionIndex };

    if (newValue) {
      // handle option selection for question type of single-choice
      if (questionType === 'single-choice') handleOptionSelect(questionId, optionObj);
      // handle option selection for question type of multiple-choice
      if (questionType === 'multiple-choice') handleMultiOptionSelect(questionId, optionObj);

      if (optionObj.type !== 'choice-other') handleClearInputError(questionId);
    }
    logger.manualAddLog('onchange', title, newValue)
    setValue(newValue);
  };
  // console.log('value', value);
  return (
    <CSSTransition
      in={flagData.includes(ques => ques.id === questionId)}
      timeout={1000}
      exit={true}
      enter={false}
      classNames="flag-select-fade-out"
    >
      <div className={`flag-select ${animate ? 'animate' : ''}`}>
        <div className="select-header">
          <InputLabel className={classes.inputLabelFlag}>{`${title} ${isRequired ? '' : '(optional)'}`}</InputLabel>
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
          renderInput={(params) => <TextField {...params} /*label={questionType === 'multiple-choice' ? 'Select 1 or more' : ''}*/ variant="outlined" />}
          disableClearable
          defaultValue={null}
        />
      </div>
    </CSSTransition>
  );
};

const FlagTextInput = (props) => {
  const { handleSaveChoiceOther, question, choiceOtherInputActive, handleToggleChoiceOtherActive, handleChoiceOtherEmpty, flagData, choiceOtherInputError, handleClearInputError, handleSetOtherInputError, isFocused } = props;
  const [flagInputOtherValue, setFlagInputOtherValue] = useState('');
  const logger = useSelector(makeSelectLogger());
  const classes = useStyles();

  const handleFlagInputChange = (event, title) => {
    const val = event.target.value;
    if (val === '' && choiceOtherInputError[question.id]) {
      /*handleChoiceOtherEmpty(question.id)*/
      handleSetOtherInputError(questionId);
      // TODO: Remove
      // setInputError(prevState => ({ 
      //   ...prevState,
      //   [question.id]: true
      // }));
    } else {
      // TODO: Remove
      // setInputError(prevState => ({
      //   ...prevState,
      //   [question.id]: false
      // }));
      handleClearInputError(question.id);
    }
    logger.manualAddLog('onchange', title, val)
    setFlagInputOtherValue(prevState => ({ ...prevState, [title]: val }));
    // Update flagData state in realtime as value is entered.
    // todo: rename to handleUpdateChoiceOther
    handleSaveChoiceOther(val, question.id);
  };

  const handleInputBlur = (event, id) => {
    if (!event.target.value) {
      handleSetOtherInputError(id);
      // TDOD: Remove.
      // setInputError(prevState => ({ 
      //   ...prevState,
      //   [id]: true
      // }));
    }
  };
  return (
    <TextField
      // id="complication-other"
      onBlur={(e) => handleInputBlur(e, question.id)}
      className={classes.flagTextIcon}
      id={`${question.title}-other`}
      variant="outlined"
      fullWidth
      size="small"
      name={`${question.title}Other`}
      type="text"
      placeholder="Please specify"
      value={flagInputOtherValue[question.title]}
      onChange={(e) => handleFlagInputChange(e, question.title)}
      helperText={choiceOtherInputError[question.id] && `Please enter a ${question?.title.toLowerCase()}`}
      error={choiceOtherInputError[question.id] /*|| inputError[question.id]*/}
      inputProps={{
        maxLength: 128
      }}
      autoFocus={isFocused === `${question.id}Other`}
    />
  )
};

const MemoizedFlagTextInput = React.memo(FlagTextInput);

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
  logger?.manualAddLog('onchange', event.name, event.value);

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
  const lower = Math.max(0, Math.min(duration - (0.2 * sigma), mu - (3.5 * sigma)))
  const upper = Math.max(mu + (3.5 * sigma), duration + (0.2 * sigma))
  const range = [duration, ...globalFunctions.range(lower, upper, sigma / 20)].sort();
  const chartRef = useRef(null);
  if (!shape || !scale) {
    return <div></div>
  }

  const createCustomTooltip = (d, defaultTitleFormat, defaultValueFormat, color) => {
    d = d[0]
    let seconds = d.x;

    const time = globalFunctions.formatSecsToTime(seconds, true, true);
    const percentile = `${globalFunctions.ordinal_suffix_of(Math.round(log_norm_cdf(d.x, scale, shape) * 100))} percentile`;
    logger?.manualAddLog('mouseover', `procedure-time-tooltip`, { xValue: time, yValue: percentile })
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
      <div className="title">Case Time <LightTooltip interactive arrow title={`Case time distribution is a best approximation based on ${sampleSize} case${sampleSize == 1 ? '' : 's'} of the same procedure type`} placement="top" fontSize="small">
        <InfoOutlinedIcon className="log-mouseover" id="procedure-time-info-tooltip" style={{ fontSize: 16, margin: '0 0 4px 0px' }} />
      </LightTooltip></div>
      <C3Chart ref={chartRef} {...data} />
    </div>
  )
}


function HL7Chart(props) {
  const { hl7Data, timeline, flags, toggleSnackBar } = props;
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
  const hasClips = flags?.some((f) => f?.clips?.length > 0);
  const flagTimes = hasClips && flags.map((f) => f?.clips?.map((c) => c.startTime)).flat() || [];
  const min = Math.min(...flagTimes, 0);
  const max = Math.max(...(hasHL7Data ? hl7Data[0].times : []), ...timeline.map((t) => t.time), ...flagTimes);

  const createCustomTooltip = (d, defaultTitleFormat, defaultValueFormat, color) => {

    if (!hasHL7Data) {
      d = d[0]
      let value = timeline.find((e) => e.time == d.x)
      if (!value || !value.text) {
        return;
      }
      const time = globalFunctions.formatSecsToTime(d.x);
      const text = value.text;
      logger?.manualAddLog('mouseover', `hl7-tooltip-${d.name}`, { xValue: time, zValue: text, name: d.name })
      return ReactDOMServer.renderToString(
        <div className="tooltip subtle-subtext">
          <div>{time}</div>
          <div>{text}</div>
        </div>);
    }

    let hl7 = d.find((e) => e?.id != "y");
    let y = d.find((e) => e?.id == "y");
    let value = y && timeline.find((e) => e.time == y.x);
    let x = hl7?.x || y?.x;
    const time = globalFunctions.formatSecsToTime(x);
    logger?.manualAddLog('mouseover', `hl7-tooltip-${hl7?.name}`, { xValue: time, yValue: hl7?.value, zValue: value?.text, name: hl7?.name })
    return ReactDOMServer.renderToString(
      <div className="tooltip subtle-subtext">
        <div>{time}</div>
        {value && <div>{value.text}</div>}
        {hl7?.value && <div>{`${hl7.id}: ${hl7.value}${unitMap[hl7.id]}`}</div>}
      </div>);
  }

  const xRange = globalFunctions.range(min - min % 900, max, 900);
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
            return (x < 0 ? "-" : "") + globalFunctions.formatSecsToTime(Math.abs(x)).substring(0, 5);
          }
        },
        padding: hasHL7Data ? {
          // left: max * .025,
          // right: max * .025,
          left: min < 0 ? Math.abs(min) : 3,
          right: max * .025,
        } : {
          // left: max * .05,
          left: min < 0 ? Math.abs(min) : 0,
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
    logger?.manualAddLog('click', `change-hl7-selection-${title}`, title);
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
    const chart = chartRef?.current?.chart;
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
    logger?.manualAddLog('session', `initial-hl7`, hl7Data.map((h) => {
      return { abbreviation: h.abbreviation, title: h.title }
    }));

  }, []);

  useEffect(() => {
    if (!hasHL7Data) {
      return;
    }
    const { times, values, unit, title, y } = hl7Data[index];

    const chart = chartRef?.current?.chart;
    chart?.load({
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
          {hasClips && <ClipTimeline flags={flags} max={max} min={min} toggleSnackBar={toggleSnackBar} />}
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
  const { flags, max, min, toggleSnackBar } = props;
  const duration = max + (min < 0 ? Math.abs(min) : 0) + max * .025
  const isSafari = navigator.vendor.includes('Apple');
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());
  const isAdmin = useSelector(makeSelectIsAdmin());
  const productRoles = useSelector(makeSelectProductRoles());
  const [presenterMode, setPresenterMode] = React.useState(false);
  const [presenterDialog, setPresenterDialog] = React.useState(false);
  const dispatch = useDispatch();
  const closePresenterDialog = (choice) => {
    (choice) && setPresenterMode(choice);
    setPresenterDialog(false);
    logger?.manualAddLog('click', `toggle-presenter-mode`, { checked: choice });
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
      logger?.manualAddLog('click', `toggle-presenter-mode`, { checked: false });
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
      logger?.manualAddLog('click', `open-clip-${t.clipId}`, t)
      t.index = i;
    } else {
      logger?.manualAddLog('click', `close-clip-${selectedMarker.clipId}`)
      dispatch(setFlaggedClip(null));
    }
    setSelect(t);
    // Close confirmation snack bar when modal is closed.
    toggleSnackBar(false);
  }
  // Open Selected Flagged Clip from Overview page;
  const flaggedClip = useSelector(selectFlaggedClip());
  useEffect(() => {
    if (!flaggedClip) {
      return;
    }
    const i = timeline.findIndex((t) => t.clipId == flaggedClip.clipId);
    handleSelect(timeline[i], i);

  }, [flaggedClip])

  const publishClip = () => {
    globalFunctions.genericFetch(`${process.env.CASE_DISCOVERY_API}flag_clip?clip_id=${selectedMarker.clipId}`, 'post', userToken, {})
      .then(result => {
        const tLine = [...timeline];
        tLine[selectedMarker.index].isActive = true;
        logger?.manualAddLog('click', `publish-clip-${selectedMarker.clipId}`, selectedMarker)
        setTimeline(tLine);
        // Display success msg snack bar with confirmation.
        toggleSnackBar(true, 'Clip published successfully.');
      }).catch((results) => {
        // Display error msg snack bar on fail.
        toggleSnackBar(true, 'A problem has occurred while completing your action. Please try again or contact the administrator.');
        console.error("oh no", results)
      })
  }

  const hideClip = () => {
    globalFunctions.genericFetch(`${process.env.CASE_DISCOVERY_API}flag_clip?clip_id=${selectedMarker.clipId}`, 'delete', userToken, {})
      .then(result => {
        const tLine = [...timeline];
        tLine[selectedMarker.index].isActive = false;
        logger?.manualAddLog('click', `hide-clip-${selectedMarker.clipId}`, selectedMarker)
        setTimeline(tLine);
        // Display success msg snack bar with confirmation.
        toggleSnackBar(true, 'Clip hidden successfully.');
      })
      .catch((results) => {
        // Display error msg snack bar on fail.
        toggleSnackBar(true, 'A problem has occurred while completing your action. Please try again or contact the administrator.');
        console.error("oh no", results)
      })
  };

  const publishButton = productRoles?.cdRoles?.hasPublisher && 
    <LightTooltip title={selectedMarker?.isActive ? 'Clip Published' : ''} arrow>
      <div>
        <Button variant="outlined" className="primary" onClick={() => publishClip()} disabled={selectedMarker?.isActive}>
          Publish
        </Button> 
      </div>
    </LightTooltip> || ''

  const hideButton = productRoles?.cdRoles?.hasPublisher && 
    <LightTooltip title={selectedMarker?.isActive  === false ? 'Clip Hidden' : ''} arrow>
      <div>
        <Button variant="outlined" className="primary" onClick={hideClip} disabled={selectedMarker?.isActive === false}>
          Hide
        </Button> 
      </div>
    </LightTooltip> || ''
  
  const { startTime, index } = selectedMarker;
  const endTime = startTime + selectedMarker.duration;
  const displayStart = (startTime < 0 ? "-" : "") + globalFunctions.formatSecsToTime(Math.abs(startTime));
  const displayEnd = (endTime < 0 ? "-" : "") + globalFunctions.formatSecsToTime(Math.abs(endTime));

  const leftArrow = index > 0 ? <div className="left-arrow" onClick={() => handleSelect(timeline[index - 1], index - 1)}></div> : <div className="left-arrow disabled" ></div>
  const rightArrow = index < timeline.length - 1 ? <div className="right-arrow" onClick={() => handleSelect(timeline[index + 1], index + 1)}></div> : <div className="right-arrow disabled" ></div>

  return (
    <div className="timeline-container">
      <div className='clip-timeline'>
        {timeline.sort((a, b) => a.startTime - b.startTime).map((t, i) => {
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
              style={{ left: `${(t.startTime + Math.abs(min)) / duration * 100}%`, width: `${(t.duration / duration * 100)}%` }}
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
        <div className="Modal clip-modal" style={presenterMode ? { paddingTop: 0 } : {}}>
          {(presenterMode) &&
            <div className="Presenter-Mode-Banner">You are in Presentation Mode</div>
          }
          <div className="close-button">
            <img src={Close} onClick={() => handleSelect(false)} />
          </div>

          {isSafari && <SafariWarningBanner message={'Case Discovery contains videos that are currently not supported on Safari. We recommend using the latest version of Google Chrome or Microsoft Edge browsers for the full experience.'} />}
          <div className="clip-container">
            {leftArrow}
            <Grid container spacing={0} className="clip-details">
              <Grid item xs={9}>
                <VideoPlayer params={selectedMarker.params} presenterMode={presenterMode} />
                <div className="subtle-text clip-information">
                  <div>({displayStart} to {displayEnd})</div>
                  <div>{index + 1} of {timeline.length} Clips</div>
                </div>
              </Grid>
              <Grid item xs={3} className="flag-details normal-text">
                {isAdmin && <div>
                  <FormControlLabel
                    control={
                      <SSTSwitch
                        checked={presenterMode}
                        onChange={switchPresenterMode}
                      />
                    }
                    label="Presentation Mode"
                  />
                </div>}
                <div className="details-header">
                  Flag Details
                </div>
                {selectedMarker?.description?.map((d, i) => {
                  return (
                    <div className="detail-entry subtext" key={`${d.answer}-${i}`}>
                      <div className="title">{d.questionTitle}:</div>
                      <div className="body">{d.answer}</div>
                    </div>
                  )
                })}
                <div className="button">
                  {publishButton}
                  {hideButton}
                </div>
              </Grid>

            </Grid>
            {rightArrow}
          </div>
        </div>
      </Modal>
      <ConfirmPresenterDialog
        dialogOpen={presenterDialog}
      />
    </div>
  )
}
