class TreeGridOptionsConfig {
    _treeDom;
    _treeData = null;
    _columnsConfig;
    _cellTypeMap;
    _cellIsEditMap;
    _columnsProperties;
    _typesProperties
    _types = {};
    _relations = new Map();
    _updateData = new Map();
    _ForguncyTree = null;
    _checkbox = false;
    _dragAndDrop = false;
    _dndOptionsType = {};
    _selectMode = "multi";
    _connectTopBreadcrumb = null;
    _levelMap = new Map();
    _bindingDataSourceModel = null;
    _treeGridToolPluginCellType = null;

    cellType = {
        0: "text",
        1: "number",
        2: "date",
        3: "checkbox",
        4: "select",
        5: "link",
    }

    constructor(treeGridOptionsFirstNeededParams) {
        this._treeGridToolPluginCellType = treeGridOptionsFirstNeededParams.TreeGridToolPluginCellType;
        this._typesProperties = treeGridOptionsFirstNeededParams.typesProperties;
        this._columnsConfig = treeGridOptionsFirstNeededParams.columnsConfigObj.cols;
        this._cellTypeMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellTypeMap;
        this._cellIsEditMap = treeGridOptionsFirstNeededParams.columnsConfigObj.cellIsEdit;
        this._columnsProperties = treeGridOptionsFirstNeededParams.columnsProperties;
        this._checkbox = treeGridOptionsFirstNeededParams.checkbox;
        this._dragAndDrop = treeGridOptionsFirstNeededParams.dragAndDrop;
        this._selectMode = treeGridOptionsFirstNeededParams.selectMode;
        this._connectTopBreadcrumb = treeGridOptionsFirstNeededParams.connectTopBreadcrumb;
        for (let item of this._typesProperties) {
            this._types[item.Level] = {
                icon: item.Name,
                colspan: item.IsColspan === undefined ? false : item.IsColspan
            }
        }
        for (let item of this._typesProperties) {
            this._levelMap.set(item.Level, {
                icon: item.Name,
                colspan: item.IsColspan === undefined ? false : item.IsColspan,
                asyncLoadData: item.IsAsyncLoadData === undefined ? false : item.IsAsyncLoadData
            })
        }
        for (let item of this._columnsProperties) {
            this._relations.set(item.Id, {cellType: item.CellType, jsonPropertyName: item.Id});
        }
        
        if(this._dragAndDrop) {
            this._dndOptionsType = {
                effectAllowed: "copy",
                dragStart: (e) => {
                    return true;
                },
                dragEnter: (e) => {
                    return ["over", "before", "after"];
                },
                drag: (e) => {
                    // e.tree.log(e.type, e);
                },
                drayOver: () => {

                },
                dragLeave: () => {

                },
                drop: (e) => {
                    console.log(
                        `Drop ${e.sourceNode} => ${e.suggestedDropEffect} ${e.suggestedDropMode} ${e.node}`,
                        e
                    );
                    switch (e.suggestedDropEffect) {
                        case "copy":
                            e.node.addNode(
                                {title: `Copy of ${e.sourceNodeData.title}`},
                                e.suggestedDropMode
                            );
                            break;
                        case "link":
                            e.node.addNode(
                                {title: `Link to ${e.sourceNodeData.title}`},
                                e.suggestedDropMode
                            );
                            break;
                        default:
                            e.sourceNode.moveTo(e.node, e.suggestedDropMode);
                    }
                }
            }
        } 
    }

    set treeDom(value) {
        this._treeDom = value;
    }

    set treeData(treeData) {
        this._treeData = treeData;
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

    buildTreeGridOptions() {
        try {
            let ForguncyTree = new mar10.Wunderbaum({
                id: "demo",
                element: this._treeDom,
                debugLevel: 1,
                connectTopBreadcrumb: this._connectTopBreadcrumb,
                checkbox: this._checkbox,
                selectMode: this._selectMode,
                // fixedCol: true,
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
                    beforeEdit: function (e) {
                        // console.log(e.type, e);
                        // return e.node.type === "person";
                    },
                    edit: (e) => {
                        console.log(e.type, e);
                    },
                    apply: function (e) {
                        console.log(e.type, e);
                        // Simulate async storage that also validates:
                        return e.util.setTimeoutPromise(() => {
                            e.inputElem.setCustomValidity("");
                            if (e.newValue.match(/.*\d.*/)) {
                                e.inputElem.setCustomValidity("No numbers please.");
                                return false;
                            }
                        }, 1000);
                    },
                },
                filter: {
                    mode: "hide",
                    autoExpand: true,
                    // connect: {
                    //     inputElem: "#filter-query",
                    //     // modeButton: "#filter-hide",  // using a custom handler
                    //     nextButton: "#filter-next",
                    //     prevButton: "#filter-prev",
                    //     matchInfoElem: "#filter-match-info",
                    // },
                },
                init: (e) => {
                    const tree = e.tree;
                    // e.tree.findFirst("整车总成 A").setExpanded(false);
                    // for (const key of this.cellIsEditMap.keys()) {
                    //     let a = tree.findFirst((n) => {
                    //         return n.data;
                    //     });
                    //     break;
                    // }
                },
                buttonClick: function (e) {
                    if (e.command === "sort") {
                        e.tree.sortByProperty({colId: e.info.colId, updateColInfo: true});
                    }
                },
                change: (e) => {
                    console.warn(this._updateData)
                    const util = e.util;
                    const node = e.node;
                    const info = e.info;
                    console.warn(info)
                    const colId = info.colId;
                    e.tree.logDebug(`change(${colId})`, util.getValueFromElem(e.inputElem, true));

                    this._updateData.set(`${info.node.data.ID}-${colId}`, {
                        PID: info.node.data.PID,
                        ChangedColId: colId,
                        oldValue: info.node.data[colId],
                        newValue: util.getValueFromElem(e.inputElem, true)
                    });
                    return util.setTimeoutPromise(() => {
                        node.data[colId] = util.getValueFromElem(e.inputElem, true);
                    }, 0);
                },
                lazyLoad: async (e) => {
                    return new Promise(async (resolve, reject) => {
                        let currentLevelData = e.node.data;
                        let queryConditions = [];
                        queryConditions.push({columnName: "PID", compareType: 0, compareValue: currentLevelData.ID})
                        let queryDataOption = {
                            queryConditions: queryConditions
                        };

                        const curData = await this.getBindingDataWithOptions(queryDataOption, 1);
                        if (curData.length === 0 || curData === []) {
                            await e.node.setExpanded(true);
                            e.node.setStatus('noData')
                            e.node._isLoading = false;
                        } else {
                            for (const rowData of curData) {
                                let curTreeData = [];
                                curTreeData.push(rowData);
                                let curRowDataType = rowData.Type;
                                let curIsAsync = this._levelMap.get(curRowDataType)?.asyncLoadData || false;
                                if (!curIsAsync) {
                                    await this.loadRecursiveData(rowData.ID, curTreeData);
                                } else {
                                    break;
                                }

                                const childTree = this.buildNormalTree(curTreeData, this._relations, this._levelMap, true, rowData.ID);
                                e.node.addNode(childTree[0], "appendChild");
                                await e.node.setExpanded(true);
                                e.node._isLoading = false;
                            }
                        }
                    });
                },
                render: (e) => {
                    const node = e.node;
                    const util = e.util;
                    for (const col of Object.values(e.renderColInfosById)) {
                        const val = node.data[col.id];
                        if (e.isNew) {
                            col.elem.innerHTML = setColumnCellType(this._cellTypeMap.get(col.id));
                            util.setValueToElem(col.elem, val);
                        }
                    }
                },
            });
            this._ForguncyTree = ForguncyTree;
        } catch (e) {
            throw new Error(e);
        }
    }

    buildNormalTree(originalData, relationMap, levelMap, isBuildChildren = false, curNodeID = null) {
        const map = {};
        const roots = [];
        originalData.forEach(item => {
            map[item.ID] = {...item};
        });
        originalData.forEach(item => {
            let isAsyncLoad = this._levelMap.get(item.Type)?.asyncLoadData || false;
            const obj = {
                ID: item.ID,
                PID: item.PID,
                type: item.Type,
                selected: false,
                lazy: isAsyncLoad,
                ...getSpecifiedFields(item, relationMap)
            };

            if (isBuildChildren) {
                if (curNodeID === item.ID) {
                    map[item.ID].children = [];
                    roots.push(obj);
                } else {
                    _addChildToParent(item, obj, map);
                }
            } else {
                if (item.PID === null) {
                    roots.push(obj);
                } else {
                    _addChildToParent(item, obj, map);
                }
            }

            function _addChildToParent(item, obj, map) {
                if (!map[item.PID].children) {
                    map[item.PID].children = [];
                }
                map[item.PID].children.push(obj);
            }

            // 将当前节点保存起来用于后续构建
            map[item.ID] = obj;
        });
        return roots;

        function getSpecifiedFields(item, map) {
            const result = {};

            map.forEach((value, key) => {
                if (value.jsonPropertyName.toLowerCase() === "title") {
                    result[value.jsonPropertyName.toLowerCase()] = item[key];
                }
                result[value.jsonPropertyName] = item[key];
                if (value.cellType === 3) {
                    result[value.jsonPropertyName] = !!item[key]; // 转换为布尔值
                } else if (value.cellType === 2) {
                    result[value.jsonPropertyName] = item[key] === null ? '' : item[key];
                }
            })
            return result;
        }
    }

    async getBindingDataWithOptions(queryDataOption, flag = 0) {
        return new Promise((resolve, reject) => {
            try {
                this._treeGridToolPluginCellType.getBindingDataSourceValue(this._bindingDataSourceModel, queryDataOption, data => {
                    if (flag === 0) {
                        resolve(this.buildNormalTree(data, this._relations, this._levelMap, false));
                    } else if (flag === 1) {
                        resolve(data);
                    }
                }, true);
            } catch (e) {
                console.error(e);
                reject(e);
            } finally {
                if (this._treeData == null) {
                    this._treeData = [{
                        "type": null,
                        "title": "",
                        "children": null
                    }];
                }
            }
        })
    }

    async loadRecursiveData(pid, curTreeData) {
        const queryConditions = [{
            columnName: "PID",
            compareType: 0,
            compareValue: pid
        }];
        const queryDataOption = {queryConditions};
        const data = await this.getBindingDataWithOptions(queryDataOption, 1);

        if (!data || data.length === 0) {
            return;
        }

        for (const item of data) {
            curTreeData.push(item);
            const curRowDataType = item.Type;
            const curIsAsync = this._levelMap.get(curRowDataType)?.asyncLoadData || false;

            if (!curIsAsync) {
                await this.loadRecursiveData(item.ID, curTreeData);
            }
        }
    }
}