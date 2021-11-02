import React from 'react';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';
import { UserManagement } from './UserManagement/UserManagement';
import { getRoleMapping } from './UserManagement/helpers';

const TABS = ['user management']
export default class AdminPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    }
  }


  handleChange(obj, tabIndex) {
    const { logger } = this.props;

    logger?.manualAddLog('click', 'swap-tab', TABS[tabIndex]);
    this.setState({ tabIndex });
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    const tabIndex = parseInt(params.index);
    if (tabIndex == params.index) {
      this.setState({ tabIndex: Math.min(Math.max(tabIndex, 0), 0) })
    }
    this.getUserManagementData();
    this.props.setCurrentProduct();
  }
  componentWillUnmount(){
    this.props.exitUserManagement();
  }
  componentDidUpdate() {
    const { logger } = this.props;
    setTimeout(() => {
      logger?.connectListeners();
    }, 300)
  }
  async getUserManagementData() {
    this.getProfiles();
    this.getAssignableRoles();
    this.getLocation();
  }

  async getProfiles() {
    return await globalFunctions.genericFetch(`${process.env.USER_V2_API}profiles`, 'get', this.props.userToken, {})
      .then(result => {
        const { productRoles } = this.props;
        this.props.setUsers(result?.map((u) => {
          const { roles, firstName, lastName } = u;

          return { ...u, displayRoles: getRoleMapping(roles, Object.values(productRoles)), name: `${firstName} ${lastName}` }
        }))
      }).catch((results) => {
        console.error("oh no", results)
      });
  }
  async getLocation() {
    return await globalFunctions.genericFetch(`${process.env.USER_V2_API}location?facility_id=${this.props.facilityName}`, 'get', this.props.userToken, {})
      .then(result => {
        this.props.setLocations(result);
      }).catch((results) => {
        console.error("oh no", results)
      });
  }
  async getAssignableRoles() {
    return await globalFunctions.genericFetch(`${process.env.USER_V2_API}assignable_roles`, 'get', this.props.userToken, {})
      .then(result => {
        this.props.setAssignableRoles(result);
      }).catch((results) => {
        console.error("oh no", results)
      });
  }


  render() {
    const { productRoles } = this.props;
    const { umRoles } = productRoles || {}
    const hasUM = umRoles?.isAdmin || umRoles?.hasAccess;
    const { tabIndex } = this.state;
    return (
      <div className="admin-panel">
        <div className="header">
          Admin Panel
        </div>
        <StyledTabs
          value={tabIndex}
          onChange={(obj, value) => this.handleChange(obj, value)}
          indicatorColor="primary"
          textColor="primary"
        >
          {hasUM && <StyledTab label="User Management" /> || <span />}
        </StyledTabs>
        {hasUM && <TabPanel value={tabIndex} index={0}>
          <UserManagement />
        </TabPanel>}

      </div>
    );
  }
}

