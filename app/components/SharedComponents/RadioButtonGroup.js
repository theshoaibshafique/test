import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  radio: {
    "& svg": {
      width: "16px",
      height: "16px"
    },
    '&$checked': {
      color: (props) => `${props.highlightColour}`
    }
  },
  checked: {
    color: (props) => `${props.highlightColour}`
  }
});
const commonStyle = {fontSize:12, fontFamily: 'Noto Sans'}
const RadioButtonGroup = ({
  onChange, value, options, highlightColour, ...rest
}) => {
  const styles = useStyles({ highlightColour });
  return (
    <FormControl component="fieldset"  {...rest}>
      <RadioGroup value={value} onChange={onChange} {...rest} style={{ flexDirection: 'row' }}>
        {options.map((option) => (
          <FormControlLabel
            
            style={option.value === value ? {
              color: highlightColour,
            } : {
              color: 'inherit',
            }}
            key={option.id}
            id={option.id}
            value={option.value}
            label={<span style={commonStyle}>{option.display ?? option.value}</span>}
            control={<Radio classes={{ root: styles.radio, checked: styles.checked }} />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export default RadioButtonGroup;
