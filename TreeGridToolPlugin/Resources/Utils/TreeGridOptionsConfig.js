class TreeGridOptionsConfig {
    static ROOT_PID_KEY = "__root__";

    SOURCE_MODE = {
        FLAT: 0,
        OBJECT_TREE: 1
    };

    _treeDom;
    _treeData = [];
    _sourceMode = 0;
    _flatConfig = {};
    _objectTreeConfig = {};
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

    SELECT_MODE = {
        0: "multi",
        1: "hier"
    }

    constructor(treeGridOptionsFirstNeededParams) {
        this._treeGridToolPluginCellType = treeGridOptionsFirstNeededParams.TreeGridToolPluginCellType;
        this._sourceMode = treeGridOptionsFirstNeededParams.sourceMode ?? this.SOURCE_MODE.FLAT;
        this._flatConfig = treeGridOptionsFirstNeededParams.flatConfig || {};
        this._objectTreeConfig = treeGridOptionsFirstNeededParams.objectTreeConfig || {};
        this._typesProperties = treeGridOptionsFirstNeededParams.typesProperties;
        this._columnsConfig = treeGridOptionsFirstNeededParams.columnsConfigObj.cols;
        this._cellTypeMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellTypeMap;
        this._cellIsEditMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellIsEdit;
        this._columnFieldMap = treeGridOptionsFirstNeededParams.columnsConfigObj.columnFieldMap;
        this._titleFieldName = treeGridOptionsFirstNeededParams.columnsConfigObj.titleFieldName || this.getConfiguredTitleFieldName();
        this._columnsProperties = treeGridOptionsFirstNeededParams.columnsProperties;
        this._checkbox = treeGridOptionsFirstNeededParams.checkbox;
        this._dragAndDrop = treeGridOptionsFirstNeededParams.dragAndDrop;
        this._selectMode = this.SELECT_MODE[treeGridOptionsFirstNeededParams.selectMode];
        this._connectTopBreadcrumb = treeGridOptionsFirstNeededParams.connectTopBreadcrumb === false ? null : "output#parentPath";

        if (this._typesProperties && this._typesProperties.length) {
            for (const item of this._typesProperties) {
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
            for (const item of this._columnsProperties) {
                const fieldName = this.getColumnConfigFieldName(item);
                if (!fieldName) {
                    continue;
                }
                this._relations.set(fieldName, {cellType: item.CellType, jsonPropertyName: fieldName});
            }
        }

        if (this._dragAndDrop) {
            this._dndOptionsType = {
                dragStart: e => {
                    if (e.node.type === "folder") {
                        return false;
                    }
                    e.event.dataTransfer.effectAllowed = "all";
                    return true;
                },
                dragEnter: e => {
                    if (e.node.type === "folder") {
                        e.event.dataTransfer.dropEffect = "copy";
                        return "over";
                    }
                    return ["before", "after"];
                },
                drop: e => {
                    e.sourceNode.moveTo(e.node, e.suggestedDropMode);
                },
            };
        }
    }

    isFlatMode() {
        return this._sourceMode === this.SOURCE_MODE.FLAT;
    }

    isObjectTreeMode() {
        return this._sourceMode === this.SOURCE_MODE.OBJECT_TREE;
    }

    getConfiguredTitleFieldName() {
        if (this.isObjectTreeMode()) {
            return this._objectTreeConfig.titleField || "title";
        }
        return this._flatConfig.titleField || "Title";
    }

    getConfiguredTypeFieldName() {
        if (this.isObjectTreeMode()) {
            return this._objectTreeConfig.typeField || "type";
        }
        return this._flatConfig.typeField || "Type";
    }

    getConfiguredChildrenFieldName() {
        return this.isObjectTreeMode()
            ? (this._objectTreeConfig.childrenField || "children")
            : "children";
    }

    matchesFieldName(left, right) {
        return (left || "").toLowerCase() === (right || "").toLowerCase();
    }

    getColumnConfigFieldName(column) {
        return column?.Id || column?.Name || "";
    }

    cloneColumnDefinition(column) {
        return {
            ...column
        };
    }

    createAutoColumnDefinition(fieldName) {
        return {
            Name: fieldName,
            HeaderText: fieldName,
            Width: null,
            ColumnStyle: 2,
            CellType: 0,
            Editable: false
        };
    }

    getStructuralFieldNames() {
        const fieldNames = new Set();

        if (this.isFlatMode()) {
            fieldNames.add((this._flatConfig.idField || "ID").toLowerCase());
            fieldNames.add((this._flatConfig.parentField || "PID").toLowerCase());
            fieldNames.add((this._flatConfig.typeField || "Type").toLowerCase());
            fieldNames.add((this._flatConfig.titleField || "Title").toLowerCase());
            return fieldNames;
        }

        fieldNames.add((this._objectTreeConfig.keyField || "key").toLowerCase());
        fieldNames.add((this._objectTreeConfig.typeField || "type").toLowerCase());
        fieldNames.add((this._objectTreeConfig.titleField || "title").toLowerCase());
        fieldNames.add((this._objectTreeConfig.childrenField || "children").toLowerCase());
        return fieldNames;
    }

    shouldAutoGenerateColumn(fieldName) {
        const normalizedFieldName = (fieldName || "").toLowerCase();
        if (!normalizedFieldName) {
            return false;
        }

        if (normalizedFieldName === "lazy" || normalizedFieldName === "selected") {
            return false;
        }

        return !this.getStructuralFieldNames().has(normalizedFieldName);
    }

    getSampleDataItem(sourceValue) {
        if (Array.isArray(sourceValue)) {
            for (const item of sourceValue) {
                const sample = this.getSampleDataItem(item);
                if (sample) {
                    return sample;
                }
            }
            return null;
        }

        if (!sourceValue || typeof sourceValue !== "object") {
            return null;
        }

        if (this.isObjectTreeMode()) {
            const childrenField = this.getConfiguredChildrenFieldName();
            const cloned = this.clonePlainValue(sourceValue);
            const children = Array.isArray(cloned[childrenField]) ? cloned[childrenField] : [];
            delete cloned[childrenField];

            if (Object.keys(cloned).length > 0) {
                return cloned;
            }
            return this.getSampleDataItem(children);
        }

        return this.clonePlainValue(sourceValue);
    }

    resolveColumnsProperties(sampleDataItem = null) {
        const titleFieldName = this.getConfiguredTitleFieldName();
        const configuredColumns = Array.isArray(this._columnsProperties)
            ? this._columnsProperties.map(column => this.cloneColumnDefinition(column))
            : [];
        const configuredFieldNames = new Set(configuredColumns
            .map(column => this.getColumnConfigFieldName(column).toLowerCase())
            .filter(fieldName => fieldName));
        const sampleColumns = [];

        if (sampleDataItem && typeof sampleDataItem === "object") {
            for (const fieldName of Object.keys(sampleDataItem)) {
                if (configuredFieldNames.has(fieldName.toLowerCase())) {
                    continue;
                }
                if (!this.shouldAutoGenerateColumn(fieldName)) {
                    continue;
                }
                sampleColumns.push(this.createAutoColumnDefinition(fieldName));
            }
        }

        let resolvedColumns = configuredColumns;
        const titleColumnIndex = configuredColumns.findIndex(column => this.matchesFieldName(this.getColumnConfigFieldName(column), titleFieldName));
        const hasOnlyTitleColumn = configuredColumns.length === 1 && titleColumnIndex === 0;

        if (configuredColumns.length === 0) {
            resolvedColumns = sampleColumns;
        } else if (hasOnlyTitleColumn && sampleColumns.length > 0) {
            resolvedColumns = configuredColumns.concat(sampleColumns);
        }

        const resolvedTitleColumnIndex = resolvedColumns.findIndex(column => this.matchesFieldName(this.getColumnConfigFieldName(column), titleFieldName));
        if (resolvedTitleColumnIndex < 0) {
            resolvedColumns.unshift(this.createAutoColumnDefinition(titleFieldName));
        } else if (resolvedTitleColumnIndex > 0) {
            const [titleColumn] = resolvedColumns.splice(resolvedTitleColumnIndex, 1);
            resolvedColumns.unshift(titleColumn);
        }

        return resolvedColumns;
    }

    applyColumnsFromData(sourceValue) {
        const sampleDataItem = this.getSampleDataItem(sourceValue);
        const resolvedColumns = this.resolveColumnsProperties(sampleDataItem);
        const columnsConfigObj = generateColumns(resolvedColumns, this.getConfiguredTitleFieldName());

        this._columnsConfig = columnsConfigObj.cols;
        this._cellTypeMap = columnsConfigObj.cellTypeMap;
        this._cellIsEditMap = columnsConfigObj.cellIsEdit;
        this._columnFieldMap = columnsConfigObj.columnFieldMap;
        this._titleFieldName = columnsConfigObj.titleFieldName || this.getConfiguredTitleFieldName();

        if (this._ForguncyTree) {
            this._ForguncyTree.columns = this._columnsConfig;
            this._ForguncyTree.update("colStructure");
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

    async initializeTreeData(initialSourceValue = null) {
        if (this.isFlatMode()) {
            const flatRows = await this.getBindingDataWithOptions();
            return this.prepareFlatData(flatRows);
        }
        return this.prepareObjectTreeData(initialSourceValue);
    }

    async refreshTreeData(initialSourceValue = null) {
        const treeData = await this.initializeTreeData(initialSourceValue);
        this.reloadTreeData(treeData);
        return treeData;
    }

    resetCaches() {
        this._updateData.clear();
        this._flatRows = [];
        this._rowById.clear();
        this._originalRowById.clear();
        this._childrenByPid.clear();
    }

    getFlatRowId(row) {
        return row?.[this._flatConfig.idField || "ID"];
    }

    getFlatRowParentId(row) {
        return row?.[this._flatConfig.parentField || "PID"];
    }

    getFlatRowTitle(row) {
        return row?.[this._flatConfig.titleField || "Title"];
    }

    getFlatRowType(row) {
        const typeField = this._flatConfig.typeField || "Type";
        return row?.[typeField];
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

    prepareTreeData(flatRows) {
        return this.prepareFlatData(flatRows);
    }

    prepareFlatData(flatRows) {
        this.rebuildFlatRowCache(flatRows);
        this.applyColumnsFromData(this._flatRows);
        this._treeData = this.buildFlatTreeFromRows();
        return this._treeData;
    }

    rebuildFlatRowCache(flatRows) {
        this.resetCaches();
        const sourceRows = Array.isArray(flatRows) ? flatRows.filter(item => this.getFlatRowId(item) !== null && this.getFlatRowId(item) !== undefined && this.getFlatRowId(item) !== "") : [];

        for (const item of sourceRows) {
            const row = this.clonePlainValue(item);
            const rowKey = this.getRowKey(this.getFlatRowId(row));
            this._flatRows.push(row);
            this._rowById.set(rowKey, row);
            this._originalRowById.set(rowKey, this.clonePlainValue(row));
        }

        for (const row of this._flatRows) {
            const pidKey = this.getBucketKey(this.getFlatRowParentId(row));
            if (!this._childrenByPid.has(pidKey)) {
                this._childrenByPid.set(pidKey, []);
            }
            this._childrenByPid.get(pidKey).push(row);
        }
    }

    isRootFlatRow(row) {
        const pidKey = this.getRowKey(this.getFlatRowParentId(row));
        return pidKey === null || !this._rowById.has(pidKey);
    }

    getChildRows(parentId) {
        return this._childrenByPid.get(this.getBucketKey(parentId)) || [];
    }

    matchesTitleField(propertyName) {
        return (propertyName || "").toLowerCase() === this._titleFieldName.toLowerCase();
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

    createNodeDataFromFlatRow(row) {
        const originalRow = this.clonePlainValue(row);
        const nodeData = {
            ...originalRow,
            ...this.getSpecifiedFields(originalRow, this._relations),
            key: String(this.getFlatRowId(row)),
            ID: this.getFlatRowId(row),
            PID: this.getFlatRowParentId(row),
            type: this.getFlatRowType(row),
            selected: false
        };

        if (nodeData.title === undefined) {
            nodeData.title = this.getFlatRowTitle(row) ?? String(this.getFlatRowId(row));
        }
        return nodeData;
    }

    buildFlatTreeFromRows() {
        const roots = this._flatRows.filter(row => this.isRootFlatRow(row));
        return this.buildNodesFromFlatRows(roots, new Set());
    }

    buildNodesFromFlatRows(rows, path) {
        const result = [];
        for (const row of rows) {
            const node = this.buildFlatNode(row, path);
            if (node) {
                result.push(node);
            }
        }
        return result;
    }

    buildFlatNode(row, path = new Set()) {
        const rowKey = this.getRowKey(this.getFlatRowId(row));
        if (rowKey === null) {
            return null;
        }

        const nextPath = new Set(path);
        nextPath.add(rowKey);

        const nodeData = this.createNodeDataFromFlatRow(row);
        const childRows = this.getChildRows(this.getFlatRowId(row)).filter(child => this.getRowKey(this.getFlatRowId(child)) !== rowKey);
        const shouldLazyLoad = this.isAsyncLevel(nodeData.type) && childRows.length > 0;

        if (shouldLazyLoad) {
            nodeData.lazy = true;
            return nodeData;
        }

        const childNodes = [];
        for (const childRow of childRows) {
            const childKey = this.getRowKey(this.getFlatRowId(childRow));
            if (childKey !== null && nextPath.has(childKey)) {
                continue;
            }
            const childNode = this.buildFlatNode(childRow, nextPath);
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
        return this.buildNodesFromFlatRows(this.getChildRows(parentId), new Set([String(parentId)]));
    }

    parseObjectTreeSource(sourceValue) {
        if (Array.isArray(sourceValue)) {
            return sourceValue;
        }
        if (sourceValue && typeof sourceValue === "object") {
            return [sourceValue];
        }
        if (typeof sourceValue === "string") {
            const trimmedValue = sourceValue.trim();
            if (!trimmedValue) {
                return [];
            }
            try {
                const parsedValue = JSON.parse(trimmedValue);
                if (Array.isArray(parsedValue)) {
                    return parsedValue;
                }
                if (parsedValue && typeof parsedValue === "object") {
                    return [parsedValue];
                }
            } catch (error) {
                return [];
            }
        }
        return [];
    }

    prepareObjectTreeData(sourceValue) {
        this.resetCaches();
        const rootNodes = this.parseObjectTreeSource(sourceValue);
        this.applyColumnsFromData(rootNodes);
        this._treeData = this.normalizeObjectTreeNodes(rootNodes, null, []);
        return this._treeData;
    }

    normalizeObjectTreeNodes(nodes, parentKey = null, path = []) {
        const result = [];
        for (let index = 0; index < nodes.length; index++) {
            const rawNode = this.clonePlainValue(nodes[index]);
            const node = this.normalizeObjectTreeNode(rawNode, parentKey, path.concat(index));
            if (node) {
                result.push(node);
            }
        }
        return result;
    }

    normalizeObjectTreeNode(rawNode, parentKey, path) {
        if (!rawNode || typeof rawNode !== "object") {
            return null;
        }

        const keyField = this._objectTreeConfig.keyField || "key";
        const titleField = this._objectTreeConfig.titleField || "title";
        const typeField = this._objectTreeConfig.typeField || "type";
        const childrenField = this._objectTreeConfig.childrenField || "children";

        let key = rawNode[keyField];
        if (key === undefined || key === null || key === "") {
            key = path.join("_");
        }
        key = String(key);

        const originalNode = this.clonePlainValue(rawNode);
        delete originalNode[childrenField];

        this._rowById.set(key, originalNode);
        this._originalRowById.set(key, this.clonePlainValue(originalNode));

        const nodeData = {
            ...originalNode,
            ...this.getSpecifiedFields(rawNode, this._relations),
            key: key,
            ID: key,
            PID: parentKey,
            type: rawNode[typeField],
            selected: false
        };

        if (nodeData.title === undefined) {
            nodeData.title = rawNode[titleField] ?? key;
        }

        const children = Array.isArray(rawNode[childrenField]) ? rawNode[childrenField] : [];
        const childNodes = this.normalizeObjectTreeNodes(children, key, path);
        if (childNodes.length > 0) {
            nodeData.children = childNodes;
        } else if (rawNode.lazy === true) {
            nodeData.lazy = true;
        }

        return nodeData;
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
            if (key === "children" || key === "key" || key === "lazy" || key === "selected" || key === "ID" || key === "PID") {
                continue;
            }
            if (key === "type") {
                result[this.getConfiguredTypeFieldName()] = value;
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

    getRowDataSnapshot(rowId, fallbackData = null, includeChildren = false) {
        const cachedRow = this._rowById.get(this.getRowKey(rowId));
        const rowData = cachedRow ? this.clonePlainValue(cachedRow) : this.exportNodeData(fallbackData);
        if (!includeChildren) {
            delete rowData[this.getConfiguredChildrenFieldName()];
            delete rowData.children;
        }
        return rowData;
    }

    buildTreeSnapshotFromNode(node) {
        const rowData = this.getRowDataSnapshot(node.data?.ID, node.data, false);
        const childNodes = Array.isArray(node.children) ? node.children : [];
        if (childNodes.length > 0) {
            rowData[this.getConfiguredChildrenFieldName()] = childNodes.map(child => this.buildTreeSnapshotFromNode(child));
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
            result.push(this.getRowDataSnapshot(node.data?.ID, node.data, false));
        }
        return result;
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
                Type: node.data.type,
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

        record.currentData = this.getRowDataSnapshot(rowId, node.data, false);
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
            const ForguncyTree = new mar10.Wunderbaum({
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
                tooltip: e => `${e.node.title} (${e.node.key})`,
                edit: {
                    trigger: ["clickActive", "F2"],
                    select: true,
                    showClickDelay: 1000,
                    beforeEdit: e => {
                        const colId = e.info?.colId ?? "*";
                        return this._cellIsEditMap.get(colId) === true;
                    },
                    edit: e => {
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
                load: e => {
                },
                init: e => {
                    const tree = e.tree;
                },
                buttonClick: function (e) {
                    if (e.command === "sort") {
                        e.tree.sortByProperty({colId: e.info.colId, updateColInfo: true});
                    }
                },
                change: e => {
                    const util = e.util;
                    const node = e.node;
                    const info = e.info;
                    const colId = info?.colId ?? "*";
                    const oldValue = this.getRowValueByColumnId(node.data, colId);
                    const newValue = util.getValueFromElem(e.inputElem, true);

                    e.tree.logDebug(`change(${colId})`, newValue);
                    return util.setTimeoutPromise(() => {
                        this.setNodeValueByColumnId(node, colId, newValue);
                        this.syncRowCacheValue(node.data?.ID, colId, newValue);
                        this.updatePendingChange(node, colId, newValue, oldValue);
                    }, 0);
                },
                lazyLoad: async e => {
                    if (!this.isFlatMode()) {
                        return [];
                    }
                    const childTree = this.buildLazyChildren(e.node.data.ID);
                    if (childTree.length === 0) {
                        e.node.setStatus("noData");
                    }
                    return childTree;
                },
                render: e => {
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
                        setColumnCellEditable(col.elem, this._cellIsEditMap.get(col.id) === true);
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

            if (this.matchesTitleField(propertyName)) {
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
