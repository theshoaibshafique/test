import React from 'react';
import './style.scss';
import globalFunctions from '../../utils/global-functions';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';
import { UserManagement } from './UserManagement/UserManagement';
import { getRoleMapping, helperFetch } from './helpers';
import { APIManagement } from './APIManagement/APIManagement';

const TABS = ['user management', 'api management']
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
      this.setState({ tabIndex: Math.min(Math.max(tabIndex, 0), 1) })
    }
    this.getUserManagementData();
    this.getAPIManagementData();
    this.props.setCurrentProduct();
  }
  componentWillUnmount() {
    this.props.exitUserManagement();
    this.props.exitApiManagement();
  }
  componentDidUpdate() {
    const { logger } = this.props;
    setTimeout(() => {
      logger?.connectListeners();
    }, 300)
  }
  async getUserManagementData() {
    const assignableRoles = await helperFetch(`${process.env.USER_V2_API}assignable_roles`, 'get', this.props.userToken, {})
    this.props.setAssignableRoles(assignableRoles);

    const locations = await helperFetch(`${process.env.USER_V2_API}location?facility_id=${this.props.facilityName}`, 'get', this.props.userToken, {})
    this.props.setLocations(locations);

    const users = await helperFetch(`${process.env.USER_V2_API}profiles`, 'get', this.props.userToken, {});
    this.props.setUsers(this.processUsers(users));
  }

  async getAPIManagementData() {
    const assignableRoles = await helperFetch(`${process.env.USER_V2_API}assignable_roles?is_client=true`, 'get', this.props.userToken, {})
    this.props.setApiAssignableRoles(assignableRoles);

    const clients = await helperFetch(`${process.env.USER_V2_API}clients`, 'get', this.props.userToken, {});
    this.props.setClients(this.processClients(clients));

  }

  processUsers(users) {
    const { productRoles } = this.props;
    return users?.map((u) => {
      const { roles, firstName, lastName } = u;
      return { ...u, displayRoles: getRoleMapping(roles, Object.values(productRoles)), name: `${firstName} ${lastName}` }
    })
  }

  processClients(clients) {
    const { productRoles } = this.props;
    return clients?.map((u) => {
      const { roles } = u;
      return { ...u, displayRoles: getRoleMapping(roles, Object.values(productRoles)) }
    })
  }


  render() {
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
          <StyledTab label="User Management" />
          <StyledTab label="API Management" />
        </StyledTabs>
        <TabPanel value={tabIndex} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <APIManagement />
        </TabPanel>

      </div>
    );
  }
}

