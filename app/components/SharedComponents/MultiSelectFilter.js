import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import withStyles from '@material-ui/core/styles/withStyles';
import { Checkbox, FormControl, FormHelperText, ListItemText, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import { Placeholder, StyledCheckbox, StyledSelect } from './SharedComponents';
import Icon from '@mdi/react';
import { mdiCheckboxBlankOutline, mdiCheckboxOutline } from '@mdi/js';

/*
  Multi-select Filter recieves a flat list of Strings/options
  OptionMap is used to translate IDs to display names
*/
const MultiSelectFilter = ({
  id, placeholder, onChange, options, optionMap, value, ...rest
}) => (
  <React.Fragment>
    <FormControl size='small' fullWidth>
      <FormLabel>{rest?.label}</FormLabel>
      <StyledSelect
        id={id}
        multiple
        onChange={onChange}
        input={<OutlinedInput />}
        value={value ?? []}
        //Render display value using "optionMap" OR show a placeholder
        renderValue={(selected) => selected?.length > 0
          ? selected?.map((val) => optionMap?.[val] ?? val)?.join(',')
          : <Placeholder value={placeholder} />}
        displayEmpty
        {...rest}
      >
        {options?.map((o) => (
          <MenuItem key={o} value={o}>
            <StyledCheckbox
              checked={value?.includes(o)} />

            <ListItemText primary={optionMap?.[o] ?? o} />
          </MenuItem>
        ))}
      </StyledSelect>
      <FormHelperText></FormHelperText>
    </FormControl>
  </React.Fragment>
);

export default MultiSelectFilter;
