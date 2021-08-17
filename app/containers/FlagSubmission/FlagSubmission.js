import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


const FlagSubmission = ({ title, questionType, options }) => {

  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      getOptionLabel={(option) => option.title}
      style={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
    />
  );
};

export default FlagSubmission;
