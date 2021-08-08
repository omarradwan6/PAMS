
export const createUser = ({ name, id, department, description, sup1ID, sup2ID, networkID, sup1Name,
    sup2Name, departmentName, status, pmsStatus, year, HrGeneralStatus }) => {
    return {
        type: 'CREATE_USER',
        name: name,
        id: id,
        department: department,
        description: description,
        sup1ID: sup1ID,
        sup2ID: sup2ID,
        networkID: networkID,
        sup1Name: sup1Name,
        sup2Name: sup2Name,
        departmentName: departmentName,
        status: status,
        pmsStatus: pmsStatus,
        year: year,
        HrGeneralStatus: HrGeneralStatus
    }
}