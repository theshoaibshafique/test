import React from 'react';
import { Grid, TextField, FormControl, MenuItem, Select, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import moment from 'moment/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';



class UniversalPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isORLoading: true,
      operatingRooms: [],
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: "",
      specialties: this.props.specialties || [],
      specialtyDisplay: this.props.isSpecialtyMandatory ? "Select a Specialty" : "All Specialties",
      ...this.getDisplayOptions()
    }
    this.state.specialties = [{ name: this.state.specialtyDisplay, value: "" }, ...this.state.specialties];
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultState != this.props.defaultState) {
      let selectedSpecialty = this.props.defaultState.selectedSpecialty;
      let procedureOptions = selectedSpecialty && selectedSpecialty.procedures || [];
      if (procedureOptions.length > 0) {
        procedureOptions = [{ name: "All Procedures", value: "" }, ...procedureOptions];
      }
      let specialtyDisplay = this.props.isSpecialtyMandatory ? "Select a Specialty" : "All Specialties";
      this.setState({
        ...this.props.defaultState,
        specialtyDisplay,
        specialties: [{ name: specialtyDisplay, value: "" }, ...this.props.specialties],
        procedureOptions,
        ...this.getDisplayOptions()
      });

    }
  }

  componentDidMount() {
    this.populateOperatingRooms();
  }

  getDisplayOptions() {
    if (Boolean(this.props.showOR || this.props.showDays || this.props.showSpecialty || this.props.showProcedure || this.props.showOR2)) {
      return {

        showOR: this.props.showOR,
        showDays: this.props.showDays,
        showSpecialty: this.props.showSpecialty,
        showProcedure: this.props.showProcedure,
        //Default to hiding
        showOR2: this.props.showOR2
      };
    }
    return {//Default to showing
      showOR: true,
      showDays: true,
      showSpecialty: true,
      showProcedure: true,
      //Default to hiding
      showOR2: false
    };
  }

  async populateOperatingRooms(e, callback) {
    return await globalFunctions.genericFetch(process.env.FACILITYDEPARTMENT_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        let operatingRooms = [{ label: "All ORs", value: "" }];
        if (result === 'error' || result === 'conflict') {

        } else if (result && result.length > 0) {
          result.map((department) => {
            department.rooms.map((room) => { operatingRooms.push({ departmentTitle: department.departmentTitle, value: room.roomName, label: room.roomTitle, departmentName: department.departmentName }) });
          });
        }
        this.setState({ operatingRooms, isORLoading: false });
        return operatingRooms
      }).catch(error => {
        console.error(error)
      });

  }

  handleORChange(e, value) {
    this.setState({
      selectedOperatingRoom: value,
      departmentName: value && value.departmentName
    }, () => {
      this.props.updateState('selectedOperatingRoom', value);
    });
  };

  handleSelectedWeekdayChange(e) {
    this.setState({
      selectedWeekday: e.target.value
    }, () => {
      this.props.updateState('selectedWeekday', e.target.value);
    });
  }

  handleSelectedSpecialtyChange(e, selectedSpecialty) {
    let procedureOptions = selectedSpecialty && selectedSpecialty.procedures || [];
    if (procedureOptions.length > 0) {
      procedureOptions = [{ name: "All Procedures", value: "" }, ...procedureOptions];
    }
    this.setState({
      selectedSpecialty,
      procedureOptions,
      selectedProcedure: ""
    }, () => {
      this.props.updateState('selectedSpecialty', selectedSpecialty);
      this.props.updateState('selectedProcedure', "");
    });
  }
  handleSelectedProcedureChange(e, selectedProcedure) {
    this.setState({
      selectedProcedure
    }, () => {
      this.props.updateState('selectedProcedure', selectedProcedure);
    });
  }
  resetFilters() {
    this.setState({
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      procedureOptions: [],
      selectedProcedure: ""
    }, () => {
      this.props.updateState('selectedOperatingRoom', "");
      this.props.updateState('selectedWeekday', "");
      this.props.updateState('selectedSpecialty', "");
      this.props.updateState('selectedProcedure', "");
    })
  }
  formatClass(str) {
    if (str) {
      return str.toLowerCase().replace(/\s/g, '-');
    }
  }

  render() {
    let specialtySelected = this.state.selectedSpecialty && this.state.selectedSpecialty.value;
    let disabled = this.props.disabled || this.props.isSpecialtyMandatory && !specialtySelected;

    return (
      <Grid container spacing={1} justify="center" className="universal-picker">
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><SearchIcon /></span>
        {this.state.showOR && <Grid item xs={1} style={{ minWidth: 150 }}>
          <Autocomplete
            size="small"
            options={this.state.operatingRooms}
            loading={this.state.isORLoading}
            clearOnEscape
            getOptionLabel={option => option.label ? option.label : ''}
            value={this.state.selectedOperatingRoom}
            onChange={(e, value) => this.handleORChange(e, value)}
            groupBy={option => option.departmentTitle}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="operatingRoom"
                placeholder="All ORs"
                className={this.state.selectedOperatingRoom && this.formatClass(this.state.selectedOperatingRoom.label)}
              />
            )}
          />
        </Grid>}
        {this.state.showDays && <Grid item xs={1} style={{ minWidth: 150 }}>
          <FormControl variant="outlined" size="small" style={{ width: '100%' }}>
            <Select
              displayEmpty
              value={this.state.selectedWeekday}
              onChange={(e, v) => this.handleSelectedWeekdayChange(e, v)}
              style={{ backgroundColor: 'white' }}
            >
              <MenuItem key={-1} value="">
                <div className="all-days">All Days</div>
              </MenuItem>
              {moment.weekdays(true).map((weekday) => (
                <MenuItem key={weekday} value={weekday}>
                  {weekday}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}

        {this.state.showSpecialty && <Grid item xs={3} style={{ maxWidth: this.props.isSpecialtyMandatory ? 218 : 200 }}>
          <Autocomplete
            size="small"
            options={this.state.specialties}
            clearOnEscape
            getOptionLabel={option => option.name ? option.name : ''}
            value={this.state.selectedSpecialty}
            onChange={(e, value) => this.handleSelectedSpecialtyChange(e, value)}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="specialty"
                placeholder={this.state.specialtyDisplay}
                className={this.state.selectedSpecialty && this.formatClass(this.state.selectedSpecialty.name) || this.props.isSpecialtyMandatory && "select-a-specialty"}
              />
            )}
          />
        </Grid>}
        {this.state.showProcedure && <Grid item xs={3} style={{ maxWidth: 210 }}>
          <Autocomplete
            size="small"
            options={this.state.procedureOptions}
            clearOnEscape
            getOptionLabel={option => option.name ? option.name : ''}
            value={this.state.selectedProcedure}
            onChange={(e, value) => this.handleSelectedProcedureChange(e, value)}
            noOptionsText="Please select a specialty"
            disabled={this.props.isSpecialtyMandatory && !specialtySelected}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="procedure"
                placeholder="All Procedures"
                className={this.state.selectedProcedure && this.formatClass(this.state.selectedProcedure.name)}
              />
            )}
          />
        </Grid>}
        {this.state.showOR2 && <Grid item xs={1} style={{ minWidth: 150 }}>
          <Autocomplete
            size="small"
            options={this.state.operatingRooms}
            loading={this.state.isORLoading}
            clearOnEscape
            getOptionLabel={option => option.label ? option.label : ''}
            value={this.state.selectedOperatingRoom}
            onChange={(e, value) => this.handleORChange(e, value)}
            groupBy={option => option.departmentTitle}
            disabled={this.props.isSpecialtyMandatory && !specialtySelected}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="operatingRoom"
                placeholder="All ORs"
                className={this.state.selectedOperatingRoom && this.formatClass(this.state.selectedOperatingRoom.label)}
              />
            )}
          />
        </Grid>}
        <Grid item xs={2} style={{ maxWidth: 100 }}>
          <Button disabled={disabled} variant="outlined" className="primary" onClick={(e) => this.props.apply()} style={{ height: 40, width: 96 }}>Apply</Button>
        </Grid>
        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', marginLeft: 16, maxWidth: 100 }}>
          <a className="link" onClick={e => this.resetFilters()}>Clear Filters</a>
        </Grid>

      </Grid>
    );
  }
}

export default UniversalPicker;