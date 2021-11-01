
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
