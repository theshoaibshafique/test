import React from 'react';
import { Grid, TextField, FormControl, MenuItem, Select, Button, withStyles, Typography, InputLabel, FormHelperText } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import moment from 'moment/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CustomDateRangePicker from "../../components/SharedComponents/CustomDateRangePicker";
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
    const defaultDate = 'All time';
    const defaultState = JSON.parse(localStorage.getItem('userFilter')) ?? {}
    this.state = {
      isORLoading: true,
      operatingRooms: [],
      selectedDate: defaultState?.dateLabel ?? defaultDate,
      selectedOperatingRoom: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      specialties: this.props.specialties || [],
      specialtyDisplay: this.props.isSpecialtyMandatory ? "Select a Specialty" : "All Specialties",
      defaultHours: Math.floor(defaultThreshold / 3600),
      defaultMinutes: Math.floor((defaultThreshold % 3600) / 60),
      defaultSeconds: Math.floor(defaultThreshold % 3600 % 60),
      configCookieObj: {configCookieKey: this.props.configCookieKey, userCustomConfigCookieKey: this.props.userCustomConfigCookieKey},
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
        specialties: [{ display: specialtyDisplay, id: null }, ...this.props.specialties],
        operatingRooms: [{ display: "All ORs", id: null }, ...this.props.ors],
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
    // this.populateOperatingRooms();
  }

  getDisplayOptions() {
    if (Boolean(this.props.showOR || this.props.showDays || this.props.showSpecialty || this.props.showOR2 || this.props.showDate)) {
      return {

        showOR: this.props.showOR,
        showDays: this.props.showDays,
        showSpecialty: this.props.showSpecialty,
        showGracePeriod: this.props.showGracePeriod,
        showOutlierThreshold: this.props.showOutlierThreshold,
        //Default to hiding
        showOR2: this.props.showOR2,
        showDate: this.props.showDate
      };
    }
    return {//Default to showing
      showOR: true,
      // showDays: true,
      showSpecialty: true,
      //Default to hiding
      showOR2: false,
      showDate:true
    };
  }

  handleORChange(e, value) {
    this.setState({
      selectedOperatingRoom: value,
      // departmentName: id && id.departmentName
    }, () => {
      this.props.updateState('selectedOperatingRoom', value);
    });
  };

  handleDateChange(value){
    this.setState({
      selectedDate: value,
    }, () => {
      this.props.updateState('selectedDate', value);
    });
  }

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
    const outlierThresholdHrs = this.state.defaultHours.toString().padStart(2, 0);
    const outlierThresholdMinute = this.state.defaultMinutes.toString().padStart(2, 0);
    this.setState({
      selectedOperatingRoom: "",
      selectedDate: "",
      selectedWeekday: "",
      selectedSpecialty: "",
      gracePeriodMinute,
      outlierThresholdHrs,
      outlierThresholdMinute
    }, () => {
      this.props.updateState('selectedOperatingRoom', "");
      this.props.updateState('selectedDate', "All time");
      this.props.updateState('selectedWeekday', "");
      this.props.updateState('selectedSpecialty', "");
      if (this.props.showGracePeriod){
        this.props.updateState('gracePeriodMinute', gracePeriodMinute);
      }
      if (this.props.showOutlierThreshold){
        this.props.updateState('outlierThresholdHrs', outlierThresholdHrs);
        this.props.updateState('outlierThresholdMinute', outlierThresholdMinute);
      }
      this.props.apply();
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
    let specialtySelected = this.state.selectedSpecialty?.value;
    let disabled = this.props.disabled || this.props.isSpecialtyMandatory && !specialtySelected;
    const defaultThreshold = globalFunctions.formatSecsToTime(this.props.defaultThreshold, true, true).trim() || "0 min";
    return (
      <Grid container spacing={1} justify="center" className="universal-picker">
        <span style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><SearchIcon /></span>
        {this.state.showDate && <Grid item xs={1} style={{ minWidth: 258 }}>
          <CustomDateRangePicker 
            dateLabel={this.state.selectedDate} 
            setDateLabel={(e, value) => this.handleDateChange(e, value)}
            {...this.state.configCookieObj}
          /> 
        </Grid>}
        {this.state.showOR && <Grid item xs={1} style={{ minWidth: 150 }}>
          <InputLabel shrink className="filter-label">
            OR
          </InputLabel>
          <Autocomplete
            size="small"
            options={this.state.operatingRooms}
            loading={this.state.isORLoading}
            clearOnEscape
            getOptionLabel={option => option.display ? option.display : ''}
            value={this.state.selectedOperatingRoom}
            onChange={(e, value) => this.handleORChange(e, value)}
            // groupBy={option => option.departmentTitle}
            id="or-input"
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="operatingRoom"
                placeholder="All ORs"
                className={this.state.selectedOperatingRoom && this.formatClass(this.state.selectedOperatingRoom.display)}
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
            id="specialty-input"
            clearOnEscape
            getOptionLabel={option => option.display ? option.display : ''}
            value={this.state.selectedSpecialty}
            onChange={(e, value) => this.handleSelectedSpecialtyChange(e, value)}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="specialty"
                placeholder={this.state.specialtyDisplay}
                className={this.state.selectedSpecialty && this.formatClass(this.state.selectedSpecialty.display) || this.props.isSpecialtyMandatory && "select-a-specialty"}
              />
            )}
            renderOption={(option) => (<Typography noWrap>{option.display ? option.display : ''}</Typography>)}
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
            id="or-input"
            getOptionLabel={option => option.display ? option.display : ''}
            value={this.state.selectedOperatingRoom}
            onChange={(e, value) => this.handleORChange(e, value)}
            // groupBy={option => option.departmentTitle}
            disabled={this.props.isSpecialtyMandatory && !specialtySelected}
            renderInput={params => (
              <TextField
                {...params}
                error={false}
                variant="outlined"
                name="operatingRoom"
                placeholder="All ORs"
                className={this.state.selectedOperatingRoom && this.formatClass(this.state.selectedOperatingRoom.display)}
              />
            )}
          />
        </Grid>}
        {this.state.showGracePeriod && <Grid item xs={2} style={{ maxWidth: 100 }}>
          <InputLabel shrink className="filter-label">
            Grace Period
          </InputLabel>
          <div>
            <FormControl variant="outlined" size="small" style={{ width: 90 }} >
              <Select
                id="grace-mins"
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
          </div>
          <FormHelperText style={{whiteSpace:'nowrap'}}>{`${this.props.hospitalAbbr || ""} Standard`}: {this.props.defaultThreshold >=0 ? defaultThreshold : "N/A"}</FormHelperText>
        </Grid>}
        {this.state.showOutlierThreshold && <Grid item xs={2} style={{ maxWidth: 180 }}>
          <InputLabel shrink className="filter-label">
            Outlier Threshold <span style={{ fontWeight: 'bold' }}>(hh:mm)</span>
          </InputLabel>
          <div>
            <FormControl variant="outlined" size="small" style={{ width: 85, paddingRight: 2 }} >
              <Select
                id="outlier-hrs"
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
                id="outlier-mins"
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
                {["00","30"].map((index) => (
                  <MenuItem key={index} value={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <FormHelperText>{`${this.props.hospitalAbbr || ""} Standard`}: { this.props.defaultThreshold >=0 ? defaultThreshold : "N/A"}</FormHelperText>
        </Grid>}
        <Grid item xs={2} className="buttons" >
          <Button id="apply" disabled={disabled} variant="outlined" className="primary normal-text" onClick={(e) => this.props.apply()} style={{ height: 40, width: 96 }}>Apply</Button>
          <Button id="clear" disableRipple className="clear subtle-subtext" onClick={() => this.resetFilters()}>Clear Filters</Button>
        </Grid>

      </Grid>
    );
  }
}

export default UniversalPicker;