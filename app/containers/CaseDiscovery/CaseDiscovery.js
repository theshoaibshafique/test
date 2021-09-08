/**
 * CaseDiscovery
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import 'c3/c3.css';
import C3Chart from 'react-c3js';
import './style.scss';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, makeStyles, Menu, MenuItem, Modal, Radio, RadioGroup, Select, Slide, TextField, Tooltip, withStyles } from '@material-ui/core';
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
import { useSelector } from 'react-redux';
import { makeSelectComplications, makeSelectEMMRequestAccess, makeSelectFirstName, makeSelectIsAdmin, makeSelectLastName, makeSelectLogger, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { NavLink } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';
import { Case } from './Case';
import { displayTags, getTag, TagsSelect, useStyles } from './misc/helper-components';
import { BrowseCases } from './BrowseCases';
import { DetailedCase } from './DetailedCase';


const dataReducer = (state, event) => {
  return {
    ...state,
    ...event
  }
}

export default function CaseDiscovery(props) { // eslint-disable-line react/prefer-stateless-function

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

  const [flagReport, setFlagReport] = useState(null);
  const [roomIds, setRoomIds] = useState(null);
  const firstName = useSelector(makeSelectFirstName());
  const lastName = useSelector(makeSelectLastName());

  const userFacility = useSelector(makeSelectUserFacility());
  const userToken = useSelector(makeSelectToken());
  const logger = useSelector(makeSelectLogger());


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

    const getOverviewData = (endpoint) => globalFunctions.axiosFetch(process.env.CASE_DISCOVERY_API + endpoint, 'get', userToken, {});
    const fetchRecentFlags = getOverviewData("recent_flags");
    const fetchRecentClips = getOverviewData("recent_clips");
    const fetchRecommendations = getOverviewData("recommendations");
    const fetchSavedCases = getOverviewData("bookmarks");
    const fetchOverview = getOverviewData("overview");


    Promise.all([fetchRecentFlags, fetchRecentClips, fetchRecommendations, fetchSavedCases, fetchOverview].map(function (e) {
      return e && e.then(function (result) {
        return result && result.data;
      })
    })).then(([recentFlags, recentClips, recommendations, savedCases, overview]) => {
      setData({
        recentFlags, recentClips, recommendations, 
        savedCases, overview
      });
    }).catch(function (results) {

    });

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
    // fetchSavedCases();
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



  const handleSetCases = (res, caseId) => {
    const index = CASES.findIndex(el => el.caseId === caseId);
    CASES[index] = { ...CASES[index], tags: [{ tagName: 'Flagged', toolTip: res && res.description.map(el => `${el.questionTitle}: ${el.answer}`).concat(`Submitted By: ${firstName} ${lastName}`) }, ...CASES[index].tags] };
    return setData({
      [CASES]: CASES/*CASES.map(el => el.caseId === caseId ? { ...el, tags: [flagObject, ...el.tags]} : el)*/
    });
  };




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
            const newCase = CASES.find((c) => c.emrCaseId == result.metaData.emrCaseId);
            logger && logger.manualAddLog('click', `swap-case-${result.metaData.emrCaseId}`, formatCaseForLogs(newCase));
          }

          setDetailedCase(result)

        }).catch((error) => {
          console.log("oh no " + error)
          setCaseId(null)
        }).finally(() => {

        });
    }
    fetchCases();
  }, [caseId]);

  // FLAG SUBMISSION HANDLER - UPDATE DETAILED CASE, ADDING NEWLY SUBMITTED FLAG TO CASE.
  const handleUpdateDetailedCase = (res) => {
    if (res) {
      setDetailedCase(prevState => ({
        ...prevState,
        tags: [{ tagName: 'Flagged', toolTip: res && res.description.map(el => `${el.questionTitle}: ${el.answer}`).concat(`Submitted By: ${firstName} ${lastName}`) }, ...prevState.tags]
      }));
    }
  };

  return (
    <section className="case-discovery">
      <div hidden={caseId}>
        <BrowseCases
          handleChangeCaseId={(cId) => handleChangeCaseId(cId)}
          handleSaveCase={handleSaveCase}
          {...DATA}
        />
      </div>
      <DetailedCase {...DETAILED_CASE}
        isSaved={savedCases.includes(caseId)}
        handleSaveCase={() => handleSaveCase(caseId)}
        USERS={USERS}
        handleChangeCaseId={handleChangeCaseId}
        hidden={!caseId}
        flagReport={flagReport}
        roomIds={roomIds}
        handleSetCases={handleSetCases}
        handleUpdateDetailedCase={handleUpdateDetailedCase}
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









