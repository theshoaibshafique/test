import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
// import SearchIcon from '@material-ui/icons/Search';

const dropdownStyles = (theme, props) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
  },
  listbox: {
    maxWidth: 480,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
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
});

const AutocompleteInput = withStyles((theme) => (dropdownStyles(theme, { width: 400 })))(Autocomplete);

const MultiSelectFilter = ({
  id, placeholder, onChange, options, ...rest
}) => (
  <React.Fragment>
    <FormLabel>{rest?.label}</FormLabel>
    <AutocompleteInput
      multiple
      clearOnEscape
      getOptionLabel={(option) => (option.display ? option.display : '')}
      onChange={onChange}
      options={options}
      id={id}
      renderInput={(params) => (
        <TextField
          {...params}
          name="multi-select"
          error={false}
          variant="outlined"
          placeholder={placeholder}
        />
      )}
      renderOption={(option) => (<Typography noWrap>{option.display ? option.display : ''}</Typography>)}
      {...rest}
    />
  </React.Fragment>
);

export default MultiSelectFilter;
