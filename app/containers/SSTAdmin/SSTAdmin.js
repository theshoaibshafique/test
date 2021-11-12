import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import globalFunctions from '../../utils/global-functions';
import { makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { exitUserManagement, setAssignableRoles, setLocationList, setUsers } from '../App/store/UserManagement/um-actions';
import './style.scss';
import { SSTUsers } from './SSTUsers/SSTUsers';
import { getRoleMapping } from './SSTUsers/helpers';
import { exitApiManagement, setApiAssignableRoles, setClients } from '../App/store/ApiManagement/am-actions';
import { StyledTab, StyledTabs, TabPanel } from '../../components/SharedComponents/SharedComponents';
import { SSTAPI } from './SSTAPI/SSTAPI';

const minScope = 0;
export const SSTAdmin = props => {
  const dispatch = useDispatch();
  const userToken = useSelector(makeSelectToken());
  const [tabIndex, setIndex] = useState(0)
  const handleChange = (obj, index) => {
    setIndex(index);
  }
  useEffect(() => {
    const fetchData = async () => {
      const users = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}profiles?scope=${minScope}`, 'get', userToken, {});
      const locations = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}location`, 'get', userToken, {});
      const assignableRoles = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}assignable_roles?scope=${minScope}`, 'get', userToken, {})

      dispatch(setUsers(users?.map((u) => {
        const { firstName, lastName, roles } = u;
        return { ...u, sstDisplayRoles: getRoleMapping(roles, Object.values(assignableRoles)), name: `${firstName} ${lastName}` }
      })));
      dispatch(setLocationList(locations));
      dispatch(setAssignableRoles(assignableRoles))

      const clients = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}clients?scope=${minScope}`, 'get', userToken, {});
      const apiAssignableRoles = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}assignable_roles?scope=${minScope}&is_client=true`, 'get', userToken, {})
      dispatch(setApiAssignableRoles(apiAssignableRoles));
      
      dispatch(setClients(clients?.map((u) => {
        const { roles } = u;
        return { ...u, sstDisplayRoles: getRoleMapping(roles, Object.values(assignableRoles)) }
      })));
    }
    fetchData();
    return () => {
      dispatch(exitUserManagement());
      dispatch(exitApiManagement());
    }
  }, [])
  return (
    <div className="sst-admin-panel">
      <div className="title header" >SST Admin Panel</div>
      <StyledTabs
        value={tabIndex}
        onChange={(obj, value) => handleChange(obj, value)}
        indicatorColor="primary"
        textColor="primary"
      >
        <StyledTab label="User Management" />
        <StyledTab label="API Management" />
      </StyledTabs>
      <TabPanel value={tabIndex} index={0}>
        <SSTUsers />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <SSTAPI />
      </TabPanel>

    </div>
  )
}

