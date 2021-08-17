import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


const FlagSubmission = ({ title, questionType, options, onSelect }) => {
  const [value, setValue] = useState(options[0]);

  return (
    <Autocomplete
      id="combo-box-demo"
      value={value}
      onChange={(event, newValue) => {
        console.log('new Value', newValue)
        setValue(newValue)
      }}
      options={options}
      getOptionLabel={(option) => option.title}
      style={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={questionType === 'multiple-choice' ? 'Select 1 or more' : 'Select 1'} variant="outlined" />}
    />
  );
};

export default FlagSubmission;
