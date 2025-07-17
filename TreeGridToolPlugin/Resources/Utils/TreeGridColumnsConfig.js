let columnsStyleType = {
    0: "wb-helper-center",
    1: "wb-helper-disabled",
    2: "wb-helper-start",
    3: "wb-helper-end",
    4: "wb-helper-hidden",
    5: "wb-helper-invalid",
    6: "wb-helper-link"
};

function generateColumns(customColumns) {
    if (!customColumns.length) return [];

    const cellTypeMap = new Map();
    const cellIsEdit = new Map();
    const cols = [];
    customColumns.forEach((item) => {
        cols.push({
            title: item.Name,
            id: item.Id.toLowerCase() === "title" ? '*' : item.Id,
            width: item.Width == null ? "*" : `${item.Width}px`,
            classes: columnsStyleType[item.ColumnStyle]
        });
        cellTypeMap.set(item.Id, item.CellType);
        cellIsEdit.set(item.Id, item.Editable);
    })
    return {cols, cellTypeMap, cellIsEdit};
}

function setColumnCellType(type) {
    let innerHTML = '';
    switch (type) {
        case 0:
            innerHTML = '<input type="text" tabindex="-1">';
            break;
        case 1:
            innerHTML = '<input type="number" step="any" tabindex="-1">';
            break;
        case 2:
            innerHTML = '<input type="date" tabindex="-1">';
            break;
        case 3:
            innerHTML = '<input type="checkbox" tabindex="-1">';
            break;
        case 4:
            innerHTML = `<select tabindex="-1">
                                <option value="h">Happy</option>
                                <option value="s">Sad</option>
                             </select>`;
            break;
        case 5:
            innerHTML = '<input type="time" tabindex="-1">';
            break;
        default:
            innerHTML = '<input type="text" tabindex="-1">';
            break;
    }

    return innerHTML;
}