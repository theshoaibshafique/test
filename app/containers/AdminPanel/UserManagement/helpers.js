const roleHeirarchy = ['admin', 'reader'];
const roleNameMap = { admin: 'Full Access', reader: 'View Only' };

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
export function getSelectedRoles(userRoles, product) {
    for (var role of roleHeirarchy) {
        if (userRoles?.hasOwnProperty(product[role])) {
            return { roleDisplay: roleNameMap[role], roleId: product[role] };
        }
    }
    return { roleDisplay: 'No Access', roleId: null };
}

export function getLocationDisplay(userScope, minScope, maxScope, locations) {
    const result = [];
    if (!userScope) {
        return 'None'
    }
    for (const [hospitalId, hospital] of Object.entries(locations)) {
        appendLocation(1, minScope, maxScope, userScope?.h, hospitalId, hospital?.name, result);
        for (const [facilityId, facility] of Object.entries(hospital.facilities)) {
            appendLocation(2, minScope, maxScope, userScope?.f, facilityId, facility?.name, result);
            for (const [deptId, dept] of Object.entries(facility.departments)) {
                appendLocation(3, minScope, maxScope, userScope?.d, deptId, dept?.name, result);
                for (const [roomId, room] of Object.entries(dept?.rooms)) {
                    appendLocation(4, minScope, maxScope, userScope?.r, roomId, room?.name, result);
                }
            }
        }
    }
    return result.join(",");
}
//Helper functions to get location display
function appendLocation(currentScope, minScope, maxScope, userLocations, locationId, locationName, displayList) {
    //Only add the role if they're within the scope and the user is assigned the location
    if (isWithinScope(currentScope, minScope, maxScope) && userHasLocation(userLocations, locationId)) {
        displayList.push(locationName)
    }
}
function isWithinScope(currentScope, minScope, maxScope) {
    return currentScope >= minScope && currentScope <= maxScope;
}
function userHasLocation(userLocations, locationId) {
    return userLocations?.includes(locationId);
}