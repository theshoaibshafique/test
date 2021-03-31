import React from 'react';
import AsyncSelect from 'react-select/async';
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
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import { Grid, FormHelperText } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import moment from 'moment/moment';
import globalFunctions from '../../utils/global-functions';

export default class RequestEMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operationDate: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedComplication: [],
      notes: '',
      options: '',
      operatingRooms: [],
      specialtyCheck: false,
      procedureValue: '',
      procedureList: [],
      selectedProcedureList: [],
      selectedProcedures: [],
      complicationsCheck: false,
      complicationValue: '',
      complicationList: [],
      snackBarMsg: '',
      snackBarOpen: false,
      userList: [],
      inputValue: '',
      selectedHour: '',
      selectedMinutes: '',
      selectedAP: '',
      isLoading: false,
      emmID: '',
      minOperationDate: new Date(),
      maxOperationDate: new Date(),
      hoursOptions: globalFuncs.generatePaddedDigits(1, 13, 2, 0),
      minuteOptions: globalFuncs.generatePaddedDigits(0, 60, 2, 0),
      errors: {}
    };

    this.state.minOperationDate.setDate(new Date().getDate() - 21);
    this.state.minOperationDate.setHours(0, 0, 0, 0);

  }


  handleOperationDateChange = (operationDate) => {
    let errors = this.state.errors;
    errors.operationDate = '';
    this.setState({ operationDate, errors })
  };

  handleCompDateChange = (compDate) => {
    let errors = this.state.errors;
    errors.complicationDate = '';
    compDate.setHours(23, 59, 59, 999);
    this.setState({ compDate, errors })
  };

  handleChange(e) {
    let errors = this.state.errors;
    errors.operatingRoom = '';

    this.setState({ selectedOperatingRoom: e, departmentName: e.departmentName, errors });
  };

  handleChangeComplication(e, values) {
    let value = values.map(comp => comp.value);
    let errors = this.state.errors;
    errors.complication = '';
    this.setState({ selectedComplication: value, complicationList: values, errors });
  };

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
  };

  handleChangeProcedure(e, values) {
    let value = values.map(comp => comp.value);
    let errors = this.state.errors;
    errors.procedure = '';
    this.setState({ selectedProcedures: value, selectedProcedureList: values, errors });
  }

  handleCheckSpecialty(e) {
    let errors = this.state.errors;
    errors.specialtyProducedures = '';
    this.setState({ specialtyCheck: e.target.checked, specialtyValue: '', errors });

    if (!e.target.checked) {
      this.setState({ specialtyValue: '' });
    }
  };

  handleCheckComplications(e) {
    let errors = this.state.errors;
    errors.complication = '';
    this.setState({ complicationsCheck: e.target.checked });

    if (!e.target.checked) {
      this.setState({ complicationValue: '' });
    }
  }

  handleSelectedHourChange(e, value) {
    let errors = this.state.errors;
    errors.hours = '';
    this.setState({ selectedHour: value, errors });
  }

  handleSelectedMinutesChange(e, value) {
    let errors = this.state.errors;
    errors.minutes = '';
    this.setState({ selectedMinutes: value, errors });
  }

  handleSelectedAPChange(e) {
    let errors = this.state.errors;
    errors.ap = '';
    this.setState({ selectedAP: e.target.value, errors });
  }

  fillNotes(e) {
    this.setState({ notes: e.target.value });
  }

  fillSpecialty(e) {
    let errors = this.state.errors;
    errors.specialty = '';
    this.setState({ specialtyValue: e.target.value, errors });
  }

  fillProcedure(e) {
    let errors = this.state.errors;
    errors.procedureValue = '';
    this.setState({ procedureValue: e.target.value, errors });
  }

  fillComplication(e) {
    let errors = this.state.errors;
    errors.complicationValue = '';
    this.setState({ complicationValue: e.target.value });
  }

  setEstimatedhours() {
    if (!this.state.operationDate || !this.state.selectedHour || !this.state.selectedMinutes || !this.state.selectedAP) {
      return;
    }
    var currentDate = this.state.operationDate;
    var hours = parseInt(this.state.selectedHour);
    if (this.state.selectedAP == "AM" && hours == 12) {
      hours -= 12;
    } else if (this.state.selectedAP == "PM" && hours < 12) {
      hours += 12;
    }
    currentDate.setHours(hours);
    currentDate.setMinutes(parseInt(this.state.selectedMinutes));
    this.setState({ operationDate: currentDate })
  }

  isToday(date) {
    const today = new Date();
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear();
  }

  isFormValid() {
    var errors = {};
    var dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    if (!this.state.operationDate) {
      errors.operationDate = "Please select an operation date";
    } else if (this.isToday(this.state.operationDate) && this.state.operationDate > this.state.maxOperationDate) {
      //If its today at a later time
      errors.hours = errors.minutes = errors.ap = "Please select a time in the past";
    } else if (this.state.operationDate > this.state.maxOperationDate || this.state.operationDate < this.state.minOperationDate) {
      errors.operationDate = "Operation date must be between " + this.state.minOperationDate.toLocaleDateString("en-US", dateFormatOptions) + " and today";
    }

    if (!this.state.selectedHour) {
      errors.hours = "Please select an estimated time";
    }

    if (!this.state.selectedMinutes) {
      errors.minutes = "Please select an estimated time";
    }

    if (!this.state.selectedAP || this.state.selectedAP == "NA") {
      errors.ap = "Please select an estimated time";
    }

    if (!this.state.selectedOperatingRoom) {
      errors.operatingRoom = "Please select an operating room";
    }

    //If using the other field for Specialty/Procedure
    if (this.state.specialtyCheck) {
      if (!this.state.procedureValue) {
        errors.procedureValue = "Please enter a procedure";
      }
    } else if (!this.state.selectedProcedures.length) {
      errors.procedure = "Please select a procedure";
    }

    var minCompDate = this.state.operationDate ? this.state.operationDate : this.state.minOperationDate;
    if (!this.state.compDate) {
      errors.complicationDate = "Please select a date of complication";
    } else if (!this.isToday(this.state.compDate) && (this.state.compDate > this.state.maxOperationDate || this.state.compDate < minCompDate)) {
      errors.complicationDate = "Date must be between date of operation and today";
    }

    //Complications has other
    if (this.state.complicationsCheck) {
      if (!this.state.complicationValue) {
        errors.complicationValue = "Please select a complication";
      }
    } else if (!this.state.selectedComplication.length) {
      errors.complication = "Please select a complication";
    }

    if (Object.keys(errors).length > 0) {
      const errorEl = document.querySelector(
        Object.keys(errors).map(fieldName => `[name="${fieldName}"]`).join(',')
      );
      if (errorEl && errorEl.scrollIntoView) {
        // if (errorEl && (errorEl.hidden || errorEl.type == "hidden") && errorEl.scrollIntoView){
        errorEl.parentNode.scrollIntoView()
      } else if (errorEl && errorEl.focus) { // npe
        errorEl.focus(); // this scrolls without visible scroll
      }
    }

    this.setState({ errors: errors });
    return Object.keys(errors).length === 0;
  }

  submit() {
    this.setState({ isLoading: true });

    let usersToNotify = this.state.inputValue ? this.state.inputValue.map((users) => {
      return users.value;
    }) : '';

    this.setEstimatedhours();
    if (!this.isFormValid()) {
      this.setState({
        isLoading: false
      });
      return;
    }
    
    let jsonBody = {
      "roomName": this.state.selectedOperatingRoom.value,
      "specialty": ["58ABBA4B-BEFC-4663-8373-6535EA6F1E5C"],
      "procedure": this.state.specialtyCheck && this.state.procedureValue ? [...this.state.selectedProcedures, this.state.procedureValue] : this.state.selectedProcedures,
      "complications": this.state.complicationsCheck && this.state.complicationValue ? [...this.state.selectedComplication, this.state.complicationValue] : this.state.selectedComplication,
      "postOpDate": globalFuncs.formatDateTime(this.state.compDate),
      "operationDate": globalFuncs.formatDateTime(this.state.operationDate),
      "notes": this.state.notes,
      "usersToNotify": usersToNotify,
      "departmentName": this.state.departmentName,
      "facilityName": this.props.userFacility
    }

    globalFuncs.genericFetch(process.env.REQUESTEMM_API, 'post', this.props.userToken, jsonBody)
      .then(result => {
        if (result === 'error' || result === 'conflict') {
          this.setState({
            snackBarOpen: true,
            snackBarMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.',
            isLoading: false
          });
        } else {
          this.reset();
          this.setState({
            emmID: result,
            isLoading: false
          });
        }
      });
  }

  reset() {
    this.setState({
      operationDate: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedComplication: [],
      complicationList: [],
      notes: '',
      options: '',
      specialtyCheck: false,
      procedureValue: '',
      selectedProcedureList: [],
      selectedProcedures: [],
      complicationsCheck: false,
      complicationValue: '',
      snackBarMsg: '',
      snackBarOpen: false,
      inputValue: '',
      selectedHour: '',
      selectedMinutes: '',
      selectedAP: '',
      isLoading: false,
      emmID: false,
      errors: {}
    });
  }

  async populateUserEmail(e, callback) {
    return await globalFuncs.genericFetch(process.env.USERSEARCH_API, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          let users = [];
          result.map((user) => {
            users.push({ value: user.userName, label: user.firstName.concat(' ').concat(user.lastName) });
          });
          users.sort((a, b) => { return ('' + a.label).localeCompare(b.label) });
          this.setState({
            userList: users
          });
          callback(users);
          return users;
        } else {
          callback([]);
          this.setState({
            userList: []
          });
        }
        return [];
      });
  }

  async populateOperatingRooms(e, callback) {

    return await globalFuncs.genericFetch(process.env.FACILITYDEPARTMENT_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        let operatingRooms = [];
        if (result === 'error' || result === 'conflict') {

        } else if (result && result.length > 0) {
          result.map((department) => {
            let rooms = department.rooms.map((room) => { return { value: room.roomName, label: room.roomTitle, departmentName: department.departmentName } });
            operatingRooms.push({ label: department.departmentTitle, options: rooms });
          });

        }
        callback(operatingRooms)
        this.setState({ operatingRooms });
        return operatingRooms
      });

  }

  componentDidMount() {
    this.populateSpecialtyList();
  }
  populateSpecialtyList() {
    globalFunctions.genericFetch(process.env.PROCEDURE_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        if (result) {
          if (result == 'error' || !result) {
            return;
          }
          let procedureList = this.state.procedureList || []
          result && result.forEach((procedure) => {
            procedureList.push({
              name: procedure.procedureName,
              value: procedure.name
            })
          });
          procedureList.sort((a, b) => { return ('' + a.name).localeCompare(b.name) });
          this.setState({ procedureList });
        } else {

          // error
        }
      });
  }

  handleUserEmailChange = (inputValue) => {
    this.setState({ inputValue: inputValue });
  };

  render() {

    return (
      <section className="request-emm-page subtle-subtext">
        {this.state.emmID ?
          //Submitted view
          <Grid container spacing={2}>
            <Grid item xs={8} className="header">
              <p>Thank you for submitting your request!</p>
            </Grid>
            <Grid item xs={8}>
              Please note the Enhanced M&M ID for the report to be generated: {this.state.emmID}.
          </Grid>
            <Grid item xs={8}>
              We will notify you when the report is ready on Insights for viewing.
          </Grid>
            <Grid item xs={5}>
              <Button variant="outlined" className="primary" style={{ marginTop: 26 }} onClick={() => this.reset()}>Go Back</Button>
            </Grid>
          </Grid>

          : //Default view

          <Grid container spacing={2}>
            <Grid item xs={12} className="header page-title">
              Request for Enhanced M&M
            </Grid>
            <Grid item xs={12} className="page-subtitle">
              Please fill in all the required fields to submit a request for an Enhanced M&M. You will receive a confirmation email once you complete your submission.
            </Grid>

            <Grid item xs={4} className="input-title">
              Date of Operation
            </Grid>

            <Grid item xs={4} className="input-title">
              Estimated Operation Start Time (hh:mm)
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} >
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <DatePicker
                  disableToolbar
                  error={Boolean(this.state.errors.operationDate)}
                  helperText={this.state.errors.operationDate}
                  variant="inline"
                  format="MM/dd/yyyy"
                  id="date-picker-operation"
                  placeholder="Select..."
                  inputVariant="outlined"
                  className="input-field"
                  name="operationDate"
                  minDate={this.state.minOperationDate}
                  maxDate={this.state.maxOperationDate}
                  value={this.state.operationDate}
                  autoOk
                  size="small"
                  inputProps={{ autoComplete: 'off' }}
                  onChange={this.handleOperationDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            {/* Estimated time */}
            <Grid item xs={4}>
              <Grid container spacing={1}>
                <Grid item xs={4} >
                  <Autocomplete
                    disableClearable
                    size="small"
                    id="eta-hrs"
                    options={this.state.hoursOptions}
                    getOptionLabel={option => option}
                    value={this.state.selectedHour}
                    onChange={(e, value) => this.handleSelectedHourChange(e, value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(this.state.errors.hours)}
                        variant="outlined"
                        name="hours"
                        placeholder="Hour"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    disableClearable
                    size="small"
                    id="eta-mins"
                    options={this.state.minuteOptions}
                    getOptionLabel={option => option}
                    value={this.state.selectedMinutes}
                    onChange={(e, value) => this.handleSelectedMinutesChange(e, value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(this.state.errors.minutes)}
                        variant="outlined"
                        name="minutes"
                        placeholder="Mins"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="outlined" className={`input-field ap-field ${this.state.selectedAP || "NA"}`} size="small" error={Boolean(this.state.errors.ap)} >
                    <Select value={this.state.selectedAP || "NA"} onChange={(e) => this.handleSelectedAPChange(e)} name="ap" id="eta-ap">
                      <MenuItem value="NA" disabled>A/P</MenuItem>
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {(this.state.errors.hours || this.state.errors.minutes || this.state.errors.ap) &&
                  <FormHelperText className="Mui-error" style={{ marginLeft: 10, marginTop: -18 }}>{this.state.errors.hours || this.state.errors.minutes || this.state.errors.ap}</FormHelperText>
                }
              </Grid>
            </Grid>

            <Grid item xs={4}></Grid>

            <Grid item xs={12} className="input-title">
              Operating Room
            </Grid>
            <Grid item xs={4} style={{ marginBottom: 18 }}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                options={this.state.operatingRooms}
                loadOptions={(e, v) => this.populateOperatingRooms(e, v)}
                value={this.state.selectedOperatingRoom}
                onChange={(e) => this.handleChange(e)}
                name="operatingRoom"
                id="or-input"
                error={Boolean(this.state.errors.operatingRoom)}
              />
              {(this.state.errors.operatingRoom) &&
                <FormHelperText className="Mui-error" >{this.state.errors.operatingRoom}</FormHelperText>
              }

            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={12} className="input-title" >
              Procedures (Select 1 or more)
            </Grid>
            <Grid item xs={8} >
              <Autocomplete
                multiple
                size="small"
                id="procedure"
                options={this.state.procedureList}
                getOptionLabel={option => option.name}
                value={this.state.selectedProcedureList}
                onChange={(e, value) => this.handleChangeProcedure(e, value)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Start typing to filter and select from the list"
                    error={Boolean(this.state.errors.procedure)}
                    helperText={this.state.errors.procedure}
                    name="procedure"
                  />
                )}
              />
            </Grid>
            {/* Other checkbox and field */}
            <Grid item xs={12} className="other-checkbox" style={this.state.specialtyCheck ? { marginBottom: -8 } : {}}>
              <Checkbox
                disableRipple
                id="other-procedure-checkbox"
                icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                checked={this.state.specialtyCheck} onChange={(e) => this.handleCheckSpecialty(e)} />Other
            </Grid>
            {(this.state.specialtyCheck) &&
              <Grid item xs={12}>
                <Grid item xs={4}>
                  <TextField
                    id="procedure-other"
                    variant="outlined"
                    size="small"
                    name="procedureValue"
                    error={Boolean(this.state.errors.procedureValue)}
                    helperText={this.state.errors.procedureValue}
                    className="input-field"
                    onChange={(e) => this.fillProcedure(e)}
                  />
                </Grid>
              </Grid>
            }

            <Grid item xs={12} className="input-title">
              Date of Complication
            </Grid>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableToolbar
                  size="small"
                  variant="inline"
                  format="MM/dd/yyyy"
                  name="complicationDate"
                  error={Boolean(this.state.errors.complicationDate)}
                  helperText={this.state.errors.complicationDate}
                  minDate={this.state.operationDate ? this.state.operationDate : this.state.minOperationDate}
                  maxDate={this.state.maxOperationDate}
                  placeholder="Select..."
                  inputVariant="outlined"
                  className="input-field"
                  autoOk
                  value={this.state.compDate}
                  inputProps={{ autoComplete: 'off' }}
                  onChange={this.handleCompDateChange}
                  id="date-picker-complication"
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item xs={12} className="input-title">
              Complications (Select 1 or more)
            </Grid>
            <Grid item xs={8} >
              <Autocomplete
                multiple
                size="small"
                id="complication"
                options={this.props.complications}
                getOptionLabel={option => option.name}
                value={this.state.complicationList}
                onChange={(e, value) => this.handleChangeComplication(e, value)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Start typing to filter and select from the list"
                    error={Boolean(this.state.errors.complication)}
                    helperText={this.state.errors.complication}
                    name="complication"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} className="other-checkbox" >
              <Checkbox
                disableRipple
                id="other-complication-checkbox"
                icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
                checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
                checked={this.state.complicationsCheck} onChange={(e) => this.handleCheckComplications(e)} />Other
            </Grid>
            <Grid item xs={12} >
              {(this.state.complicationsCheck) &&
                <Grid item xs={4}>
                  <TextField
                    id="complications-other"
                    variant="outlined"
                    size="small"
                    className="input-field"
                    style={{ marginTop: -16 }}
                    onChange={(e) => this.fillComplication(e)}
                    error={Boolean(this.state.errors.complicationValue)}
                    helperText={this.state.errors.complicationValue}
                    name="complicationValue"
                  />
                </Grid>
              }
            </Grid>

            <Grid item xs={12} className="input-title">
              Notes (Optional)
            </Grid>
            <Grid item xs={8} className="input-subtitle">
              Do not enter any Personal Health Information that can be used to identify the patient (e.g. patient’s name, age, etc.)
            </Grid>
            <Grid item xs={8} >
              <TextField
                id="notes"
                multiline
                className="input-field"
                rows="8"
                variant="outlined"
                onChange={(e) => this.fillNotes(e)}
              />
            </Grid>

            <Grid item xs={12} className="input-title">
              Also send confirmation email to these users (Optional):
            </Grid>
            <Grid item xs={8} style={{ marginBottom: 24 }}>
              <AsyncSelect
                isMulti
                id="email-input"
                cacheOptions
                defaultOptions
                options={this.state.userList}
                loadOptions={(e, callback) => this.populateUserEmail(e, callback)}
                value={this.state.inputValue}
                onChange={(e) => this.handleUserEmailChange(e)}

              />
            </Grid>

            <Grid item xs={8}>
              <Grid container justify="flex-end" spacing={0}>
                <Grid item xs={12}>
                  <Grid container justify="flex-end" spacing={0}>
                    <Button id="reset" style={{ color: "#3db3e3", height: 40, width: 115, marginRight: 40 }} onClick={() => this.reset()}>Reset Form</Button>
                    <Button id="submit" variant="outlined" style={{ height: 40, width: 96 }} className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
                      {(this.state.isLoading) ? <div className="loader"></div> : 'Submit'}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
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