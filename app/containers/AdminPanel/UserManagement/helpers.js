import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, SSC_PRODUCT_ID } from "../../../constants";
import globalFunctions from "../../../utils/global-functions";

const roleHeirarchy = ['admin', 'reader'];
const roleNameMap = { admin: 'Full Access', reader: 'View Only' };
export const rolesOrderBy = { [EFF_PRODUCT_ID]: 1, [SSC_PRODUCT_ID]: 2, [CD_PRODUCT_ID]: 3, [EMM_PRODUCT_ID]: 4 };
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

//Updating roles expects a certain structure - convert the /profiles obj to 
//the expected /roles object
export function generateProductUpdateBody(roles, assignableRoles = {}) {
    const productUpdates = [];

    for (var [productId, product] of Object.entries(assignableRoles)) {
        const { productRoles } = product;

        const roleUpdates = {}
        for (var [roleId, role] of Object.entries(productRoles)) {
            if (Object.keys(roles?.[roleId]?.scope || {}).length >= 1)
                roleUpdates[roleId] = roles?.[roleId]?.scope
        }
        productUpdates.push({ productId, roleUpdates })
    }
    return productUpdates;
}

export const createUser =  async (userData, callback, userToken, assignableRoles = {}) => {
    const { firstName, lastName, title, email } = userData;
    const userId = await createProfile({ firstName, lastName, title, email }, userToken)
    const { roles } = userData;
    const productUpdates = generateProductUpdateBody(roles, assignableRoles);
    const profile = await patchRoles({ userId, minAssignableScope: 2, productUpdates }, userToken);
    callback(userId);
}