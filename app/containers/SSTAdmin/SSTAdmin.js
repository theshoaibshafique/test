import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import globalFunctions from '../../utils/global-functions';
import { makeSelectProductRoles, makeSelectToken, makeSelectUserFacility } from '../App/selectors';
import { exitUserManagement, setAssignableRoles, setLocationList, setUsers } from '../App/store/UserManagement/um-actions';
import './style.scss';
import { SSTUsers } from './SSTUsers/SSTUsers';

const minScope = 0;
export const SSTAdmin = props => {
  const dispatch = useDispatch();
  const productRoles = useSelector(makeSelectProductRoles())
  // console.log(productRoles);
  const userToken = useSelector(makeSelectToken());
  const facilityName = useSelector(makeSelectUserFacility());
  useEffect(() => {
    const fetchData = async () => {
      const users = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}profiles?min_scope=${minScope}`, 'get', userToken, {});
      const locations = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}location?facility_id=${facilityName}`, 'get', userToken, {});
      const assignableRoles = await globalFunctions.axiosFetch(`${process.env.USER_V2_API}assignable_roles?min_scope=${minScope}`, 'get', userToken, {})

      dispatch(setUsers(users?.map((u) => {
        const { firstName, lastName, roles } = u;
        return { ...u, sstDisplayRoles: getRoleMapping(roles, Object.values(assignableRoles)), name: `${firstName} ${lastName}` }
      })));
      dispatch(setLocationList(locations));
      dispatch(setAssignableRoles(assignableRoles))
    }
    fetchData();
    return () => {
      dispatch(exitUserManagement());
    }
  }, [])
  return (
    <div className="sst-admin-panel">
      <div className="title header" >SST Admin Panel</div>
      <SSTUsers />
    </div>
  )
}

const getRoleMapping = (roles, productRoles) => {
  const result = {}
  for (var product of productRoles) {
    for (const [roleId, role] of Object.entries(product.productRoles)) {
      if (roles?.hasOwnProperty(roleId)) {
        result[product.productName] = { ...(result[product.productName] ?? {}), [roleId]: roles[roleId]?.name }
      }
    }
    result[product.productName] = result[product.productName] ?? {'No Access': 'No Access'}
  }
  return result;
}