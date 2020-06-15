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
      specialties: this.props.specialties || []
    }
    this.state.specialties = [{ name: "All Specialties", value: "" }, ...this.state.specialties];
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultState != this.props.defaultState) {
      let selectedSpecialty = this.props.defaultState.selectedSpecialty;
      let procedureOptions = selectedSpecialty && selectedSpecialty.procedures || [];
      if (procedureOptions.length > 0) {
        procedureOptions = [{ name: "All Procedures", value: "" }, ...procedureOptions];
      }

      this.setState({ ...this.props.defaultState, specialties: [{ name: "All Specialties", value: "" }, ...this.props.specialties], procedureOptions });

    }
  }


  componentDidMount() {
    this.populateOperatingRooms();
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

  render() {
    return (
      <Grid container spacing={1} justify="center" className="universal-picker">
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><SearchIcon /></span>
        <Grid item xs={1} style={{ minWidth: 150 }}>
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
                placeholder="All OR"
              />
            )}
          />
        </Grid>
        <Grid item xs={1} style={{ minWidth: 150 }}>
          <FormControl variant="outlined" size="small" style={{ width: '100%' }}>
            <Select
              displayEmpty
              value={this.state.selectedWeekday}
              onChange={(e, v) => this.handleSelectedWeekdayChange(e, v)}
              style={{ backgroundColor: 'white' }}
            >
              <MenuItem key={-1} value="">
                <div style={{ opacity: .4 }}>All Days</div>
              </MenuItem>
              {moment.weekdays(true).map((weekday) => (
                <MenuItem key={weekday} value={weekday}>
                  {weekday}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3} style={{ maxWidth: 200 }}>
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
                placeholder="All Specialties"
              />
            )}
          />
        </Grid>
        <Grid item xs={3} style={{ maxWidth: 210 }}>
          <Autocomplete
            size="small"
            options={this.state.procedureOptions}
            clearOnEscape
            getOptionLabel={option => option.name ? option.name : ''}
            value={this.state.selectedProcedure}
            onChange={(e, value) => this.handleSelectedProcedureChange(e, value)}
            noOptionsText="Please select a specialty"
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="procedure"
                placeholder="All Procedures"
              />
            )}
          />
        </Grid>
        <Grid item xs={2} style={{ maxWidth: 100 }}>
          <Button variant="outlined" className="primary" onClick={(e) => this.props.apply()} style={{ height: 40, width: 96 }}>Apply</Button>
        </Grid>
        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', marginLeft: 16, maxWidth: 100 }}>
          <a className="link" onClick={e => this.resetFilters()}>Reset Filters</a>
        </Grid>

      </Grid>
    );
  }
}

export default UniversalPicker;