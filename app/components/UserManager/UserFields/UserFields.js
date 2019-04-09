import React from 'react';
import './style.scss';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import countryList from 'react-select-country-list'

class UserFields extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.options = countryList().getData()
  }

  render() {
    let countryOptions = this.options.map((country) => {
      return <MenuItem key={country.value} value={country.value}>{country.label}</MenuItem>
    })

    return (
      <form className="User-Info-Form" noValidate autoComplete="off">
          <TextField
            required
            disabled={!this.props.enableField}
            id="firstName"
            name="firstName"
            label="First Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.firstName}
            onChange={this.props.handleFormChange}
          />
          <TextField
            required
            disabled={!this.props.enableField}
            id="lastName"
            name="lastName"
            label="Last Name"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.lastName}
            onChange={this.props.handleFormChange}
          />
          <TextField
            required
            disabled={!this.props.enableField}
            id="email"
            name="email"
            label="E-Mail"
            margin="normal"
            className="User-Input"
            value={this.props.userValue.email}
            onChange={this.props.handleFormChange}
          />
          <FormControl className="User-Input" margin="normal">
            <InputLabel htmlFor="location">Location</InputLabel>
            <Select
              id="location"
              name="location"
              disabled={!this.props.enableField}
              value={this.props.userValue.location}
              onChange={this.props.handleFormChange}
              inputProps={{
                name: 'location',
                id: 'location',
              }}
            >
              <MenuItem value="Site 1">Site 1</MenuItem>
              <MenuItem value="Site 2">Site 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="User-Input" margin="normal">
            <InputLabel htmlFor="location">Country</InputLabel>
            <Select
              id="country"
              name="country"
              disabled={!this.props.enableField}
              value={this.props.userValue.country}
              onChange={this.props.handleFormChange}
              inputProps={{
                name: 'country',
                id: 'country',
              }}
            >
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Netherlands">Netherlands</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="User-Input" margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="active"
                  name="active"
                  disabled={!this.props.enableField}
                  onChange={this.props.handleFormChange}
                  checked={this.props.userValue.active}
                  value="active"
                />
              }
              label="Active"
            />
          </FormControl>
          <FormControl className="User-Input" margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  className="SST-Checkbox"
                  id="email"
                  name="email"
                  disabled={!this.props.enableField}
                  onChange={this.props.handleFormChange}
                  checked={this.props.userValue.email}
                  value="email"
                />
              }
              label="Send Email"
            />
          </FormControl>
      </form>
    );
  }
}

export default UserFields;
