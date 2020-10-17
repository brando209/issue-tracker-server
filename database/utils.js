const setUpdateString = (updateObject) => {
    // Create string for SET clause of update query
    let updates = "";
    for(let key of Object.keys(updateObject)) { updates += `${key} = '${updateObject[key]}', ` }
    updates = updates.substring(0, updates.length - 2); //remove last comma
    return updates;
}

module.exports = { setUpdateString: setUpdateString }