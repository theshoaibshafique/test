import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './style.scss';
import globalFuncs from '../../utils/global-functions';

import { Grid } from '@material-ui/core';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestID: '',
      report: {
        requestId: '',
        procedureNames: [],
        complicationNames: [],
        operatingRoom: ''
      },
      recentSearch: '',
      noMatch: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem('recentSearch-'+this.props.userEmail)) {
      const recentSearchCache = JSON.parse(localStorage.getItem('recentSearch-'+this.props.userEmail));

      this.setState({ 
        recentSearch: recentSearchCache
      });  
    }
    this.getOperatingRooms();
  };

  getOperatingRooms(){
    globalFuncs.genericFetch(process.env.LOCATIONROOM_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        let operatingRoomList = [];
        if (result) {
          result.map((room) => {
            operatingRoomList.push({ value: room.roomName, label: room.roomTitle })
          });
        }
        this.setState({ operatingRoomList });
      });
  }

  search(e) {
    if (e){
      e.preventDefault();
    }

    if (this.state.requestID) {
      this.reset();
      
      globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.state.requestID, 'get', this.props.userToken, {})
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({ noMatch: true })
        } else {
          let surgeryList = this.props.specialties && this.props.specialties.map((specialty) => specialty.procedures).flatten() || [];
          let procedureNames = [];
          let complicationList = [];
          let operatingRoom = '';

          result.procedure.map((procedure) => {
            let match = false;
            surgeryList.map((surgery) => {
              if (surgery.value.toUpperCase() === procedure.toUpperCase() && !procedureNames.includes(surgery.name)) {
                procedureNames.push(surgery.name);
                match = true;
              }
            });
            if (!match && !procedureNames.includes(procedure)) { procedureNames.push(procedure); }
          });
          
          result.complications.map((complication) => {
            let match = false;
            this.props.complications && this.props.complications.map((comp) => {
              if (complication.toUpperCase() === comp.value.toUpperCase()) {
                complicationList.push(comp.name);
                match = true;
              }
            });
            if (!match) { complicationList.push(complication); }
          });

          this.state.operatingRoomList.map((room) => {
            if (room.value.toUpperCase() === result.roomName.toUpperCase()) {
              operatingRoom = room.label;
            }
          });

          let report = {
            requestId: result.name,
            procedureNames: procedureNames.join(', '),
            complicationNames: complicationList.join(', '),
            operatingRoom: operatingRoom
          }

          this.setState({ report: report });

          if (this.state.recentSearch.length < 5) {
            this.setState({ recentSearch: [...this.state.recentSearch, report] });
          } else if (this.state.recentSearch.length = 5) {
            let search = this.state.recentSearch;
            search.shift();
            search.push(report);
            this.setState({ recentSearch: search });
          }
          
          localStorage.setItem('recentSearch-'+this.props.userEmail, JSON.stringify(this.state.recentSearch));
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
      <section>
        <form onSubmit={this.search}>
        <Grid container spacing={2}>
          <Grid item xs={12} className="header">
          Enhanced M&M Cases
          </Grid>
          <Grid item xs={12} className="page-subtitle">
          Please enter your eM&M Request ID below and click Search to retrieve your report or open a recently accessed report.
          </Grid>
          <Grid item xs={8}>
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

          {(this.state.report.requestId || this.state.noMatch) &&
          <Grid item xs={12} className="search">Search Result</Grid>
          }
          <Grid item xs={12}>
            {(this.state.report.requestId) &&
              <div>
                <TableContainer>  
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{width:"20%"}}>Request ID</TableCell>
                        <TableCell style={{width:"35%"}} align="left">Procedure</TableCell>
                        <TableCell style={{width:"35%"}} align="left">Complications</TableCell>
                        <TableCell style={{width:"10%"}} align="left">Operating Room</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="pointer">
                        <TableRow onClick={() => this.redirect(this.state.requestID)}>
                          <TableCell style={{width:"20%"}}>{this.state.report.requestId}</TableCell>
                          <TableCell style={{width:"35%"}} align="left">{this.state.report.procedureNames}</TableCell>
                          <TableCell style={{width:"35%"}} align="left">{this.state.report.complicationNames}</TableCell>
                          <TableCell style={{width:"10%"}} align="left">{this.state.report.operatingRoom}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
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
              <TableContainer>  
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{width:"20%"}}>Request ID</TableCell>
                      <TableCell style={{width:"35%"}} align="left">Procedure</TableCell>
                      <TableCell style={{width:"35%"}} align="left">Complications</TableCell>
                      <TableCell style={{width:"10%"}} align="left">Operating Room</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="pointer">
                  
                  {this.state.recentSearch.map((cases, index) => {
                      return <TableRow key={index} onClick={() => this.redirect(cases.requestId)}>
                        <TableCell style={{width:"20%"}}>{cases.requestId}</TableCell>
                        <TableCell style={{width:"35%"}} align="left">{cases.procedureNames}</TableCell>
                        <TableCell style={{width:"35%"}} align="left">{cases.complicationNames}</TableCell>
                        <TableCell style={{width:"10%"}} align="left">{cases.operatingRoom}</TableCell>
                      </TableRow>
                    })
                  }

                  </TableBody>
                </Table>
              </TableContainer>
            }
          </Grid>

        </Grid>
        </form>
      </section>
    );
  }
}