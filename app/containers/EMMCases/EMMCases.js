import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM } from '../../constants';

export default class EMMCases extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      requestID: '',
      report: {
        requestId: '',
        procedureName: '',
        complicationNames: [],
        operatingRoom: ''
      },
      snackBarOpen: false
    };
  }

  search() {
    this.reset();

    globalFuncs.genericFetch(process.env.EMMREQUEST_API + '/' + this.state.requestID, 'get', this.props.userToken, {})
    .then(result => {
      if (result === 'error' || result === 'conflict') {
        this.setState({ snackBarOpen: true })
      } else {
        let surgeryList = GENERAL_SURGERY.concat(UROLOGY).concat(GYNECOLOGY);
        let procedureName = '';
        let complicationList = [];
        let operatingRoom = '';

        surgeryList.map(function(surgery) {
          if (surgery.value.toUpperCase() === result.procedure.toUpperCase()) {
            procedureName = surgery.name;
          }
        });

        result.complications.map(function(complication) {
          COMPLICATIONS.map(function(comp) {
            if (complication.toUpperCase() === comp.value.toUpperCase()) {
              complicationList.push(comp.name);
            }
          });
        });

        OPERATING_ROOM.map(function(room) {
          if (room.value.toUpperCase() === result.operatingRoom.toUpperCase()) {
            operatingRoom = room.name;
          }
        });

        this.setState({
          report: {
            requestId: result.name,
            procedureName: procedureName,
            complicationNames: complicationList.join(', '),
            operatingRoom: operatingRoom
          }
        });
      }
    });
  };

  handleFormChange(e) {
    this.setState({ requestID: e.target.value.trim() });
  };

  reset() {
    this.setState({
      report: {
        requestId: '',
        procedureName: '',
        complicationNames: [],
        operatingRoom: ''
      }
    });
  };

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
  };

  render() {
    return (
      <section>
        <div className="header">
          <p>Enhanced M&M Cases</p>
        </div>

        <div><p>Please enter your eM&M Request ID below and click Search to retrieve your report or open a recently accessed report.</p></div>

        <div className="request-buttons">
          <TextField
              id="requestID"
              name="requestID"
              label="Request ID"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.handleFormChange(e)}
              fullWidth
            />
          <Button variant="contained" className="primary search-button" onClick={() => this.search()}>Search</Button>  
        </div>

        <div className="search">Search Result</div>

        <div>
          {(this.state.report.requestId) ? (
            <div>
              <TableContainer>  
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell align="left">Procedure</TableCell>
                      <TableCell align="left">Complications</TableCell>
                      <TableCell align="left">Operating Room</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow onClick={() => alert('1')}>
                        <TableCell>{this.state.report.requestId}</TableCell>
                        <TableCell align="left">{this.state.report.procedureName}</TableCell>
                        <TableCell align="left">{this.state.report.complicationNames}</TableCell>
                        <TableCell align="left">{this.state.report.operatingRoom}</TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
           ) : (
            <p>No report matches your Request ID</p>
           )}
        </div>
        
        <div><p className="recent">Recently accessed cases</p></div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={() => this.handleCloseSnackBar()}
          message="A problem has occurred while completing your action. Please try again."
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseSnackBar()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />

      </section>
    );
  }
}