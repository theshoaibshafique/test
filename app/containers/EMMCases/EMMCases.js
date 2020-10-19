import React from 'react';
import { Grid, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core/';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { SafariWarningBanner } from '../EMMReports/SafariWarningBanner';

const EMMCasesTable = (props) => {
  let { tableData, redirect, openReport } = props;

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{width:"20%"}}>Request ID</TableCell>
              <TableCell style={{width:"20%"}} align="left">Procedure</TableCell>
              <TableCell style={{width:"30%"}} align="left">Complications</TableCell>
              <TableCell style={{width:"15%"}} align="left">Operating Room</TableCell>
              <TableCell style={{width:"20%"}} align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="pointer">

            {tableData.map((cases, index) => {
                return <TableRow key={index}>
                  <TableCell style={{width:"20%"}} onClick={() => redirect(cases.requestId)}>{cases.requestId}</TableCell>
                  <TableCell style={{width:"20%"}} onClick={() => redirect(cases.requestId)}>{cases.procedureNames}</TableCell>
                  <TableCell style={{width:"30%"}} onClick={() => redirect(cases.requestId)}>{cases.complicationNames}</TableCell>
                  <TableCell style={{width:"15%"}} onClick={() => redirect(cases.requestId)}>{cases.operatingRoom}</TableCell>
                  <TableCell style={{width:"20%"}} align="left">
                    {(cases.reportPublished) ?
                      <Button type="submit" variant="outlined" className="open-report" onClick={() => openReport(cases.enhancedMMReferenceName)}><span>Open Report</span></Button> :
                      <span className="in-progress">In-Progress</span>}
                  </TableCell>
                </TableRow>
              })
            }

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);

    let { specialties, complications, operatingRooms } = this.props;

    let surgeryMap = new Map;
    specialties.map((specialty) => specialty.procedures).flatten().forEach((procedure) => {
      surgeryMap.set(procedure.value.toUpperCase(), procedure.name)
    })

    let complicationsMap = new Map;
    complications.forEach((complication) => {
      complicationsMap.set(complication.value.toUpperCase(), complication.name)
    })

    let operatingRoomMap = new Map();
    operatingRooms.map((room) => {
      operatingRoomMap.set(room.roomName.toUpperCase(), room.roomTitle);
    });

    this.state = {
      requestID: '',
      report: {
        requestId: '',
        procedureNames: [],
        complicationNames: [],
        operatingRoom: ''
      },
      surgeryMap,
      complicationsMap,
      operatingRoomMap,
      recentSearch: [],
      noMatch: false,
      localSearchCache: [],
      isSafari: navigator.vendor.includes('Apple')
    };
  }

  hashMapSearch(map, targets) {
    let result = [];
    targets.forEach((target) => {
      (map.has(target.toUpperCase())) &&
        result.push(map.get(target.toUpperCase())) || result.push(target)
    })
    return result.join(', ');
  }

  componentDidMount() {
    let { surgeryMap, complicationsMap, operatingRoomMap } = this.state;
    let localSearchCache = JSON.parse(localStorage.getItem('recentSearch-'+this.props.userEmail));
    if (localSearchCache && localSearchCache.length > 0) {
      //Call Api to get most recent list
      globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/list', 'POST', this.props.userToken, localSearchCache)
        .then(result => {
          let recentSearch = [];
          result.map((savedResult) => {
            let operatingRoom = operatingRoomMap.get(savedResult.roomName.toUpperCase());

            recentSearch.push({
              requestId: savedResult.name,
              procedureNames: this.hashMapSearch(surgeryMap, savedResult.procedure),
              complicationNames: this.hashMapSearch(complicationsMap, savedResult.complications),
              operatingRoom: operatingRoom,
              reportPublished: savedResult.enhancedMMPublished,
              enhancedMMReferenceName: savedResult.enhancedMMReferenceName
            })
          })

          this.setState({
            recentSearch,
            localSearchCache
          })
        })
    }
  };

  openReport(reportID) {
    this.props.showEMMReport(reportID)
  }

  search(e) {
    let { requestID, recentSearch, localSearchCache, surgeryMap, complicationsMap, operatingRoomMap } = this.state;
    if (e){
      e.preventDefault();
    }


    if (requestID) {
      this.reset();

      globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.state.requestID, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({ noMatch: true })
        } else {
          let operatingRoom = operatingRoomMap.get(result.roomName.toUpperCase());

          let report = {
            requestId: result.name,
            procedureNames: this.hashMapSearch(surgeryMap, result.procedure),
            complicationNames: this.hashMapSearch(complicationsMap, result.complications),
            operatingRoom: operatingRoom,
            reportPublished: result.enhancedMMPublished,
            enhancedMMReferenceName: result.enhancedMMReferenceName
          }

          this.setState({ report: report });

          if (localSearchCache.indexOf(result.name.toUpperCase()) < 0) {
            if (recentSearch.length < 5) {
              this.setState({ recentSearch: [...recentSearch, report] });
            } else {
              let search = recentSearch;
              search.shift();
              search.push(report);
              this.setState({ recentSearch: search });
            }
            localStorage.setItem('recentSearch-'+this.props.userEmail, JSON.stringify([...localSearchCache, result.name.toUpperCase()]));
            this.setState({
              localSearchCache: [...localSearchCache, result.name.toUpperCase()]
            })
          }

          this.setState({ noMatch: false })
        }
      });
    }
  };

  handleFormChange(e) {
    this.setState({ requestID: e.target.value.trim() });
  };

  reset() {
    this.setState({
      report: {
        requestId: '',
        procedureNames: [],
        complicationNames: [],
        operatingRoom: ''
      }
    });
  };

  redirect(requestId) {
    this.props.pushUrl('/emm/' + requestId);
  }

  render() {
    return (
      <div>
        {(this.state.isSafari) &&
          <SafariWarningBanner />
        }
        <section className="EMM-CASES">
        <Grid container spacing={0}>
          <Grid item xs={12} className="header">
            Enhanced M&M Cases
          </Grid>
          <form onSubmit={()=>this.search()}>
            <Grid item xs={12} className="page-subtitle">
              Please enter your eM&M Request ID below and click Search to retrieve your report or open a recently accessed report.
            </Grid>
            <Grid item xs={8} className="page-search">
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    id="requestID"
                    name="requestID"
                    placeholder="Request ID"
                    variant="outlined"
                    size="small"
                    className="input-field"
                    onChange={(e) => this.handleFormChange(e)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button type="submit" variant="outlined" className="primary" style={{height:40}} onClick={(e) => this.search(e)}>Search</Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
          {(this.state.report.requestId || this.state.noMatch) &&
          <Grid item xs={12} className="search">Search Result</Grid>
          }
          <Grid item xs={12}>
            {(this.state.report.requestId) &&
              <EMMCasesTable
                tableData={[this.state.report]}
                redirect={(id)=>this.redirect(id)}
                openReport={(reportID)=>this.openReport(reportID)}
              />
            }

          {(this.state.noMatch) &&
            <Grid item xs={12}>No report matches your Request ID</Grid>
          }
          </Grid>

          {(this.state.recentSearch.length > 0) &&
          <Grid item xs={12}><p className="recent">Recently accessed cases</p></Grid>
          }
          <Grid item xs={12}>
            {(this.state.recentSearch.length > 0) &&
              <EMMCasesTable
                tableData={this.state.recentSearch}
                redirect={(id)=>this.redirect(id)}
                openReport={(reportID)=>this.openReport(reportID)}
              />
            }
          </Grid>

        </Grid>
      </section>
      </div>
    );
  }
}