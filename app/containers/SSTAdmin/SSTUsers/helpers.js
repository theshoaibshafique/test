
import globalFunctions from "../../../utils/global-functions";

//Given a users Roles and a list of all products 
// - group all roles under their respective productName
export const getRoleMapping = (roles, productRoles) => {
    const result = {}
    for (var product of productRoles) {
        for (const [roleId, role] of Object.entries(product.productRoles)) {
            if (roles?.hasOwnProperty(roleId)) {
                result[product.productName] = { ...(result[product.productName] ?? {}), [roleId]: roles[roleId]?.name }
            }
        }
        result[product.productName] = result[product.productName] ?? { 'No Access': 'No Access' }
    }
    return result;
}

export function isWithinScope(currentScope, minScope, maxScope) {
    return currentScope >= minScope && currentScope <= maxScope;
}

const helperFetch = async (url, fetchMethod, userToken, body, errorCallback) => {
    return await globalFunctions.genericFetch(url, fetchMethod, userToken, body)
        .then(result => {
            if (result?.conflict) {
                return result.conflict.then(message => {
                    errorCallback?.(message)
                })
            } else {
                return result;
            }
        }).catch((error) => {
            errorCallback?.(error);
            console.log("oh no", error)
        });
}

export const deleteUser = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'profile', 'DELETE', userToken, body);
}
export const createProfile = async (body, userToken, errorCallback) => {
    return await helperFetch(process.env.USER_V2_API + 'profile', 'POST', userToken, body, errorCallback);
}
export const patchRoles = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'roles', 'PATCH', userToken, body);
}
export const resetUser = async (body, userToken) => {
    return await helperFetch(process.env.USER_V2_API + 'reset_user', 'POST', userToken, body);
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

export const createUser = async (userData, callback, errorCallback, userToken, assignableRoles = {}) => {
    const { firstName, lastName, title, email } = userData;
    const userId = await createProfile({ firstName, lastName, title, email }, userToken, errorCallback)
    if (!userId) {
        return userId;
    }

    const { roles } = userData;
    const productUpdates = generateProductUpdateBody(roles, assignableRoles);
    const profile = await patchRoles({ userId, minAssignableScope: 2, productUpdates }, userToken);
    callback(userId);
}