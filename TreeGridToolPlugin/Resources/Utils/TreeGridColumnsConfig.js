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
    if (!customColumns || !customColumns.length) return {cols: [], cellTypeMap: new Map(), cellIsEdit: new Map()};

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
    let element;
    switch (type) {
        case 0:
            element = document.createElement('input');
            element.type = 'text';
            element.tabIndex = -1;
            break;
        case 1:
            element = document.createElement('input');
            element.type = 'number';
            element.step = 'any';
            element.tabIndex = -1;
            break;
        case 2:
            element = document.createElement('input');
            element.type = 'date';
            element.tabIndex = -1;
            break;
        case 3:
            element = document.createElement('input');
            element.type = 'checkbox';
            element.tabIndex = -1;
            break;
        case 4:
            element = document.createElement('select');
            element.tabIndex = -1;
            const option1 = document.createElement('option');
            option1.value = 'h';
            option1.textContent = 'Happy';
            const option2 = document.createElement('option');
            option2.value = 's';
            option2.textContent = 'Sad';
            element.appendChild(option1);
            element.appendChild(option2);
            break;
        case 5:
            element = document.createElement('input');
            element.type = 'time';
            element.tabIndex = -1;
            break;
        default:
            element = document.createElement('input');
            element.type = 'text';
            element.tabIndex = -1;
            break;
    }
    return element;
}