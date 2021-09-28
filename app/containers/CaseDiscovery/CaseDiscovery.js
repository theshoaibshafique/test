/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useReducer, useState } from 'react';
import 'c3/c3.css';
import './style.scss';
import { Divider } from '@material-ui/core';
import { DATE_OPTIONS } from './misc/constants';
import moment from 'moment/moment';

import globalFunctions from '../../utils/global-functions';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import { formatCaseForLogs, getCasesInView, getPresetDates } from './misc/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLogger, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import 'react-multi-carousel/lib/styles.css';
import { StyledTabs, StyledTab, TabPanel } from './misc/helper-components';
import { BrowseCases } from './BrowseCases';
import { DetailedCase } from './DetailedCase';
import { Overview } from './Overview';
import { exitCaseDiscovery, setCases, setFlagReport, setOverviewData, setRecentSaved, setSavedCases, showDetailedCase } from '../App/cd-actions';
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
  if (event.name == 'overview') {
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
    const fetchSavedCases = getOverviewData("bookmarks");
    const fetchOverview = getOverviewData("overview");

    Promise.all([fetchSavedCases, fetchOverview].map(function (e) {
      return e && e.then(function (result) {
        return result && result.data;
      })
    })).then(([savedCases, overview]) => {
      const {tagOverview, recommendations, recentBookmarks, recentFlags, recentClips} = overview;
      dispatch(setOverviewData({
        recentFlags, recentClips, recommendations,
        recentSaved:recentBookmarks, overview:tagOverview, savedCases
      }));
    }).catch(function (results) {
      console.log("uh oh", results)
    });

    // New
    const fetchFlagReport = async () => {
      await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'flag_report', 'get', userToken, {})
        .then(result => {
          result = result.data;
          dispatch(setFlagReport(result));
        }).catch((error) => {
          console.log("oh no", error)
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

    return () => {
      dispatch(exitCaseDiscovery());
    }
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
    //If save
    if (index < 0) {
      const found = CASES.find(c => c.caseId == caseId);
      if (found) {
        recentSaved.unshift(found)
        dispatch(setRecentSaved(recentSaved.slice(0, 5)));
      }
    }


    const result = await globalFunctions.axiosFetch(`${process.env.CASE_DISCOVERY_API}bookmarks?case_id=${caseId}&is_bookmarked=${!isSav}`, 'PUT', userToken, {})
      .then(result => {
        logger && logger.manualAddLog('click', `${isSav ? 'remove' : 'add'}-saved-case`, { caseId: caseId });
        result = result.data;
        return result
      }).catch((error) => {
        console.log("oh no", error)
      });
    // If they're unsaving we wait for savedCases to be updated before getting the next cases
    if (index > -1) {
      const recentSavedData = await globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + 'recent_bookmarks', 'get', userToken, {});
      dispatch(setRecentSaved(recentSavedData.data));
    }

    dispatch(setSavedCases(result));
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
    const tabLabel = tabIndex == 0 ? "overview" : "browse";
    logger && logger.manualAddLog('click', `change-tab-${tabLabel}`, tabLabel);
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
      {/* TODO: find a better way to hide overview  */}
      {/* Currently we always keep it rendered so carousels dont glitch */}
      <div style={caseId ? { position: 'absolute', left: -10000 } : {}}>
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
        roomIds={roomIds}
      />
    </section>
  );
}










