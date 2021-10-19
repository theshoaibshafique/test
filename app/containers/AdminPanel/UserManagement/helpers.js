const roleHeirarchy = ['admin', 'reader'];
const roleNameMap = {admin: 'Full Access', reader: 'View Only'};

//Given a users Roles and a list of all products 
// - create a mapping of their highest role per product
//EX. {'Case Discovery': 'Full Access', 'Efficiency': 'No Access', ...}
export function getRoleMapping(userRoles, productRolesList) {
    let result = {};
    for (var product of productRolesList) {
        if (userRoles.hasOwnProperty(product.admin)) {
            result[product.name] = `Full Access`;
        } else if (userRoles.hasOwnProperty(product.reader)) {
            result[product.name] = `View Only`;
        } else {
            result[product.name] = "No Access";
        }
    }
    return result;
}
//Given a single product return the highest selected product
export function getSelectedRoles(userRoles, product, isDisplay){
    for (var role of roleHeirarchy){
        if (userRoles?.hasOwnProperty(product[role])){
            return isDisplay ? roleNameMap[role] : product[role];
        }
    }
    return isDisplay ? 'No Access' : null;
}