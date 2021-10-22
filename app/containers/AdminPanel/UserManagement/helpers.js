import globalFunctions from "../../../utils/global-functions";

const roleHeirarchy = ['admin', 'reader'];
const roleNameMap = { admin: 'Full Access', reader: 'View Only' };

//Given a users Roles and a list of all products 
// - create a mapping of their highest role per product
//EX. {'Case Discovery': 'Full Access', 'Efficiency': 'No Access', ...}
export function getRoleMapping(userRoles, productRolesList) {
    let result = {};
    for (var product of productRolesList) {
        if (userRoles?.hasOwnProperty(product.admin)) {
            result[product.name] = `Full Access`;
        } else if (userRoles?.hasOwnProperty(product.reader)) {
            result[product.name] = `View Only`;
        } else {
            result[product.name] = "No Access";
        }
    }
    return result;
}
//Given a single product return the highest selected product
//product is the InsightsProduct definition not assignable roles
export function getSelectedRoles(userRoles, product) {
    for (var role of roleHeirarchy) {
        if (userRoles?.hasOwnProperty(product[role])) {
            return { roleDisplay: roleNameMap[role], roleId: product[role] };
        }
    }
    return { roleDisplay: 'No Access', roleId: null };
}
export function isWithinScope(currentScope, minScope, maxScope) {
    return currentScope >= minScope && currentScope <= maxScope;
}
export function userHasLocation(userLocations, locationId) {
    return userLocations?.includes(locationId);
}

const helperFetch = async (url, fetchMethod, userToken, body, errorCallback) => {
    return await globalFunctions.axiosFetch(url, fetchMethod, userToken, body)
        .then(result => {
            if (result != 'error') return result?.data;
        }).catch((error) => {
            errorCallback?.(error);
            console.log("oh no", error)
        });
}

export const deleteUser = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'profile', 'DELETE', userToken, body);
}
export const createProfile = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'profile', 'POST', userToken, body);
}
export const patchRoles = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'roles', 'patch', userToken, body);
}