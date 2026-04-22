let columnsStyleType = {
    0: "wb-helper-center",
    1: "wb-helper-disabled",
    2: "wb-helper-start",
    3: "wb-helper-end",
    4: "wb-helper-hidden",
    5: "wb-helper-invalid",
    6: "wb-helper-link"
};

function getColumnFieldName(item) {
    return item?.Id || item?.Name || "";
}

function getColumnHeaderText(item) {
    return item?.HeaderText || item?.Name || getColumnFieldName(item);
}

function generateColumns(customColumns, titleFieldName = "Title") {
    if (!customColumns || !customColumns.length) {
        return {
            cols: [],
            cellTypeMap: new Map(),
            cellIsEdit: new Map(),
            columnFieldMap: new Map(),
            titleFieldName: "Title"
        };
    }

    const cellTypeMap = new Map();
    const cellIsEdit = new Map();
    const columnFieldMap = new Map();
    const cols = [];
    let configuredTitleFieldName = titleFieldName || "Title";

    customColumns.forEach((item) => {
        const fieldName = getColumnFieldName(item);
        if (!fieldName) {
            return;
        }

        const isTitleColumn = fieldName.toLowerCase() === configuredTitleFieldName.toLowerCase();
        const columnId = isTitleColumn ? "*" : fieldName;
        cols.push({
            title: getColumnHeaderText(item),
            id: columnId,
            width: item.Width == null ? "*" : `${item.Width}px`,
            classes: columnsStyleType[item.ColumnStyle]
        });
        cellTypeMap.set(columnId, item.CellType);
        cellIsEdit.set(columnId, item.Editable);
        columnFieldMap.set(columnId, fieldName);
        if (columnId === "*") {
            configuredTitleFieldName = fieldName;
        }
    });

    return {cols, cellTypeMap, cellIsEdit, columnFieldMap, titleFieldName: configuredTitleFieldName};
}

function setColumnCellType(type) {
    let element;
    switch (type) {
        case 0:
            element = document.createElement("input");
            element.type = "text";
            element.tabIndex = -1;
            break;
        case 1:
            element = document.createElement("input");
            element.type = "number";
            element.step = "any";
            element.tabIndex = -1;
            break;
        case 2:
            element = document.createElement("input");
            element.type = "date";
            element.tabIndex = -1;
            break;
        case 3:
            element = document.createElement("input");
            element.type = "checkbox";
            element.tabIndex = -1;
            break;
        case 4:
            element = document.createElement("select");
            element.tabIndex = -1;
            const option1 = document.createElement("option");
            option1.value = "h";
            option1.textContent = "Happy";
            const option2 = document.createElement("option");
            option2.value = "s";
            option2.textContent = "Sad";
            element.appendChild(option1);
            element.appendChild(option2);
            break;
        case 5:
            element = document.createElement("input");
            element.type = "time";
            element.tabIndex = -1;
            break;
        default:
            element = document.createElement("input");
            element.type = "text";
            element.tabIndex = -1;
            break;
    }
    return element;
}

function setColumnCellEditable(container, editable) {
    const element = container?.matches?.("input,select")
        ? container
        : container?.querySelector?.("input,select");
    if (!element) {
        return;
    }

    const isEditable = editable === true;
    element.disabled = !isEditable;
    element.readOnly = !isEditable;
    element.tabIndex = isEditable ? 0 : -1;
}
