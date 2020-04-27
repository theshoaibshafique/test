import React from 'react';
import { Grid, TextField, FormControl, MenuItem, Select } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import moment from 'moment/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SPECIALTY } from '../../constants';



class UniversalPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isORLoading:true,
      operatingRooms: [],
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty:"",
      procedureOptions: [],
      selectedProcedure: ""
    }

  }
  componentDidMount(){
    this.populateOperatingRooms();
  }

  async populateOperatingRooms(e, callback) {
    return await globalFunctions.genericFetch(process.env.FACILITYDEPARTMENT_API + "/" + this.props.userFacility, 'get', this.props.userToken, {})
      .then(result => {
        let operatingRooms = [];
        if (result === 'error' || result === 'conflict') {

        } else if (result && result.length > 0) {
          result.map((department) => {
            department.rooms.map((room) => { operatingRooms.push({ departmentTitle:department.departmentTitle,value: room.roomName, label: room.roomTitle, departmentName: department.departmentName }) });
          });

        }
        this.setState({ operatingRooms,isORLoading:false });
        return operatingRooms
      });

  }

  handleORChange(e,value) {
    this.setState({
      selectedOperatingRoom: value,
      departmentName: value && value.departmentName
    }, () => {

    });
  };

  updateMonth(month) {
    month = moment(month)
    this.setState({
      month: month,
    }, () => {
      this.props.updateMonth(month);
    });
  }

  handleSelectedWeekdayChange(e) {
    this.setState({ selectedWeekday: e.target.value });
  }

  handleSelectedSpecialtyChange(e,selectedSpecialty){
    this.setState({selectedSpecialty,
      procedureOptions:selectedSpecialty && selectedSpecialty.values || [],
      selectedProcedure:""});
  }
  handleSelectedProcedureChange(e,selectedProcedure){
    this.setState({selectedProcedure});
  }
  resetFilters(){
    this.setState({
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty:"",
      procedureOptions: [],
      selectedProcedure: ""
    })
  }

  render() {
    return (
      <Grid container spacing={1} justify="center" className="universal-picker">
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><SearchIcon /></span>
        <Grid item xs={2} style={{maxWidth:150}}>
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
        <Grid item xs={2} style={{maxWidth:150}}>
          <FormControl variant="outlined" size="small" style={{width:'100%'}}>
            <Select
              displayEmpty
              value={this.state.selectedWeekday}
              onChange={(e, v) => this.handleSelectedWeekdayChange(e, v)}
              style={{ backgroundColor: 'white'}}
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

        <Grid item xs={3} style={{maxWidth:200}}>
          <Autocomplete
            size="small"
            options={SPECIALTY}
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
        <Grid item xs={3} style={{maxWidth:200}}>
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

        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', marginLeft:8, maxWidth:100}}>
          <a className="link" onClick={ e => this.resetFilters()}>Reset Filters</a>
        </Grid>

      </Grid>
    );
  }
}

export default UniversalPicker;