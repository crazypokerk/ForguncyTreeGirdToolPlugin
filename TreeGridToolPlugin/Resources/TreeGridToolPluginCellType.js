/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    treeData = null;
    columnsConfig;
    cellTypeMap;
    cellIsEditMap;
    columnsProperties;
    types = {};
    relations = new Map();
    updateData = new Map();
    ForguncyTree = null;
    checkbox = false;
    selectMode = "multi";
    connectTopBreadcrumb = null;
    levelMap = new Map();
    bindingDataSourceModel = null;

    cellType = {
        0: "text",
        1: "number",
        2: "date",
        3: "checkbox",
        4: "select",
        5: "link",
    }

    columnsStyleType = {
        0: "wb-helper-center",
        1: "wb-helper-disabled",
        2: "wb-helper-start",
        3: "wb-helper-end",
        4: "wb-helper-hidden",
        5: "wb-helper-invalid",
        6: "wb-helper-link"
    };

    multipleType = {
        0: "multi",
        1: "hier"
    }

    createContent() {
        const $outer = $("<div style='width:100%;height:70%'>")
            .attr("id", "outer")
            .addClass("outer");
        const $main = $("<main>").addClass("view");
        const $output = $("<output>")
            .attr("id", "parentPath")
            .addClass("hide-on-welcome hidden");
        const $div = $("<div>")
            .attr("id", "demo-tree")
            .addClass("wb-skeleton wb-no-select wunderbaum wb-grid wb-ext-keynav wb-ext-edit wb-ext-filter wb-ext-dnd wb-ext-grid wb-cell-mode");
        $outer.append($main).append($output).append($div);

        this.columnsProperties = this.CellElement.CellType.ColumnsProperties;
        for (let item of this.columnsProperties) {
            this.relations.set(item.Id, {cellType: item.CellType, jsonPropertyName: item.Id});
        }

        this.typesProperties = this.CellElement.CellType.TypesProperties;
        for (let item of this.typesProperties) {
            this.types[item.Level] = {
                icon: item.Name,
                colspan: item.IsColspan === undefined ? false : item.IsColspan
            }

            this.levelMap.set(item.Level, {
                icon: item.Name,
                colspan: item.IsColspan === undefined ? false : item.IsColspan,
                asyncLoadData: item.IsAsyncLoadData === undefined ? false : item.IsAsyncLoadData
            })
        }

        this.checkbox = this.CellElement.CellType.IsCheckbox === undefined ? false : this.CellElement.CellType.IsCheckbox;
        this.selectMode = this.multipleType[this.CellElement.CellType.MultipleProperty];
        this.connectTopBreadcrumb = this.CellElement.CellType.ConnectTopBreadcrumb === undefined ? null : this.CellElement.CellType.ConnectTopBreadcrumb;
        if (this.connectTopBreadcrumb === true) {
            this.connectTopBreadcrumb = 'output#parentPath';
        }

        let columnsConfigObj = this.#generateColumns(this.columnsProperties);
        this.columnsConfig = columnsConfigObj.cols;
        this.cellTypeMap = columnsConfigObj.cellTypeMap;
        this.cellIsEditMap = columnsConfigObj.cellIsEdit;

        return $outer;
    }

    async #getBindingDataWithOptions(bindingDataSourceModel, queryDataOption, flag = 0) {
        return new Promise((resolve, reject) => {
            try {
                this.getBindingDataSourceValue(bindingDataSourceModel, queryDataOption, data => {
                    if (flag === 0) {
                        resolve(this.#buildNormalTree(data, this.relations));
                    } else if (flag === 1) {
                        resolve(data);
                    }
                }, true);
            } catch (e) {
                console.error(e);
                reject(e);
            } finally {
                if (this.treeData == null) {
                    this.treeData = [{
                        "type": null,
                        "title": "",
                        "children": null
                    }];
                }
            }
        })
    }

    async onPageLoaded() {
        this.bindingDataSourceModel = this.CellElement.CellType.DataSource;

        let queryConditions = [];
        let relationType = 1;
        this.levelMap.forEach((value, key) => {
            if (value.asyncLoadData) {
                queryConditions.push({columnName: "Type", compareType: 0, compareValue: key})
            }
        })
        let queryDataOption = {
            queryConditions: queryConditions,
            relationType
        };

        await this.#getBindingDataWithOptions(this.bindingDataSourceModel, queryDataOption, 0).then((treeData) => {
            this.treeData = treeData;
        });

        try {
            let ForguncyTree = new mar10.Wunderbaum({
                id: "demo",
                element: document.getElementById("demo-tree"),
                debugLevel: 5,
                connectTopBreadcrumb: this.connectTopBreadcrumb,
                checkbox: this.checkbox,
                selectMode: this.selectMode,
                // fixedCol: true,
                navigationModeOption: "cell",
                source: this.treeData,
                types: this.types,
                columns: this.columnsConfig,
                columnsResizable: true,
                columnsSortable: true,
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
                    console.warn(this.updateData)
                    const util = e.util;
                    const node = e.node;
                    const info = e.info;
                    console.warn(info)
                    const colId = info.colId;
                    e.tree.logDebug(`change(${colId})`, util.getValueFromElem(e.inputElem, true));

                    this.updateData.set(`${info.node.data.ID}-${colId}`, {
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
                        let bindingDataSourceModel = this.bindingDataSourceModel;
                        let currentLevelData = e.node.data;
                        let queryConditions = [];
                        queryConditions.push({columnName: "PID", compareType: 0, compareValue: currentLevelData.ID})
                        let queryDataOption = {
                            queryConditions: queryConditions
                        };

                        const curData = await this.#getBindingDataWithOptions(bindingDataSourceModel, queryDataOption, 1);
                        
                        for (const rowData of curData) {
                            let curTreeData = [];
                            curTreeData.push(rowData);
                            let curRowDataType = rowData.Type;
                            let curIsAsync = this.levelMap.get(curRowDataType)?.asyncLoadData || false;
                            if (!curIsAsync) {
                                await this.#loadRecursiveData(bindingDataSourceModel, rowData.ID, curTreeData);
                            } else {
                                break;
                            }
                            
                            const childTree = this.#buildNormalTree(curTreeData, this.relations, true, rowData.ID);
                            e.node.addNode(childTree[0], "appendChild");
                            e.node.setExpanded(true);
                            e.node._isLoading = false;
                        }
                    });
                },
                render: (e) => {
                    const node = e.node;
                    const util = e.util;
                    for (const col of Object.values(e.renderColInfosById)) {
                        const val = node.data[col.id];
                        if (e.isNew) {
                            col.elem.innerHTML = this.#setColumnCellType(this.cellTypeMap.get(col.id));
                            util.setValueToElem(col.elem, val);
                        }
                    }
                },
            });
            window.tree = ForguncyTree;
            this.ForguncyTree = ForguncyTree;
        } catch (e) {
            window.tree = null;
            throw new Error(e);
        }
    }

    async #loadRecursiveData(bindingDataSourceModel, pid, curTreeData) {
        const queryConditions = [{
            columnName: "PID",
            compareType: 0,
            compareValue: pid
        }];
        const queryDataOption = { queryConditions };
        const data = await this.#getBindingDataWithOptions(bindingDataSourceModel, queryDataOption, 1);

        if (!data || data.length === 0) {
            return;
        }

        for (const item of data) {
            curTreeData.push(item);
            const curRowDataType = item.Type;
            const curIsAsync = this.levelMap.get(curRowDataType)?.asyncLoadData || false;
            
            if (!curIsAsync) {
                await this.#loadRecursiveData(bindingDataSourceModel, item.ID, curTreeData);
            }
        }
    }

    #buildTree(rawData) {
        const idToIndexMap = {};
        rawData.forEach((node, index) => {
            idToIndexMap[node.ID] = index;
        });

        const flatData = this.convertToFlatFormat(rawData, idToIndexMap);
        console.warn(flatData)
        return {
            "_format": "flat",
            "_positional": ["title", "key", "type"],
            "children": flatData,
        }
    }

    #buildNormalTree(originalData, relationMap, isBuildChildren = false, curNodeID) {
        const map = {};
        const roots = [];
        originalData.forEach(item => {
            map[item.ID] = {...item};
        });
        originalData.forEach(item => {
            let currentItemAsynLoadDataFlag = this.levelMap.get(item.Type).asyncLoadData;
            const obj = {
                ID: item.ID,
                PID: item.PID,
                type: item.Type,
                selected: false,
                lazy: currentItemAsynLoadDataFlag,
                ...getSpecifiedFields(item, relationMap)
            };
            
            if(isBuildChildren) {
                if(curNodeID === item.ID) {
                    map[item.ID].children = [];
                    roots.push(obj);
                } else {
                    if (!map[item.PID].children) {
                        map[item.PID].children = [];
                    }
                    map[item.PID].children.push(obj);
                }
                
            } else {
                if (item.PID === null) {
                    roots.push(obj);
                } else {
                    if (!map[item.PID].children) {
                        map[item.PID].children = [];
                    }
                    map[item.PID].children.push(obj);
                }
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

    convertToFlatFormat(data, idToIndexMap) {
        const flatData = [];
        data.forEach((node) => {
            const parentIndex = node.PID !== null ? idToIndexMap[node.PID] : null;
            flatData.push([
                parentIndex,
                node['标题'],
                node.ID.toString(),
                "defaultType",
                {
                    Age: node['年龄'],
                    Date: node['日期'],
                    Status: node['状态'],
                    Avail_: node['是否'],
                    Remarks: node['备注']
                }
            ]);
        });
        return flatData;
    }

    #generateColumns(customColumns) {
        if (!customColumns.length) return [];

        const cellTypeMap = new Map();
        const cellIsEdit = new Map();
        const cols = [];
        customColumns.forEach((item) => {
            cols.push({
                title: item.Name,
                id: item.Id.toLowerCase() === "title" ? '*' : item.Id,
                width: item.Width == null ? "*" : `${item.Width}px`,
                classes: this.columnsStyleType[item.ColumnStyle]
            });
            cellTypeMap.set(item.Id, item.CellType);
            cellIsEdit.set(item.Id, item.Editable);
        })
        return {cols, cellTypeMap, cellIsEdit};
    }

    #setColumnCellType(type) {
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

    SetTreeData(json) {
        this.treeData = json;
        window.tree.load(this.treeData);
    }

    GetTreeData(tree) {
        if (tree === null) return;
        tree.toDictArray();
    }

    GetUpdateData() {
        const obj = {};
        for (const [key, value] of this.updateData.entries()) {
            if (typeof key === 'string' || typeof key === 'number') {
                obj[key] = value;
            }
        }
        return {UpdateDataJson: JSON.stringify(obj)}
    }

    ToggleExpandAll() {
        this.ForguncyTree.expandAll(!this.ForguncyTree.getFirstChild().isExpanded());
    }

    ToggleSelectAll() {
        if (this.checkbox) {
            this.ForguncyTree.toggleSelect();
        }
    }

    SetTreeDisabled(enabled) {
        if (enabled === '禁用') {
            this.ForguncyTree.setOption("enabled", false);
        } else {
            this.ForguncyTree.setOption("enabled", true);
        }
    }

    GetSelectedData() {
        let selectedNodes = this.ForguncyTree.getSelectedNodes();
        let selectedData = [];
        selectedNodes.forEach((node) => {
            if (node.children !== null) {
                node.children.forEach((child) => {
                    selectedData.push(child.data);
                })
            }
            selectedData.push(node.data);
        })
        return {SelectedDataJson: JSON.stringify(selectedData)};
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);