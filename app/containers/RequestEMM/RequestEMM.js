import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { MuiPickersUtilsProvider, DatePicker, DateTimePicker} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS } from '../../constants';

export default class RequestEMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      compDate: null,
      selectedLocation: '',
      selectedOperatingRoom: '',
      selectedSpecialty: '',
      selectedProcedure: '',
      selectedComplication: [],
      notes: '',
      emails: [],
      options: '',
      specialtyCheck: false,
      specialtyValue: '',
      procedureCheck: false,
      procedureValue: '',
      complicationsCheck: false,
      complicationValue: '',
      snackBarMsg: '',
      snackBarOpen: false
    };
  }

  handleDateChange = (date) => {
    this.setState({ date })
  };

  handleCompDateChange = (compDate) => {
    this.setState({ compDate })
  };

  handleChangeLocation(e) {
    this.setState({ selectedLocation: e.target.value });
  }

  handleChange(e) {
    this.setState({ selectedOperatingRoom: e.target.value });
  };

  handleChangeSpecialty(e) {
    this.setState({ selectedSpecialty: e.target.value });
    this.changeProcedureList(e.target.value);
  };

  handleChangeProcedure(e) {
    this.setState({ selectedProcedure: e.target.value });
  };

  handleChangeComplication(e, values) {
    let value = values.map(comp => comp.value);
    this.setState({ selectedComplication: value });
  };

  handleChangeEmails(e) {
    this.setState({ emails: e.target.value });
  };

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
  };

  changeProcedureList(value) {
    switch (value) {
      case 'DEB47645-C2A2-4F96-AD89-31FFBCF5F39F':
        let generalSurgeryData = GENERAL_SURGERY;
        this.state.options = generalSurgeryData.map((data, index) =>
                <MenuItem value={data.value} key={index}>{data.name}</MenuItem>
            );
        break;

      case '043FEBC8-CF5B-409C-8738-9C83A682DA71':
        let urologyData = UROLOGY;
        this.state.options = urologyData.map((data, index) =>
                <MenuItem value={data.value} key={index}>{data.name}</MenuItem>
            );
        break;

      case '95F656BA-06BE-4BB5-994C-3AC17FBC6DCB':
        let gynecologyData = GYNECOLOGY;
        this.state.options = gynecologyData.map((data, index) =>
                <MenuItem value={data.value} key={index}>{data.name}</MenuItem>
            );
        break;

      case '':
        this.state.options = '';
        break;
    }
  };

  handleCheckSpecialty(e) {
    this.setState({ specialtyCheck: e.target.checked, specialtyValue: '' });

    if (!e.target.checked) {
      this.setState({ specialtyValue: '' });
    }
  };

  handleCheckProcedure(e) {
    this.setState({ procedureCheck: e.target.checked });

    if (!e.target.checked) {
      this.setState({ procedureValue: '' });
    }
  };

  handleCheckComplications(e) {
    this.setState({ complicationsCheck: e.target.checked });

    if (!e.target.checked) {
      this.setState({ complicationValue: '' });
    }
  }

  fillNotes(e) {
    this.setState({ notes: e.target.value });
  }

  fillSpecialty(e) {
    this.setState({ specialtyValue: e.target.value });
  }

  fillProcedure(e) {
    this.setState({ procedureValue: e.target.value });
  }

  fillComplication(e) {
    this.setState({ complicationValue: e.target.value });
  }

  submit() {
    let jsonBody = {
      "location": this.state.selectedLocation,
      "operatingRoom": this.state.selectedOperatingRoom,
      "specialty": this.state.specialtyCheck ? this.state.specialtyValue : this.state.selectedSpecialty,
      "procedure": this.state.procedureCheck ? this.state.procedureValue : this.state.selectedProcedure,
      "complications": this.state.complicationsCheck ? [this.state.complicationValue] : this.state.selectedComplication,
      "postOpDate": this.state.compDate,
      "operationDate": this.state.date,
      "notes": this.state.notes,
      "usersToNotify": this.state.emails
    }

    globalFuncs.genericFetch(process.env.EMMREQUEST_API, 'post', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error' || result === 'conflict') {
        this.setState({ 
          snackBarOpen: true,
          snackBarMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.'
        });
      } else {
        this.reset();
        this.setState({
          snackBarOpen: true,
          snackBarMsg: 'Request Submitted'
        });
      }
    });
  }

  reset() {
    this.setState({
      date: null,
      compDate: null,
      selectedLocation: '',
      selectedOperatingRoom: '',
      selectedSpecialty: '',
      selectedProcedure: '',
      selectedComplication: [],
      notes: '',
      emails: [],
      options: '',
      specialtyCheck: false,
      specialtyValue: '',
      procedureCheck: false,
      procedureValue: '',
      complicationsCheck: false,
      complicationValue: ''
    });
  }

  render() {
    return (
      <section>
        <div className="header">
          <p>Request for Enhanced M&M</p>
        </div>

        <div><p>Please fill in all the fields to submit a request for an Enhanced M&M.</p></div>
        
        <div className="requestBox">
          <div className="input">
            <div className="first-column">Estimated Date and Time of Operation</div><div>Location</div>
          </div>
          <div className="input">
            <div className="first-column">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    inputVariant="outlined"
                    margin="normal"
                    format="dd/MM/yyyy hh:mm"
                    value={this.state.date || Date.now()}
                    onChange={this.handleDateChange}
                    id="date-picker-operation"
                  />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <FormControl style={{minWidth: 250}}>
                <InputLabel htmlFor='location'></InputLabel>
                  <Select value={this.state.selectedLocation} displayEmpty onChange={(e) => this.handleChangeLocation(e)} inputProps={{ name: 'location', id: 'location' }}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value='dde247f8-fe3f-45d8-b69a-1c5966ff52b0'>Duke University Hospital</MenuItem>
                  </Select>
              </FormControl>
            </div>
          </div>
          <div className="input">
            <div className="first-column">Date of Complication</div> <div>Operating Room</div>
          </div>
          <div className="input">
            <div className="first-column">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    disableToolbar
                    variant="outlined"
                    margin="normal"
                    format="dd/MM/yyyy"
                    value={this.state.compDate || Date.now()}
                    onChange={this.handleCompDateChange}
                    id="date-picker-complication"
                  />
              </MuiPickersUtilsProvider>
            </div>
            {/* show conditional for duke!!!! dde247f8-fe3f-45d8-b69a-1c5966ff52b0 Duke University Hospital */}
            <div>
              <FormControl style={{minWidth: 250}}>
                <InputLabel htmlFor='opRoom'></InputLabel>
                  <Select value={this.state.selectedOperatingRoom} displayEmpty onChange={(e) => this.handleChange(e)} inputProps={{ name: 'operatingRoom', id: 'opRoom' }}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value='41dfabff-fa26-4abb-9aa0-3598c53513be'>OR23</MenuItem>
                    <MenuItem value='4af37533-7f42-42ec-a46b-817926a4c90e'>OR25</MenuItem>
                  </Select>
              </FormControl>
            </div>
          </div>
          <div>
            <div>Specialty</div>
          </div>
          <div>
            <FormControl style={{minWidth: 800}}>
                <InputLabel htmlFor='specialty'></InputLabel>
                  <Select value={this.state.selectedSpecialty} displayEmpty onChange={(e) => this.handleChangeSpecialty(e)} inputProps={{ name: 'specialty', id: 'specialty' }}>
                    <MenuItem value=''>Select</MenuItem>
                    <MenuItem value='DEB47645-C2A2-4F96-AD89-31FFBCF5F39F'>General Surgery</MenuItem>
                    <MenuItem value='043FEBC8-CF5B-409C-8738-9C83A682DA71'>Urology</MenuItem>
                    <MenuItem value='95F656BA-06BE-4BB5-994C-3AC17FBC6DCB'>Gynecology</MenuItem>
                  </Select>
              </FormControl>
          </div>
          <div>
            <div>
              <Checkbox onChange={(e) => this.handleCheckSpecialty(e)}/>Other
            </div>
            <div>
              {(this.state.specialtyCheck) &&
                <TextField
                    id="specialty-other"
                    variant="outlined"
                    onChange={(e) => this.fillSpecialty(e)}
                  />
              }
            </div>  
          </div>
          <div>
            <div>Procedure</div>
          </div>
          <div>
            <FormControl style={{minWidth: 800}}>
              <InputLabel htmlFor='procedure'></InputLabel>
                <Select value={this.state.selectedProcedure} displayEmpty onChange={(e) => this.handleChangeProcedure(e)} inputProps={{ name: 'procedure', id: 'procedure' }}>
                  <MenuItem value=''>Select</MenuItem>
                  {this.state.options}
                </Select>
            </FormControl>
          </div>
          <div>
            <div>
              <Checkbox onChange={(e) => this.handleCheckProcedure(e)}/>Other
            </div>
            <div>
              {(this.state.procedureCheck) &&
                <TextField
                    id="procedure-other"
                    variant="outlined"
                    onChange={(e) => this.fillProcedure(e)}
                  />
              }
            </div>  
          </div>
          <div>
            <div>Complications</div>
          </div> 
          <div>
            <Autocomplete
              multiple
              id="complication"
              options={COMPLICATIONS}
              getOptionLabel={option => option.name}
              onChange={(e, value) => this.handleChangeComplication(e, value)}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Select"
                />
              )}
            />
          </div>
          <div>
            <div>
              <Checkbox onChange={(e) => this.handleCheckComplications(e)}/>Other
            </div>
            <div>
              {(this.state.complicationsCheck) &&
                <TextField
                    id="complications-other"
                    variant="outlined"
                    onChange={(e) => this.fillComplication(e)}
                  />
              }
            </div>  
          </div>          
          <div>
            <div>Notes (Optional)</div>  
          </div>
          <div>
            <div>Do not enter any Personal Health Information that can be used to identify the patient (e.g. patient’s name, age, etc.)</div>  
          </div>
          <div>
            <div>
              <TextField
                id="notes"
                multiline
                fullWidth
                rows="14"
                variant="outlined"
                onChange={(e) => this.fillNotes(e)}
              />
            </div>  
          </div>
          <div>
            <div>Send email updates about eM&M to (optional):</div>  
          </div>
          <div>
            <FormControl style={{minWidth: 800}}>
              <InputLabel htmlFor='emails'></InputLabel>
                <Select value={this.state.emails} displayEmpty onChange={(e) => this.handleChangeEmails(e)} inputProps={{ name: 'email', id: 'emails' }}>
                  <MenuItem value=''>Select</MenuItem>
                  <MenuItem value='DEB47645-C2A2-4F96-AD89-31FFBCF5F39F'>General Surgery</MenuItem>
                  <MenuItem value='043FEBC8-CF5B-409C-8738-9C83A682DA71'>Urology</MenuItem>
                  <MenuItem value='95F656BA-06BE-4BB5-994C-3AC17FBC6DCB'>Gynecology</MenuItem>
                </Select>
            </FormControl>
          </div>                   
        </div>
        
        <div className="user-info-buttons">
          <p className="button-padding"><Button style={{color : "#3db3e3"}} onClick={() => this.reset()}>Cancel</Button> </p>
          <p><Button variant="contained" className="primary" onClick={() => this.submit()}>Submit</Button> </p>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={() => this.handleCloseSnackBar()}
          message={this.state.snackBarMsg}
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