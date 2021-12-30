import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  radio: {
    '&$checked': {
      color: '#004F6E'
    }
  },
  checked: {}
});

const RadioButtonGroup = ({
  onChange, value, options, ...rest
}) => {
  const styles = useStyles();
  return (
    <FormControl component="fieldset">
      <RadioGroup value={value} onChange={onChange} {...rest} style={{ flexDirection: 'row' }}>
        {options.map((option) => (
          <FormControlLabel
            style={option.value === value ? {
              color: '#004F6E',
            } : {
              color: 'inherit',
            }}
            key={option.id}
            id={option.id}
            value={option.value}
            label={option.value}
            control={<Radio classes={{ root: styles.radio, checked: styles.checked }} />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioButtonGroup;
