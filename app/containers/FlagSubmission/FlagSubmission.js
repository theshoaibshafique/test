import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


const FlagSubmission = ({ title, questionType, options, onSelect }) => {
  const [value, setValue] = useState(null);

  // OnChange handler.
  const onOptionChange = (event, newValue) => {
    // Retrieve selected options index.
    const optionIndex = options.findIndex(opt => opt.id === newValue.id);
    setValue(newValue);
    // Load next flag question.
    onSelect(questionType, optionIndex);
  };

  return (
    <Autocomplete
      id="combo-box-demo"
      value={value}
      onChange={onOptionChange}
      options={options}
      getOptionLabel={(option) => option.title}
      style={{ width: '100%' }}
      renderInput={(params) => <TextField {...params} label={questionType === 'multiple-choice' ? 'Select 1 or more' : 'Select 1'} variant="outlined" />}
    />
  );
};

export default FlagSubmission;
