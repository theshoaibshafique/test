import React, { useEffect } from 'react';
import { makeStyles, Radio, Switch, Tab, Tabs, Tooltip, withStyles } from '@material-ui/core';

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    padding: '16px',
    fontSize: '14px',
    lineHeight: '19px',
    fontFamily: 'Noto Sans'
  }
}))(Tooltip);

export const StyledTabs = withStyles({
  root: {
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.2)",
    padding: "0 16px" 
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 5,
    '& > span': {
      width: '100%',
      backgroundColor: '#004f6e',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 14,
    fontFamily: 'Noto Sans',
    opacity: .8,
    fontWeight: 'bold',
    color: '#000 !important',
    minWidth: 'unset',
    // paddingLeft: 40,
    // paddingRight: 40,
    margin: "0 24px",
    padding: 0,
    // marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
  selected: {
    // margin: "0 40px"
  }
}))((props) => <Tab disableRipple {...props} />);

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const useStylesRadio = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#014F6E,#014F6E 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#FFFFFF',
    },
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    // backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
});

export function StyledRadio(props) {
  const classes = useStylesRadio();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.checkedIcon} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export const SSTSwitch = withStyles((theme) => ({
  switchBase: {
    color: '#ABABAB',
    '&$checked': {
      color: '#3DB3E3',
    },
    '&$checked + $track': {
      opacity: 1,
      backgroundColor: '#028CC8',
    },
  },
  checked: {},
  track: {
    opacity: 1,
    backgroundColor: '#575757'
  }
}))(Switch);