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
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY, COMPLICATIONS, OPERATING_ROOM } from '../../constants';
import { Grid ,FormHelperText } from '@material-ui/core';

export default class RequestEMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedSpecialty: '',
      selectedProcedure: '',
      selectedComplication: [],
      notes: '',
      options: '',
      operatingRooms: [],
      specialtyCheck: false,
      specialtyValue: '',
      procedureCheck: false,
      procedureValue: '',
      complicationsCheck: false,
      complicationValue: '',
      snackBarMsg: '',
      snackBarOpen: false,
      userList: [],
      inputValue: '',
      isLoading: false
    };

    this.state.operatingRooms = OPERATING_ROOM.map((data, index) =>
            <MenuItem value={data.value} key={index}>{data.name}</MenuItem>);
  }

  handleDateChange = (date) => {
    this.setState({ date })
  };

  handleCompDateChange = (compDate) => {
    this.setState({ compDate })
  };

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
    this.setState({ isLoading: true });

    let usersToNotify = this.state.inputValue.map((users) => {
      return users.value;
    });

    let jsonBody = {
      "operatingRoom": this.state.selectedOperatingRoom,
      "specialty": this.state.specialtyCheck ? this.state.specialtyValue : this.state.selectedSpecialty,
      "procedure": this.state.procedureCheck ? this.state.procedureValue : this.state.selectedProcedure,
      "complications": this.state.complicationsCheck ? [this.state.complicationValue] : this.state.selectedComplication,
      "postOpDate": this.state.compDate,
      "operationDate": this.state.date,
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
          snackBarOpen: true,
          snackBarMsg: 'Request Submitted',
          isLoading: false
        });
      }
    });
  }

  reset() {
    this.setState({
      date: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedSpecialty: '',
      selectedProcedure: '',
      selectedComplication: [],
      notes: '',
      options: '',
      specialtyCheck: false,
      specialtyValue: '',
      procedureCheck: false,
      procedureValue: '',
      complicationsCheck: false,
      complicationValue: '',
      inputValue: ''
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

  handleInputChange = (inputValue) => {
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
      <section>


        <Grid container spacing={2}>
          <Grid item xs={12} className="header">
          <p>Request for Enhanced M&M</p>
          </Grid>
          <Grid item xs={12} >
          <p>Please fill in all the fields to submit a request for an Enhanced M&M.</p>
          </Grid>

          <Grid item xs={6} >
            Date of Operation
          </Grid>

          <Grid item xs={6} >
            Estimated Time(hh:mm)
          </Grid>
          <Grid item xs={6} >
              <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    id="date-picker-operation"
                    placeholder="Select"
                    inputVariant="outlined"
                    className="input-field"
                    minDate={new Date().setDate(new Date().getDate()-30)}
                    maxDate={new Date()}  
                    value={this.state.date}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
              </MuiPickersUtilsProvider>
          </Grid>
          {/* Estimated time */}
          <Grid item spacing={2} xs={6}>
            <Grid item xs={12}>
              <FormControl variant="outlined" className="input-field">
                  <Select displayEmpty>
                    <MenuItem value='' className="placeholder" disabled>Select</MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                  </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid item xs={12} >
            Operating Room
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" className="input-field" >
              <InputLabel htmlFor='opRoom'></InputLabel>
              <Select value={this.state.selectedOperatingRoom} displayEmpty onChange={(e) => this.handleChange(e)} inputProps={{ name: 'operatingRoom', id: 'opRoom' }}>
                <MenuItem value='' disabled>Select</MenuItem>
                {this.state.operatingRooms}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} >
            Specialty
          </Grid>
          <Grid item xs={12} >
            <FormControl variant="outlined" className="input-field">
              <InputLabel htmlFor='specialty'></InputLabel>
                <Select value={this.state.selectedSpecialty} displayEmpty onChange={(e) => this.handleChangeSpecialty(e)} inputProps={{ name: 'specialty', id: 'specialty' }}>
                  <MenuItem value=''>Select</MenuItem>
                  <MenuItem value='DEB47645-C2A2-4F96-AD89-31FFBCF5F39F'>General Surgery</MenuItem>
                  <MenuItem value='043FEBC8-CF5B-409C-8738-9C83A682DA71'>Urology</MenuItem>
                  <MenuItem value='95F656BA-06BE-4BB5-994C-3AC17FBC6DCB'>Gynecology</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          {/* Other checkbox and field */}
          <Grid item xs={12}>
            <Checkbox onChange={(e) => this.handleCheckSpecialty(e)}/>Other
          </Grid>
          {(this.state.specialtyCheck) &&
              <Grid item xs={12} >
                <TextField
                    id="specialty-other"
                    variant="outlined"
                    onChange={(e) => this.fillSpecialty(e)}
                  />
              </Grid>
          }

          <Grid item xs={12} >
            Procedure
          </Grid>
          <Grid item xs={12} >
            <FormControl variant="outlined" className="input-field">
              <InputLabel htmlFor='procedure'></InputLabel>
                <Select value={this.state.selectedProcedure} displayEmpty onChange={(e) => this.handleChangeProcedure(e)} inputProps={{ name: 'procedure', id: 'procedure' }}>
                  <MenuItem value=''>Select</MenuItem>
                  {this.state.options}
                </Select>
            </FormControl>
          </Grid>
          {/* Other checkbox and field */}
          <Grid item xs={12}>
            <Checkbox onChange={(e) => this.handleCheckProcedure(e)}/>Other
          </Grid>
          {(this.state.procedureCheck) &&
              <Grid item xs={12}>
                <TextField
                    id="procedure-other"
                    variant="outlined"
                    onChange={(e) => this.fillProcedure(e)}
                />
              </Grid>
          }

          <Grid item xs={12} >
            Date of Complication
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="outlined"
                    format="MM/dd/yyyy"
                    // margin="normal"
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

          <Grid item xs={12} >
            Complications
          </Grid>
          <Grid item xs={12} >
            <Autocomplete
              multiple
              id="complication"
              options={COMPLICATIONS}
              getOptionLabel={option => option.name}
              onChange={(e, value) => this.handleChangeComplication(e, value)}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="Select"
                  variant="outlined" 
                  
                />
              )}
            />
          </Grid>
          <Grid item xs={12} >
            <Checkbox onChange={(e) => this.handleCheckComplications(e)}/>Other
          </Grid>
          <Grid item xs={12} >
            {(this.state.complicationsCheck) &&
              <Grid item xs={12}>
                <TextField
                    id="complications-other"
                    variant="outlined"
                    onChange={(e) => this.fillComplication(e)}
                />
              </Grid>
            }
          </Grid>

          <Grid item xs={12} >
            Notes (Optional)
          </Grid>
          <Grid item xs={12} >
            Do not enter any Personal Health Information that can be used to identify the patient (e.g. patient’s name, age, etc.)
          </Grid>
          <Grid item xs={12} >
            <TextField
                id="notes"
                multiline
                fullWidth
                rows="14"
                variant="outlined"
                onChange={(e) => this.fillNotes(e)}
            />
          </Grid>

          <Grid item xs={12} >
            Send email updates about eM&M to (optional):
          </Grid>
          <Grid item xs={12} >
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              onChange={(e) => this.handleInputChange(e)}
            />
          </Grid>


        </Grid>


        
        <div className="user-info-buttons">
          <p className="button-padding"><Button style={{color : "#3db3e3"}} onClick={() => this.reset()}>Reset Form</Button> </p>
          <p><Button variant="contained" className="primary" disabled={(this.state.isLoading)} onClick={() => this.submit()}>
              {(this.state.isLoading) ? <div className="loader"></div> : 'Submit'}</Button> </p>
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