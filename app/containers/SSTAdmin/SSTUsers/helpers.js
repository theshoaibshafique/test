
//Given a users Roles and a list of all products 
// - group all roles under their respective productName
export const getRoleMapping = (roles, productRoles) => {
    const result = {}
    for (var product of productRoles) {
        for (const [roleId, role] of Object.entries(product.productRoles)) {
            //If the users roles list has the product Role - add it to the object
            //Make sure the scope object has something (not {})
            if (roles?.hasOwnProperty(roleId) && Object.values(roles[roleId].scope || {})?.length > 0) {
                result[product.productName] = { ...(result[product.productName] ?? {}), [roleId]: role.displayName }
            }
        }
        result[product.productName] = result[product.productName] ?? { 'No Access': 'No Access' }
    }
    return result;
}
