/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import 'c3/c3.css';
import C3Chart from 'react-c3js';
import './style.scss';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Modal, Radio, RadioGroup, Select, Slide, Tab, Tabs, TextField, Tooltip, withStyles } from '@material-ui/core';
import { DATE_OPTIONS, TAGS, TAG_INFO } from './misc/constants';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
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
import { isUndefined } from 'lodash';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { log_norm_cdf, log_norm_pdf, formatCaseForLogs, getCasesInView, getQuestionByLocation, getQuestionCount, getPresetDates } from './misc/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectComplications, makeSelectEMMRequestAccess, makeSelectFirstName, makeSelectIsAdmin, makeSelectLastName, makeSelectLogger, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { NavLink } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';
import { Case } from './Case';
import { StyledTabs, StyledTab, TabPanel } from './misc/helper-components';
import { BrowseCases } from './BrowseCases';
import { DetailedCase } from './DetailedCase';
import { Overview } from './Overview';
import { setCases, setOverviewData, setSavedCases, showDetailedCase } from '../App/cd-actions';
import { selectCases, selectDetailedCase, selectOverviewData, selectSavedCases } from '../App/cd-selectors';


const dataReducer = (state, event) => {
  return {
    ...state,
    ...event
  }
}
const minDate = moment().subtract(100, 'years');
const maxDate = moment();
const defaultDate = {
  selected: DATE_OPTIONS[0],
  from: minDate,
  to: maxDate
};
const defaultState = {
  date: defaultDate,
  caseId: "",
  specialties: [],
  procedures: [],
  tags: [],
  roomNames: [],
  onlySavedCases: false
};
const searchReducer = (state, event) => {
  if (event.name == 'overview'){
    return {
      ...defaultState,
      ...event.value
    }
  } else if (event.name == 'date-clear') {
    event.name = 'date'
    event.value = defaultDate;
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

export default function CaseDiscovery(props) { // eslint-disable-line react/prefer-stateless-function
  const dispatch = useDispatch();

  const [DATA, setData] = useReducer(dataReducer, {
    SPECIALTIES: [],
    PROCEDURES: [],
    ORS: [],
    isLoading: true,
    facilityName: "",
    gracePeriod: 0,
    outlierThreshold: 0
  });
  const OVERVIEW_DATA = useSelector(selectOverviewData());
  const savedCases = useSelector(selectSavedCases());
  const [USERS, setUsers] = useState([]);

  const [flagReport, setFlagReport] = useState(null);
  const [roomIds, setRoomIds] = useState(null);


  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());
  const DETAILED_CASE = useSelector(selectDetailedCase());
  const CASES = useSelector(selectCases());

  const urlParams = new URLSearchParams(window.location.search)
  //Open the caseId through URL
  const manualCaseId = urlParams.get('caseId')
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

  useEffect(() => {
    if (!logger) {
      return;
    }
    logger.manualAddLog('session', 'open-case-discovery');
    logger.exitLogs.push({ event: 'session', id: 'close-case-discovery', value: "Exited/Refreshed page" });
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
    logger.manualAddLog('session', 'initial-cases', CASES.slice(0, 10).map(formatCaseForLogs))

    //Log the initial cases in view
    logger.manualAddLog('session', 'cases-in-view', getCasesInView());

    // Setup scrolling variable
    let isScrolling;
    const casesWindow = document.getElementById('cases-id');

    // Listen for scroll events
    casesWindow && casesWindow.addEventListener('scroll', (event) => {

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
          console.log("oh no", error)
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
          console.log("oh no", error)
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
          result.sort((a, b) => moment(b.wheelsIn).valueOf() - moment(a.wheelsIn).valueOf());
          dispatch(setCases(result));
          setData({
            SPECIALTIES: spec.sort(),
            PROCEDURES: proc.sort(),
            ORS: ors.sort(),
            isLoading: false
          })

        }).catch((error) => {
          console.log("uh oh", error)
        })

    }

    const getOverviewData = (endpoint) => globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + endpoint, 'get', userToken, {});
    const fetchRecentFlags = getOverviewData("recent_flags");
    const fetchRecentClips = getOverviewData("recent_clips");
    const fetchRecommendations = getOverviewData("recommendations");
    const fetchSavedCases = getOverviewData("bookmarks");
    const fetchRecentSaved = getOverviewData("recent_bookmarks");
    const fetchOverview = getOverviewData("overview");

    Promise.all([fetchRecentFlags, fetchRecentClips, fetchRecommendations, fetchSavedCases, fetchRecentSaved, fetchOverview].map(function (e) {
      return e && e.then(function (result) {
        return result && result.data;
      })
    })).then(([recentFlags, recentClips, recommendations, savedCases, recentSaved, overview]) => {
      dispatch(setOverviewData({
        recentFlags, recentClips, recommendations,
        recentSaved, overview, savedCases
      }));
    }).catch(function (results) {

    });

    // New
    const fetchFlagReport = async () => {
      await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'flag_report', 'get', userToken, {})
        .then(result => {
          result = result.data;
          setFlagReport(result);
        }).catch((error) => {
          console.log("oh no",error)
        }).finally(() => {

        });
    }

    fetchCases();

    fetchUsers();

    fetchFacilityConfig();
    // Fetch flag submission schema.
    fetchFlagReport();

    document.getElementById('caseDiscovery-nav').addEventListener("click", (x) => {
      setCaseId(null)
    })
  }, []);

  useEffect(() => {
    setTimeout(() => {
      logger && logger.connectListeners();
    }, 300)
  });


  const handleSaveCase = async (caseId) => {
    const isSav = savedCases.includes(caseId);
    const recentSaved = OVERVIEW_DATA.recentSaved || [];
    const index = recentSaved.map((c) => c && c.caseId).indexOf(caseId);
    if (index > -1) {
      recentSaved.splice(index, 1)
    } else {
      const found = CASES.find(c => c.caseId == caseId);
      if (found) {
        recentSaved.push(found)
      }
    }
    dispatch(setOverviewData({
      ...OVERVIEW_DATA, recentSaved, savedCases
    }));
    
    await globalFunctions.axiosFetch(`${process.env.CASE_DISCOVERY_API}bookmarks?case_id=${caseId}&is_bookmarked=${!isSav}`, 'PUT', userToken, {})
      .then(result => {
        logger && logger.manualAddLog('click', `${isSav ? 'remove' : 'add'}-saved-case`, { caseId: caseId });
        result = result.data;
        dispatch(setSavedCases(result))
      }).catch((error) => {
        console.log("oh no", error)
      });

  }


  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseId == null) {
      dispatch(showDetailedCase(null));
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

          dispatch(showDetailedCase(result));
        }).catch((error) => {
          console.log("oh no " + error)
          setCaseId(null)
        }).finally(() => {

        });
    }
    fetchCases();
  }, [caseId]);

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (obj, tabIndex) => {
    setTabIndex(tabIndex);
  }


  // Change/update the filter
  const handleFilterChange = (event, value) => {
    setSearchData({
      name: event,
      value: value,
      logger: logger
    })
  }

  const [searchData, setSearchData] = useReducer(searchReducer, defaultState);

  return (
    <section className="case-discovery">
      <div hidden={caseId}>
        <StyledTabs
          value={tabIndex}
          onChange={(obj, value) => handleTabChange(obj, value)}
          indicatorColor="primary"
          textColor="primary"
        >
          <StyledTab label={"OVERVIEW"} />
          <Divider orientation='vertical' style={{ height: 20, margin: 'auto 0' }} />
          <StyledTab label="BROWSE" />
        </StyledTabs>

        <TabPanel value={tabIndex} index={0}>
          {OVERVIEW_DATA && <Overview
            handleChangeCaseId={(cId) => handleChangeCaseId(cId)}
            handleSaveCase={handleSaveCase}
            handleFilterChange={(e, v) => { handleFilterChange(e, v); setTabIndex(2) }}
            {...OVERVIEW_DATA}
          /> || <LoadingIndicator />}
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <BrowseCases
            searchData={searchData}
            handleFilterChange={(e, v) => handleFilterChange(e, v)}
            handleChangeCaseId={(cId) => handleChangeCaseId(cId)}
            handleSaveCase={handleSaveCase}
            {...DATA}
          />
        </TabPanel>

      </div>
      <DetailedCase {...DETAILED_CASE}
        isSaved={savedCases.includes(caseId)}
        handleSaveCase={() => handleSaveCase(caseId)}
        USERS={USERS}
        handleChangeCaseId={handleChangeCaseId}
        hidden={!caseId}
        flagReport={flagReport}
        roomIds={roomIds}
      />
    </section>
  );
}










