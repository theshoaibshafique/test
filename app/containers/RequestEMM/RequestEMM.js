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
import DateFnsUtils from '@date-io/date-fns';
import './style.scss';
import { GENERAL_SURGERY, UROLOGY, GYNECOLOGY } from '../../constants';

export default class RequestEMM extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      compDate: null,
      selectedOperatingRoom: '',
      selectedSpecialty: '',
      selectedProcedure: '',
      selectedComplication: '',
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
      snackBarOpen: false,
      enhancedMMRequest: {
        operationgRoom: '',
        specialty: '',
        procedure: '',
        complications: [],
        postOpDate: null,
        operationDate: null,
        notes: '',
        usersToNotify: []
      }
    };
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

  handleChangeComplication(e) {
    this.setState({ selectedComplication: e.target.value });
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
    this.setState({
      enhancedMMRequest: {
        operationgRoom: this.state.selectedOperatingRoom,
        specialty: this.state.specialtyCheck ? this.state.specialtyValue : this.state.selectedSpecialty,
        procedure: this.state.procedureCheck ? this.state.procedureValue : this.state.selectedProcedure,
        complications: this.state.complicationsCheck ? [this.state.complicationValue] : [this.state.selectedComplication],
        postOpDate: this.state.compDate,
        operationDate: this.state.date,
        notes: this.state.notes,
        usersToNotify: [this.state.emails]
      }
    });

    let jsonBody = {
      "operationgRoom": this.state.operationgRoom,
      "specialty": this.state.specialty,
      "procedure": this.state.procedure,
      "complications": this.state.complications,
      "postOpDate": this.state.postOpDate,
      "operationDate": this.state.operationDate,
      "notes": this.state.notes,
      "usersToNotify": this.state.usersToNotify
    }

    globalFuncs.genericFetch(process.env.EMMREQUEST_API, 'post', this.props.userToken, jsonBody)
    .then(result => {
      if (result === 'error' || result === 'conflict') {
        this.setState({ snackBarOpen: true, snackBarMsg: 'A problem has occurred while completing your action. Please try again or contact the administrator.' });
      } else {
        this.setState({ snackBarOpen: true, snackBarMsg: 'Request Submitted' });
      }
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
            <div className="first-column">Estimated Date and Time of Operation</div>
          </div>
          <div>
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
          <div className="input">
            <div className="first-column">Date of Complication</div> <div >Operating Room</div>
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
            <FormControl style={{minWidth: 800}}>
              <InputLabel htmlFor='complication'></InputLabel>
                <Select value={this.state.selectedComplication} displayEmpty onChange={(e) => this.handleChangeComplication(e)} inputProps={{ name: 'complication', id: 'complication' }}>
                  <MenuItem value=''>Select</MenuItem>
                  <MenuItem value='9BBB21E3-4E9D-4A2B-AEBF-A4126913896B'>Abscess</MenuItem>
                  <MenuItem value='840A54CA-5D77-4615-ACFE-C1987622017D'>Anastomotic Leak</MenuItem>
                  <MenuItem value='1051672B-BAC9-4C1D-9EA5-5FA4191C739E'>Bile Leak</MenuItem>
                  <MenuItem value='1529799C-C4D9-4034-ABDD-2FAA21047904'>Bleeding</MenuItem>
                  <MenuItem value='56C4E921-CCB6-41E5-B607-0B1187B47621'>Bowel obstruction</MenuItem>
                  <MenuItem value='6E3391D7-AD83-4060-8D65-77C8F8AC294D'>Cardiac failure</MenuItem>
                  <MenuItem value='53E0A898-4005-4D0A-8A22-F3BE4388878E'>DVT</MenuItem>
                  <MenuItem value='51712BD0-2BB1-45AC-B17E-80B89E831066'>Hernia</MenuItem>
                  <MenuItem value='850B6CA9-8491-4A2D-8113-7785BA158ABF'>Ileus</MenuItem>
                  <MenuItem value='FBB927FE-7549-43D6-9B2D-6EDD4E5970AB'>Pancreatic leak</MenuItem>
                  <MenuItem value='0EF069B8-1240-45C7-B7D3-A6AFBAD855AF'>PE</MenuItem>
                  <MenuItem value='886B628A-78BC-4267-9A43-C85F81FB003E'>Pneumonia</MenuItem>
                  <MenuItem value='3C399110-7CD2-4F8A-AB46-1C10F0F0854C'>Readmission</MenuItem>
                  <MenuItem value='3FF34DF9-0699-4D53-909E-9FC7388E1A0F'>Respiratory failure</MenuItem>
                  <MenuItem value='46D9EF33-46BF-49D9-A83E-FB6E9D7FAF56'>Return to Operating Room</MenuItem>
                  <MenuItem value='6A3473D6-B0AC-4EC6-98B0-20B01B75A2A3'>Sepsis</MenuItem>
                  <MenuItem value='28F7556C-DD63-440C-8DD5-7C857516D4CD'>Unplanned ICU admission</MenuItem>
                  <MenuItem value='E2E6A43E-3F42-4AB6-AB84-F6A1FEFF18E0'>Urinary Tract Infection</MenuItem>
                  <MenuItem value='97CC9B23-B442-4D2F-A7C3-4B869F79EFFE'>Wound dehiscence</MenuItem>
                  <MenuItem value='069F3784-AEA2-4D76-BA82-37BD72D31465'>Wound Infection</MenuItem>
                </Select>
            </FormControl>
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
          <p className="button-padding"><Button style={{color : "#3db3e3"}}>Cancel</Button> </p>
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