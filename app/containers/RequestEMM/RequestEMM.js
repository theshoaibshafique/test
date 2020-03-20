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
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import './style.scss';
import globalFuncs from '../../utils/global-functions';
import * as CONSTANTS from '../../constants';
import { Grid ,FormHelperText } from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';

export default class RequestEMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operationDate: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedComplication: [],
      specialtyProduceduresList: [],
      notes: '',
      options: '',
      operatingRooms: [],
      specialtyCheck: false,
      specialtyValue: '',
      procedureValue: '',
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
      specialtyProducedureOptions:[],
      minOperationDate: new Date(),
      maxOperationDate: new Date(),
      hoursOptions: this.createDigitDropdown(1,13,2,0),
      minuteOptions: this.createDigitDropdown(0,60,2,0),
      errors: {}
    };

    this.state.minOperationDate.setDate(new Date().getDate()-30);
    this.state.minOperationDate.setHours(0,0,0,0);

    this.state.operatingRooms = CONSTANTS.OPERATING_ROOM.map((data, index) =>
            <MenuItem value={data.value} key={index}>{data.name}</MenuItem>);
    
    CONSTANTS.SPECIALTY.forEach((specialty) => {
      specialty.values.forEach((procedure) => {
        procedure.specialtyName = specialty.name;
        procedure.ID = specialty.ID
        this.state.specialtyProducedureOptions.push(procedure);
      });
    });
  }

  createDigitDropdown = (n,m,size,d) => {
    var result = [];
    for (var i=n; i<m; i++){
      var digit = i.toString().padStart(size,d);
      result.push({time:digit})
    }
    return result;
  }

  handleOperationDateChange = (operationDate) => {
    this.setState({ operationDate })
  };

  handleCompDateChange = (compDate) => {
    this.setState({ compDate })
  };

  handleChange(e) {
    this.setState({ selectedOperatingRoom: e.target.value });
  };


  handleChangeComplication(e, values) {
    let value = values.map(comp => comp.value);
    this.setState({ selectedComplication: value, complicationList: values });
  };

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
  };

  changeSpecialtyProcedureList(e,values) {
    this.setState({
      specialtyProduceduresList: values
    })

  };

  handleCheckSpecialty(e) {
    this.setState({ specialtyCheck: e.target.checked, specialtyValue: '' });

    if (!e.target.checked) {
      this.setState({ specialtyValue: '' });
    }
  };

  handleCheckComplications(e) {
    this.setState({ complicationsCheck: e.target.checked });

    if (!e.target.checked) {
      this.setState({ complicationValue: '' });
    }
  }

  handleSelectedHourChange(e,value){
    this.setState({selectedHour: value});
  }

  handleSelectedMinutesChange(e,value){
    this.setState({selectedMinutes: value});
  }

  handleSelectedAPChange(e){
    this.setState({selectedAP: e.target.value});
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

  setEstimatedhours(){
    var currentDate = this.state.operationDate;
    var hours =parseInt(this.state.selectedHour.time);
    if (this.state.selectedAP == "AM" && hours == 12){
      hours-=12;
    } else if (this.state.selectedAP == "PM" && hours < 12){
      hours+=12;
    }
    currentDate.setHours(hours);
    currentDate.setMinutes(parseInt(this.state.selectedMinutes.time));
    this.setState({operationDate:currentDate})
  }

  isFormValid() {
    var errors = {};
    var dateFormatOptions =  { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    
    if (!this.state.operationDate){
      errors.operationDate = "Please select an operation date";
    } else if (this.state.operationDate > this.state.maxOperationDate || this.state.operationDate < this.state.minOperationDate){
      errors.operationDate = "Operation date must be between "+this.state.minOperationDate.toLocaleDateString("en-US", dateFormatOptions)+" and today";
    } 

    if (!this.state.selectedHour){
      errors.hours = "Please select an estimated time";
    }

    if (!this.state.selectedMinutes){
      errors.minutes = "Please select an estimated time";
    }

    if (!this.state.selectedAP || this.state.selectedAP == -1){
      errors.ap = "Please select an estimated time";
    }

    if (!this.state.selectedOperatingRoom){
      errors.operatingRoom = "Please select an operating room";
    }

    //If using the other field for Specialty/Procedure
    if (this.state.specialtyCheck){
      //Other fields
      if (!this.state.specialtyValue){
        errors.specialty = "Please enter a specialty";
      }

      if (!this.state.procedureValue){
        errors.procedure = "Please enter a procedure";
      }

    } else if (!this.state.specialtyProduceduresList.length){
      errors.specialtyProducedures = "Please select a procedure";
    }

    var minCompDate = this.state.operationDate ? this.state.operationDate : this.state.minOperationDate;
    if (!this.state.compDate){
      errors.complicationDate = "Please select a date of complication";
    }  else if (this.state.compDate > this.state.maxOperationDate || this.state.compDate < minCompDate){
      errors.complicationDate = "Date must be between date of operation and today";
    }

    //Complications has other
    if (this.state.complicationsCheck){
      if (!this.state.complicationValue){
        errors.complicationValue = "Please select a complication";
      }
    } else if (!this.state.selectedComplication.length) {
      errors.complication = "Please select a complication";
    }

    if (Object.keys(errors).length >0){
      const errorEl = document.querySelector(
        Object.keys(errors).map(fieldName => `[name="${fieldName}"]`).join(',')
      );

      if (errorEl && (errorEl.hidden || errorEl.type == "hidden") && errorEl.scrollIntoView){
        errorEl.parentNode.scrollIntoView()
      } else if (errorEl && errorEl.focus) { // npe
        errorEl.focus(); // this scrolls without visible scroll
      }
    }
    


    this.setState({errors: errors});
    return Object.keys(errors).length === 0;
  }

  submit() {
    this.setState({ isLoading: true });

    let usersToNotify = this.state.inputValue ? this.state.inputValue.map((users) => {
      return users.value;
    }) : '';

    if (!this.isFormValid()){
      this.setState({ 
        isLoading: false
      });
      return;
    }

    this.setEstimatedhours();
    var selectedProcedures = [];
    var selectedSpecialties = [];
    if (!this.state.specialtyCheck){
      selectedProcedures = this.state.specialtyProduceduresList.map(procedure => procedure.value);
      selectedSpecialties = this.state.specialtyProduceduresList.map(procedure => procedure.ID);
    }
    

    let jsonBody = {
      "operatingRoom": this.state.selectedOperatingRoom,
      "specialty": this.state.specialtyCheck ? [this.state.specialtyValue] : selectedSpecialties,
      "procedure": this.state.specialtyCheck ? [this.state.procedureValue] : selectedProcedures,
      "complications": this.state.complicationsCheck ? [this.state.complicationValue] : this.state.selectedComplication,
      "postOpDate": this.state.compDate,
      "operationDate": this.state.operationDate,
      "notes": this.state.notes,
      "usersToNotify": usersToNotify
    }

    globalFuncs.genericFetch(process.env.EMMREQUEST_API, 'post', this.props.userToken, jsonBody)
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
      specialtyProduceduresList: [],
      complicationList: [],
      notes: '',
      options: '',
      specialtyCheck: false,
      specialtyValue: '',
      procedureValue: '',
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

  async componentDidMount() {
    this.props.notLoading();

    await globalFuncs.genericFetch(process.env.USERSEARCH_API, 'get', this.props.userToken, {})
    .then(result => {
      if (result) {    
        let users = [];
        result.map((user) => {
          users.push({ value: user.userName, label: user.firstName.concat(' ').concat(user.lastName) });
        });
        
        this.setState({
          userList: users
        });
      } else {
        this.setState({
          userList: []
        });
      }
    });
  }

  handleUserEmailChange = (inputValue) => {
    this.setState({ inputValue: inputValue });
  };

  render() {
    const filterUsers = (inputValue) => {
      return this.state.userList.filter(user =>
        user.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    const promiseOptions = inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterUsers(inputValue));
        }, 1000);
      });

    return (
      <section className="request-emm-page">
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
            <Button variant="contained" className="primary" onClick={() => this.reset()}>Go Back</Button> 
          </Grid>
        </Grid> 
        
        : //Default view
        
        <Grid container spacing={2}>
          <Grid item xs={12} className="header page-title">
          Request for Enhanced M&M
          </Grid>
          <Grid item xs={12} className="page-subtitle">
          Please fill in all the fields to submit a request for an Enhanced M&M.
          </Grid>

          <Grid item xs={4} className="input-title">
            Date of Operation
          </Grid>

          <Grid item xs={4} className="input-title">
            Estimated Time(Hour, Minutes, AM/PM)
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} >
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <KeyboardDatePicker
                    disableToolbar
                    error={Boolean(this.state.errors.operationDate)}
                    helperText={this.state.errors.operationDate}
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-operation"
                    placeholder="Select"
                    inputVariant="outlined"
                    className="input-field"
                    name="operationDate"
                    minDate={this.state.minOperationDate}
                    maxDate={this.state.maxOperationDate}  
                    value={this.state.operationDate}
                    onChange={this.handleOperationDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
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
                  options={this.state.hoursOptions}
                  getOptionLabel={option => option.time ? option.time : ""}
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
                  options={this.state.minuteOptions}
                  getOptionLabel={option => option.time ? option.time : ""}
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
                <FormControl variant="outlined" className="input-field" error={Boolean(this.state.errors.ap)} >
                    <Select value={this.state.selectedAP || "-1"} onChange={(e) => this.handleSelectedAPChange(e)} name="ap">
                      <MenuItem value="-1" disabled>A/P</MenuItem>
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              {(this.state.errors.hours || this.state.errors.minutes || this.state.errors.ap) &&
                <FormHelperText className="Mui-error" style={{marginLeft:10,marginTop:-18}}>{this.state.errors.hours || this.state.errors.minutes || this.state.errors.ap}</FormHelperText>
              }
            </Grid>
          </Grid>

          <Grid item xs={4}></Grid>
          
          <Grid item xs={12} className="input-title">
            Operating Room
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="outlined" className="input-field" error={Boolean(this.state.errors.operatingRoom)} >
              <InputLabel htmlFor='opRoom'></InputLabel>
              <Select value={this.state.selectedOperatingRoom} displayEmpty onChange={(e) => this.handleChange(e)} inputProps={{ name: 'operatingRoom', id: 'opRoom' }} name="operatingRoom">
                <MenuItem value='' disabled>Select</MenuItem>
                {this.state.operatingRooms}
              </Select>
              {(this.state.errors.operatingRoom) &&
                <FormHelperText className="Mui-error" >{this.state.errors.operatingRoom}</FormHelperText>
              }
            </FormControl>
            
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={12} className="input-title" >
            Specialty and Procedure
          </Grid>
          <Grid item xs={8} >
            <Autocomplete
              multiple
              size="small"
              id="specialty"
              options={this.state.specialtyProducedureOptions}
              groupBy={option => option.specialtyName}
              getOptionLabel={option => option.name}
              value={this.state.specialtyProduceduresList}
              onChange={(e, value) => this.changeSpecialtyProcedureList(e, value)}
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(this.state.errors.specialtyProducedures)}
                  helperText={this.state.errors.specialtyProducedures}
                  variant="outlined" 
                  name="specialtyProducedures"
                />
              )}
            />
          </Grid>
          {/* Other checkbox and field */}
          <Grid item xs={12} className="other-checkbox" style={this.state.specialtyCheck ? {marginBottom:-8} : {}}>
            <Checkbox 
            disableRipple 
            icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
            checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
            checked={this.state.specialtyCheck} onChange={(e) => this.handleCheckSpecialty(e)}/>Other
          </Grid>
          {(this.state.specialtyCheck) &&
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={4} className="input-title" >
                    Specialty
                  </Grid>
                  <Grid item xs={4} className="input-title" >
                    Procedure
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4} >
                    <TextField
                        id="specialty-other"
                        error={Boolean(this.state.errors.specialty)}
                        helperText={this.state.errors.specialty}
                        name="specialty"
                        variant="outlined"
                        className="input-field"
                        onChange={(e) => this.fillSpecialty(e)}
                      />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                        id="procedure-other"
                        variant="outlined"
                        name="procedure"
                        error={Boolean(this.state.errors.procedure)}
                        helperText={this.state.errors.procedure}
                        className="input-field"
                        onChange={(e) => this.fillProcedure(e)}
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              </Grid>
          }


          <Grid item xs={12} className="input-title">
            Date of Complication
          </Grid>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    name="complicationDate"
                    error={Boolean(this.state.errors.complicationDate)}
                    helperText={this.state.errors.complicationDate}
                    minDate={this.state.operationDate ? this.state.operationDate : this.state.minOperationDate}
                    maxDate={this.state.maxOperationDate}
                    placeholder="Select"
                    inputVariant="outlined" 
                    className="input-field"
                    value={this.state.compDate}
                    onChange={this.handleCompDateChange}
                    id="date-picker-complication"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} className="input-title">
            Complications
          </Grid>
          <Grid item xs={8} >
            <Autocomplete
              multiple
              size="small"
              id="complication"
              options={CONSTANTS.COMPLICATIONS}
              getOptionLabel={option => option.name}
              value={this.state.complicationList}
              onChange={(e, value) => this.handleChangeComplication(e, value)}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined" 
                  placeholder="Select"
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
            icon={<Icon color="#004F6E" path={mdiCheckboxBlankOutline} size={'18px'} />}
            checkedIcon={<Icon color="#004F6E" path={mdiCheckBoxOutline} size={'18px'} />}
            checked={this.state.complicationsCheck} onChange={(e) => this.handleCheckComplications(e)}/>Other
          </Grid>
          <Grid item xs={12} >
            {(this.state.complicationsCheck) &&
              <Grid item xs={4}>
                <TextField
                    id="complications-other"
                    variant="outlined"
                    className="input-field"
                    style={{marginTop:-16}}
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
                fullWidth
                className="input-field"
                rows="8"
                variant="outlined"
                onChange={(e) => this.fillNotes(e)}
            />
          </Grid>

          <Grid item xs={12} className="input-title">
            Send email updates about eM&M to (optional):
          </Grid>
          <Grid item xs={8} >
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              onChange={(e) => this.handleUserEmailChange(e)}
            />
          </Grid>

          <Grid item xs={8}>
            <Grid container justify="flex-end" spacing={0}>
              <Grid item xs={7}></Grid>
              <Grid item xs={2}>
                <Button style={{color : "#3db3e3",height:40,width:115}} onClick={() => this.reset()}>Reset Form</Button>
              </Grid>
              <Grid item xs={3} >
                <Grid container justify="flex-end">
                <Button variant="contained" style={{height:40,width:96}} className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
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