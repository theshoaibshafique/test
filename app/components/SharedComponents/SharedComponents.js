import React, { useEffect } from 'react';
import { Tab, Tabs, Tooltip, withStyles } from '@material-ui/core';

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
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      height: 5,
      '& > span': {
        width: '100%',
        backgroundColor: '#028CC8',
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
      paddingLeft: 16,
      paddingRight: 16,
      // marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
      },
    },
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