class TreeGridOptionsConfig {
    static ROOT_PID_KEY = "__root__";

    _treeDom;
    _treeData = [];
    _columnsConfig;
    _cellTypeMap;
    _cellIsEditMap;
    _columnFieldMap;
    _columnsProperties;
    _typesProperties;
    _types = {};
    _relations = new Map();
    _updateData = new Map();
    _ForguncyTree = null;
    _checkbox = false;
    _dragAndDrop = false;
    _dndOptionsType = {};
    _selectMode = "multi";
    _connectTopBreadcrumb = false;
    _levelMap = new Map();
    _bindingDataSourceModel = null;
    _treeGridToolPluginCellType = null;
    _currentLevelRowBackgroundColorMap = new Map();
    _flatRows = [];
    _rowById = new Map();
    _originalRowById = new Map();
    _childrenByPid = new Map();
    _titleFieldName = "Title";

    cellType = {
        0: "text",
        1: "number",
        2: "date",
        3: "checkbox",
        4: "select",
        5: "link",
    }

    SELECT_MODE = {
        0: "multi",
        1: "hier"
    }

    constructor(treeGridOptionsFirstNeededParams) {
        this._treeGridToolPluginCellType = treeGridOptionsFirstNeededParams.TreeGridToolPluginCellType;
        this._typesProperties = treeGridOptionsFirstNeededParams.typesProperties;
        this._columnsConfig = treeGridOptionsFirstNeededParams.columnsConfigObj.cols;
        this._cellTypeMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellTypeMap;
        this._cellIsEditMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellIsEdit;
        this._columnFieldMap = treeGridOptionsFirstNeededParams.columnsConfigObj.columnFieldMap;
        this._titleFieldName = treeGridOptionsFirstNeededParams.columnsConfigObj.titleFieldName || "Title";
        this._columnsProperties = treeGridOptionsFirstNeededParams.columnsProperties;
        this._checkbox = treeGridOptionsFirstNeededParams.checkbox;
        this._dragAndDrop = treeGridOptionsFirstNeededParams.dragAndDrop;
        this._selectMode = this.SELECT_MODE[treeGridOptionsFirstNeededParams.selectMode];
        this._connectTopBreadcrumb = treeGridOptionsFirstNeededParams.connectTopBreadcrumb === false ? null : "output#parentPath";
        if (this._typesProperties && this._typesProperties.length) {
            for (let item of this._typesProperties) {
                this._currentLevelRowBackgroundColorMap.set(item.Level, item.CurrentLevelRowBackgroundColor === undefined ? null : item.CurrentLevelRowBackgroundColor);
                this._types[item.Level] = {
                    icon: item.Name,
                    colspan: item.IsColspan === undefined ? false : item.IsColspan,
                };
                this._levelMap.set(item.Level, {
                    icon: item.Name,
                    colspan: item.IsColspan === undefined ? false : item.IsColspan,
                    asyncLoadData: item.IsAsyncLoadData === undefined ? false : item.IsAsyncLoadData
                });
            }
        }
        if (this._columnsProperties && this._columnsProperties.length) {
            for (let item of this._columnsProperties) {
                this._relations.set(item.Id, {cellType: item.CellType, jsonPropertyName: item.Id});
            }
        }

        if (this._dragAndDrop) {
            this._dndOptionsType = {
                dragStart: (e) => {
                    if (e.node.type === "folder") {
                        return false;
                    }
                    e.event.dataTransfer.effectAllowed = "all";
                    return true;
                },
                dragEnter: (e) => {
                    if (e.node.type === "folder") {
                        e.event.dataTransfer.dropEffect = "copy";
                        return "over";
                    }
                    return ["before", "after"];
                },
                drop: (e) => {
                    e.sourceNode.moveTo(e.node, e.suggestedDropMode);
                },
            }
        }
    }

    set treeDom(value) {
        this._treeDom = value;
    }

    set treeData(treeData) {
        this._treeData = Array.isArray(treeData) ? treeData : [];
    }

    get checkbox() {
        return this._checkbox;
    }

    get treeData() {
        return this._treeData;
    }

    get levelMap() {
        return this._levelMap;
    }

    get relations() {
        return this._relations;
    }

    set updateData(value) {
        this._updateData = value;
    }

    get updateData() {
        return this._updateData;
    }

    set ForguncyTree(value) {
        this._ForguncyTree = value;
    }

    get ForguncyTree() {
        return this._ForguncyTree;
    }

    set bindingDataSourceModel(value) {
        this._bindingDataSourceModel = value;
    }

    get bindingDataSourceModel() {
        return this._bindingDataSourceModel;
    }

    async initializeTreeData() {
        const flatRows = await this.getBindingDataWithOptions();
        return this.prepareTreeData(flatRows);
    }

    async refreshTreeData() {
        const treeData = await this.initializeTreeData();
        this.reloadTreeData(treeData);
        return treeData;
    }

    prepareTreeData(flatRows) {
        this.rebuildFlatRowCache(flatRows);
        this._treeData = this.buildTreeFromFlatRows();
        return this._treeData;
    }

    rebuildFlatRowCache(flatRows) {
        const sourceRows = Array.isArray(flatRows) ? flatRows.filter(item => item && item.ID !== undefined && item.ID !== null) : [];
        this._flatRows = sourceRows.map(item => this.clonePlainValue(item));
        this._updateData.clear();
        this._rowById.clear();
        this._originalRowById.clear();
        this._childrenByPid.clear();

        for (const row of this._flatRows) {
            const rowKey = this.getRowKey(row.ID);
            this._rowById.set(rowKey, row);
            this._originalRowById.set(rowKey, this.clonePlainValue(row));
        }

        for (const row of this._flatRows) {
            const pidKey = this.getBucketKey(row.PID);
            if (!this._childrenByPid.has(pidKey)) {
                this._childrenByPid.set(pidKey, []);
            }
            this._childrenByPid.get(pidKey).push(row);
        }
    }

    getRowKey(value) {
        if (value === null || value === undefined || value === "") {
            return null;
        }
        return String(value);
    }

    getBucketKey(value) {
        return this.getRowKey(value) ?? TreeGridOptionsConfig.ROOT_PID_KEY;
    }

    isRootRow(row) {
        const pidKey = this.getRowKey(row.PID);
        return pidKey === null || !this._rowById.has(pidKey);
    }

    getChildRows(parentId) {
        return this._childrenByPid.get(this.getBucketKey(parentId)) || [];
    }

    getColumnFieldName(colId) {
        if (colId === "*") {
            return this._titleFieldName;
        }
        return this._columnFieldMap?.get(colId) || colId;
    }

    getRowValueByColumnId(rowData, colId) {
        if (!rowData) {
            return undefined;
        }
        const fieldName = this.getColumnFieldName(colId);
        if (colId === "*") {
            return rowData[fieldName] ?? rowData.title;
        }
        return rowData[fieldName];
    }

    isAsyncLevel(type) {
        return this._levelMap.get(type)?.asyncLoadData || false;
    }

    hasChildRows(rowId) {
        return this.getChildRows(rowId).length > 0;
    }

    createNodeData(row) {
        const mappedFields = this.getSpecifiedFields(row, this._relations);
        const nodeData = {
            key: String(row.ID),
            ID: row.ID,
            PID: row.PID,
            type: row.Type,
            selected: false,
            ...mappedFields
        };

        if (nodeData.title === undefined) {
            nodeData.title = row.Title ?? String(row.ID);
        }

        return nodeData;
    }

    setNodeValueByColumnId(node, colId, value) {
        const fieldName = this.getColumnFieldName(colId);
        if (colId === "*") {
            node.setTitle(value);
            node.data.title = value;
            node.data[fieldName] = value;
            return;
        }
        node.data[fieldName] = value;
    }

    syncRowCacheValue(rowId, colId, value) {
        const row = this._rowById.get(this.getRowKey(rowId));
        if (!row) {
            return;
        }
        const fieldName = this.getColumnFieldName(colId);
        row[fieldName] = value;
    }

    getOriginalValue(rowId, colId, fallbackValue) {
        const row = this._originalRowById.get(this.getRowKey(rowId));
        if (!row) {
            return fallbackValue;
        }
        return this.getRowValueByColumnId(row, colId);
    }

    buildTreeFromFlatRows() {
        const roots = this._flatRows.filter(row => this.isRootRow(row));
        return this.buildNodesFromRows(roots, new Set());
    }

    buildNodesFromRows(rows, path) {
        const result = [];
        for (const row of rows) {
            const node = this.buildNode(row, path);
            if (node) {
                result.push(node);
            }
        }
        return result;
    }

    buildNode(row, path = new Set()) {
        const rowKey = this.getRowKey(row.ID);
        if (rowKey === null) {
            return null;
        }

        const nextPath = new Set(path);
        nextPath.add(rowKey);

        const nodeData = this.createNodeData(row);
        const childRows = this.getChildRows(row.ID).filter(child => this.getRowKey(child.ID) !== rowKey);
        const shouldLazyLoad = this.isAsyncLevel(row.Type) && childRows.length > 0;

        if (shouldLazyLoad) {
            nodeData.lazy = true;
            return nodeData;
        }

        const childNodes = [];
        for (const childRow of childRows) {
            const childKey = this.getRowKey(childRow.ID);
            if (childKey !== null && nextPath.has(childKey)) {
                continue;
            }
            const childNode = this.buildNode(childRow, nextPath);
            if (childNode) {
                childNodes.push(childNode);
            }
        }

        if (childNodes.length > 0) {
            nodeData.children = childNodes;
        }

        return nodeData;
    }

    buildLazyChildren(parentId) {
        return this.buildNodesFromRows(this.getChildRows(parentId), new Set([String(parentId)]));
    }

    clonePlainValue(value) {
        if (Array.isArray(value)) {
            return value.map(item => this.clonePlainValue(item));
        }
        if (value && typeof value === "object") {
            const result = {};
            for (const [key, itemValue] of Object.entries(value)) {
                if (typeof itemValue !== "function") {
                    result[key] = this.clonePlainValue(itemValue);
                }
            }
            return result;
        }
        return value;
    }

    areValuesEqual(left, right) {
        return JSON.stringify(left) === JSON.stringify(right);
    }

    exportNodeData(nodeData) {
        const result = {};
        for (const [key, value] of Object.entries(nodeData || {})) {
            if (key === "children" || key === "key" || key === "lazy" || key === "selected") {
                continue;
            }
            if (key === "type") {
                result.Type = value;
                continue;
            }
            if (key === "title") {
                result[this._titleFieldName] = value;
                continue;
            }
            result[key] = this.clonePlainValue(value);
        }
        return result;
    }

    getRowDataSnapshot(rowId, fallbackData = null) {
        const cachedRow = this._rowById.get(this.getRowKey(rowId));
        if (cachedRow) {
            return this.clonePlainValue(cachedRow);
        }
        return this.exportNodeData(fallbackData);
    }

    buildTreeSnapshotFromNode(node) {
        const rowData = this.getRowDataSnapshot(node.data?.ID, node.data);
        const childNodes = Array.isArray(node.children) ? node.children : [];
        if (childNodes.length > 0) {
            rowData.children = childNodes.map(child => this.buildTreeSnapshotFromNode(child));
        } else if (node.lazy) {
            rowData.lazy = true;
        }
        return rowData;
    }

    getTreeDataSnapshot() {
        if (this._ForguncyTree?.root?.children?.length) {
            return this._ForguncyTree.root.children.map(node => this.buildTreeSnapshotFromNode(node));
        }
        return this.clonePlainValue(this._treeData);
    }

    getSelectedDataSnapshot() {
        if (!this._ForguncyTree) {
            return [];
        }
        const result = [];
        const handledKeys = new Set();
        for (const node of this._ForguncyTree.getSelectedNodes()) {
            const nodeKey = this.getRowKey(node.data?.ID) ?? node.key;
            if (handledKeys.has(nodeKey)) {
                continue;
            }
            handledKeys.add(nodeKey);
            result.push(this.getRowDataSnapshot(node.data?.ID, node.data));
        }
        return result;
    }

    updatePendingChange(node, colId, newValue, previousValue) {
        const rowId = node.data?.ID;
        const rowKey = this.getRowKey(rowId);
        if (rowKey === null) {
            return;
        }

        const fieldName = this.getColumnFieldName(colId);
        const oldValue = this.clonePlainValue(this.getOriginalValue(rowId, colId, previousValue));
        const currentValue = this.clonePlainValue(newValue);

        let record = this._updateData.get(rowKey);
        if (!record) {
            record = {
                ID: node.data.ID,
                PID: node.data.PID,
                Type: node.data.type ?? node.data.Type,
                changes: new Map()
            };
        }

        if (this.areValuesEqual(oldValue, currentValue)) {
            record.changes.delete(fieldName);
        } else {
            record.changes.set(fieldName, {
                field: fieldName,
                oldValue: oldValue,
                newValue: currentValue
            });
        }

        if (record.changes.size === 0) {
            this._updateData.delete(rowKey);
            return;
        }

        record.currentData = this.getRowDataSnapshot(rowId, node.data);
        this._updateData.set(rowKey, record);
    }

    getUpdateDataSnapshot() {
        return Array.from(this._updateData.values()).map(record => ({
            ID: record.ID,
            PID: record.PID,
            Type: record.Type,
            currentData: this.clonePlainValue(record.currentData),
            changes: Array.from(record.changes.values()).map(change => this.clonePlainValue(change))
        }));
    }

    clearUpdateData() {
        this._updateData.clear();
        this._originalRowById.clear();
        for (const [key, row] of this._rowById.entries()) {
            this._originalRowById.set(key, this.clonePlainValue(row));
        }
    }

    reloadTreeData(newData) {
        this._treeData = Array.isArray(newData) ? newData : [];
        if (this._ForguncyTree) {
            this._ForguncyTree.load(this._treeData);
        }
    }

    buildTreeGridOptions() {
        try {
            let ForguncyTree = new mar10.Wunderbaum({
                id: "fg-tree-1-0-0",
                element: this._treeDom,
                debugLevel: 1,
                connectTopBreadcrumb: this._connectTopBreadcrumb,
                checkbox: this._checkbox,
                selectMode: this._selectMode,
                navigationModeOption: "cell",
                source: this._treeData,
                types: this._types,
                columns: this._columnsConfig,
                columnsResizable: true,
                columnsSortable: true,
                dnd: this._dndOptionsType,
                tooltip: (e) => {
                    return `${e.node.title} (${e.node.key})`;
                },
                edit: {
                    trigger: ["clickActive", "F2"],
                    select: true,
                    showClickDelay: 1000,
                    beforeEdit: (e) => {
                        if (e.info.colId == null) {
                            return true;
                        }
                        return this._cellIsEditMap.get(e.info.colId) === true;
                    },
                    edit: (e) => {
                    },
                    apply: function (e) {
                        return e.util.setTimeoutPromise(() => {
                            e.inputElem.setCustomValidity("");
                            if (typeof e.newValue === "string" && e.newValue.match(/.*\d.*/)) {
                                e.inputElem.setCustomValidity("No numbers please.");
                                return false;
                            }
                        }, 1000);
                    },
                },
                filter: {
                    mode: "hide",
                    autoExpand: true,
                },
                load: (e) => {
                },
                init: (e) => {
                    const tree = e.tree;
                },
                buttonClick: function (e) {
                    if (e.command === "sort") {
                        e.tree.sortByProperty({colId: e.info.colId, updateColInfo: true});
                    }
                },
                change: (e) => {
                    const util = e.util;
                    const node = e.node;
                    const info = e.info;
                    const colId = info.colId;
                    const oldValue = this.getRowValueByColumnId(node.data, colId);
                    const newValue = util.getValueFromElem(e.inputElem, true);
                    e.tree.logDebug(`change(${colId})`, newValue);
                    return util.setTimeoutPromise(() => {
                        this.setNodeValueByColumnId(node, colId, newValue);
                        this.syncRowCacheValue(info.node.data.ID, colId, newValue);
                        this.updatePendingChange(node, colId, newValue, oldValue);
                    }, 0);
                },
                lazyLoad: async (e) => {
                    const childTree = this.buildLazyChildren(e.node.data.ID);
                    if (childTree.length === 0) {
                        e.node.setStatus("noData");
                    }
                    return childTree;
                },
                render: (e) => {
                    const node = e.node;
                    const util = e.util;
                    const nodeElement = e.nodeElem;
                    nodeElement.style.setProperty("background-color", Forguncy.ConvertToCssColor(this._currentLevelRowBackgroundColorMap.get(e.node.type)));
                    for (const col of Object.values(e.renderColInfosById)) {
                        const val = this.getRowValueByColumnId(node.data, col.id);
                        if (e.isNew) {
                            col.elem.innerHTML = "";
                            col.elem.appendChild(setColumnCellType(this._cellTypeMap.get(col.id)));
                        }
                        util.setValueToElem(col.elem, val);
                    }
                },
            });
            this._ForguncyTree = ForguncyTree;
        } catch (e) {
            throw new Error(e);
        }
    }

    getSpecifiedFields(item, map) {
        const result = {};

        map.forEach((value, key) => {
            const propertyName = value.jsonPropertyName;
            const rawValue = item[key];

            if (propertyName.toLowerCase() === "title") {
                result.title = rawValue;
            }

            if (value.cellType === 3) {
                result[propertyName] = !!rawValue;
                return;
            }

            if (value.cellType === 2) {
                result[propertyName] = rawValue === null ? "" : rawValue;
                return;
            }

            result[propertyName] = rawValue;
        });

        return result;
    }

    async getBindingDataWithOptions(queryDataOption = null) {
        return new Promise((resolve, reject) => {
            if (this._bindingDataSourceModel === undefined || this._bindingDataSourceModel === null) {
                resolve([]);
                return;
            }

            try {
                this._treeGridToolPluginCellType.getBindingDataSourceValue(this._bindingDataSourceModel, queryDataOption, data => {
                    resolve(Array.isArray(data) ? data : []);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
