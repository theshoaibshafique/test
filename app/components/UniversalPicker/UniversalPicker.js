import React from 'react';
import { Grid, TextField, FormControl, MenuItem, Select, Button, withStyles, Typography, InputLabel, FormHelperText } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import moment from 'moment/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
const dropdownStyles = (theme, props) => {
  return {
    listbox: {
      maxWidth: 480,
      margin: 0,
      padding: 0,
      zIndex: 1,
      position: 'absolute',
      listStyle: 'none',
      backgroundColor: theme.palette.background.paper,
      borderRadius: 4,
      boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      '& li[data-focus="true"]': {
        backgroundColor: '#4a8df6',
        color: 'white',
        cursor: 'pointer',
      },
      '& li[data-focus="true"] p': {
        overflow: 'unset !important',
        whiteSpace: 'unset',
        textOverflow: 'unset'
      },
      '& li:active': {
        backgroundColor: '#2977f5',
        color: 'white',
      },
      ...props
    }
  }
};
const SpecialtyAutocomplete = withStyles((theme) => (dropdownStyles(theme, { width: 400 })))(Autocomplete);

class UniversalPicker extends React.Component {
  constructor(props) {
    super(props);
    const defaultThreshold = this.props.defaultThreshold || 0;
    this.state = {
      isORLoading: true,
      operatingRooms: [],
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      specialties: this.props.specialties || [],
      specialtyDisplay: this.props.isSpecialtyMandatory ? "Select a Specialty" : "All Specialties",
      defaultHours: Math.floor(defaultThreshold / 3600),
      defaultMinutes: Math.floor((defaultThreshold % 3600) / 60),
      defaultSeconds: Math.floor(defaultThreshold % 3600 % 60),
      ...this.getDisplayOptions()
    }
    this.state.specialties.sort((a, b) => ("" + a.name).localeCompare("" + b.name))
    this.state.specialties = [{ name: this.state.specialtyDisplay, value: "" }, ...this.state.specialties];

  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultState != this.props.defaultState) {
      let selectedSpecialty = this.props.defaultState.selectedSpecialty;
      let specialtyDisplay = this.props.isSpecialtyMandatory ? "Select a Specialty" : "All Specialties";
      this.props.specialties.sort((a, b) => ("" + a.name).localeCompare("" + b.name))
      this.setState({
        ...this.props.defaultState,
        specialtyDisplay,
        specialties: [{ name: specialtyDisplay, value: "" }, ...this.props.specialties],
        ...this.getDisplayOptions()
      });
    }

    if (prevProps.defaultThreshold != this.props.defaultThreshold ) {
      const defaultThreshold = this.props.defaultThreshold;
      const defaultHours = Math.floor(defaultThreshold / 3600);
      const defaultMinutes = Math.floor((defaultThreshold % 3600) / 60);
      const defaultSeconds = Math.floor(defaultThreshold % 3600 % 60);

      this.setState({ defaultThreshold, defaultHours, defaultMinutes, defaultSeconds })
    }
  }

  componentDidMount() {
    this.populateOperatingRooms();
  }

  getDisplayOptions() {
    if (Boolean(this.props.showOR || this.props.showDays || this.props.showSpecialty || this.props.showOR2)) {
      return {

        showOR: this.props.showOR,
        showDays: this.props.showDays,
        showSpecialty: this.props.showSpecialty,
        showGracePeriod: this.props.showGracePeriod,
        showOutlierThreshold: this.props.showOutlierThreshold,
        //Default to hiding
        showOR2: this.props.showOR2
      };
    }
    return {//Default to showing
      showOR: true,
      showDays: true,
      showSpecialty: true,
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
    this.setState({
      selectedSpecialty,
    }, () => {
      this.props.updateState('selectedSpecialty', selectedSpecialty);
    });
  }

  resetFilters() {
    const gracePeriodMinute = this.state.defaultMinutes.toString().padStart(2, 0);
    const gracePeriodSec = this.state.defaultSeconds.toString().padStart(2, 0);
    const outlierThresholdHrs = this.state.defaultHours.toString().padStart(2, 0);
    const outlierThresholdMinute = this.state.defaultMinutes.toString().padStart(2, 0);
    this.setState({
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      gracePeriodMinute,
      gracePeriodSec,
      outlierThresholdHrs,
      outlierThresholdMinute
    }, () => {
      this.props.updateState('selectedOperatingRoom', "");
      this.props.updateState('selectedWeekday', "");
      this.props.updateState('selectedSpecialty', "");
      if (this.props.showGracePeriod){
        this.props.updateState('gracePeriodMinute', gracePeriodMinute);
        this.props.updateState('gracePeriodSec', gracePeriodSec);
      }
      if (this.props.showOutlierThreshold){
        this.props.updateState('outlierThresholdHrs', outlierThresholdHrs);
        this.props.updateState('outlierThresholdMinute', outlierThresholdMinute);
      }
    })
  }
  formatClass(str) {
    if (str) {
      return str.toLowerCase().replace(/\s/g, '-');
    }
  }

  updateState(key, e) {
    this.setState({ [key]: e.target.value }, () => {
      this.props.updateState(key, e.target.value);
    })
  }

  render() {
    let specialtySelected = this.state.selectedSpecialty && this.state.selectedSpecialty.value;
    let disabled = this.props.disabled || this.props.isSpecialtyMandatory && !specialtySelected;

    return (
      <Grid container spacing={1} justify="center" className="universal-picker">
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><SearchIcon /></span>
        {this.state.showOR && <Grid item xs={1} style={{ minWidth: 150 }}>
          <InputLabel shrink className="filter-label">
            OR
          </InputLabel>
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
          <InputLabel shrink className="filter-label">
            Days
          </InputLabel>
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
          <InputLabel shrink className="filter-label">
            Specialties
          </InputLabel>
          <SpecialtyAutocomplete
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
            renderOption={(option) => (<Typography noWrap>{option.name ? option.name : ''}</Typography>)}
          />
        </Grid>}
        {this.state.showOR2 && <Grid item xs={1} style={{ minWidth: 150 }}>
          <InputLabel shrink className="filter-label">
            OR
          </InputLabel>
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
        {this.state.showGracePeriod && <Grid item xs={2} style={{ maxWidth: 180 }}>
          <InputLabel shrink className="filter-label">
            Grace Period <span style={{ fontWeight: 'bold' }}>(mm:ss)</span>
          </InputLabel>
          <div>
            <FormControl variant="outlined" size="small" style={{ width: 85, paddingRight: 2 }} >
              <Select
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                value={this.state.gracePeriodMinute || "00"}
                onChange={(e, v) => this.updateState("gracePeriodMinute", e)}
              >
                {globalFunctions.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" style={{ width: 85, paddingLeft: 2 }} >
              <Select
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                value={this.state.gracePeriodSec || "00"}
                onChange={(e, v) => this.updateState("gracePeriodSec", e)}
              >
                {globalFunctions.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormHelperText>{`${this.props.hospitalAbbr || ""} Standard`}: {globalFunctions.formatSecsToTime(this.props.defaultThreshold, true, true).trim() || "N/A"}</FormHelperText>
        </Grid>}
        {this.state.showOutlierThreshold && <Grid item xs={2} style={{ maxWidth: 180 }}>
          <InputLabel shrink className="filter-label">
            Outlier Threshold <span style={{ fontWeight: 'bold' }}>(hh:mm)</span>
          </InputLabel>
          <div>
            <FormControl variant="outlined" size="small" style={{ width: 85, paddingRight: 2 }} >
              <Select
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                value={this.state.outlierThresholdHrs || "00"}
                onChange={(e, v) => this.updateState("outlierThresholdHrs", e)}
              >
                {globalFunctions.generatePaddedDigits(0, 12, 2, 0).map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" style={{ width: 85, paddingLeft: 2 }} >
              <Select
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                value={this.state.outlierThresholdMinute || "00"}
                onChange={(e, v) => this.updateState("outlierThresholdMinute", e)}
              >
                {globalFunctions.generatePaddedDigits(0, 60, 2, 0).map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormHelperText>{`${this.props.hospitalAbbr || ""} Standard`}: {globalFunctions.formatSecsToTime(this.props.defaultThreshold, true, true).trim() || "N/A"}</FormHelperText>
        </Grid>}
        <Grid item xs={2} className="buttons" >
          <Button disabled={disabled} variant="outlined" className="primary" onClick={(e) => this.props.apply()} style={{ height: 40, width: 96 }}>Apply</Button>
          <Button disableRipple className="clear" onClick={() => this.resetFilters()}>Clear Filters</Button>
        </Grid>

      </Grid>
    );
  }
}

export default UniversalPicker;