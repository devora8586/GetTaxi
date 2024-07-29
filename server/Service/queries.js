function addQuery(table, values) {
    return `INSERT INTO ${table} VALUES(${values})`
}

function getAllQuery(table, column) {
    return `SELECT ${column} FROM ${table} WHERE isActive = 1`;
}

function getQuery(table, condition) {
    return `SELECT * FROM ${table} WHERE ${condition} AND isActive = 1`
}

function getIdQuery(table, condition) {
    return `SELECT id FROM ${table} WHERE ${condition}`
}

function getDriverQuery(condotion) {
    return `SELECT * FROM users u, drivers d WHERE u.id = d.userId AND u.isActive = 1 AND ${condotion}`
}

function deleteQuery(table) {
    return `UPDATE ${table} SET isActive = 0  WHERE id = ? `
}

function updateQuery(table, values, condition) {
    return `UPDATE ${table} SET ${values} WHERE ${condition}`
}

function updateDriverQuery(values, condition) {
    return `UPDATE users u , drivers d SET ${values} WHERE u.id= d.userId and ${condition}`
}

export {
    addQuery, getQuery, deleteQuery, getAllQuery, getDriverQuery, updateQuery, updateDriverQuery, getIdQuery
}
