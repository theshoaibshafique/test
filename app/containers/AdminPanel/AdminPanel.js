import React from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
import LoadingOverlay from 'react-loading-overlay';
import globalFuncs from '../../utils/global-functions';
import UserManagement from 'containers/UserManagement/Loadable';
import './style.scss';
import { Tab, Tabs, withStyles } from '@material-ui/core';
const StyledTabs = withStyles({
  root:{
    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.2)",
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height:5,
    '& > span': {
      width: '100%',
      backgroundColor: '#028CC8',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontSize: 14,
    fontFamily: 'Noto Sans',
    opacity:.8,
    fontWeight:'bold',
    color:'#000 !important',
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
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

export default class AdminPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    }
  }
  handleChange(obj,tabIndex){
    this.setState({tabIndex});
  }

  render() {

    return (
      <div className="admin-panel">
        <div className="header">
          Admin Panel
        </div>
        <StyledTabs
          value={this.state.tabIndex}
          onChange={(obj,value) => this.handleChange(obj,value)}
          indicatorColor="primary"
          textColor="primary"
        >
          <StyledTab label="User Management" />
          <StyledTab label="Efficiency Report" />
        </StyledTabs>
        <TabPanel value={this.state.tabIndex} index={0}>
          <UserManagement/>
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          <h1>Insert Settings Here</h1>
        </TabPanel>

      </div>
    );
  }
}