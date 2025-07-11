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
        for(let item of this.columnsProperties) {
            this.relations.set(item.Id, {cellType: item.CellType, jsonPropertyName: item.Id});
        }
        
        this.typesProperties = this.CellElement.CellType.TypesProperties;
        for(let item of this.typesProperties) {
            this.types[item.Level] = { icon: item.Name, colspan: item.IsColspan === undefined ? false : item.IsColspan};
        }
        
        this.checkbox = this.CellElement.CellType.IsCheckbox === undefined? false : this.CellElement.CellType.IsCheckbox;
        this.selectMode = this.multipleType[this.CellElement.CellType.MultipleProperty];
        
        let columnsConfigObj =  this.#generateColumns(this.columnsProperties);
        this.columnsConfig = columnsConfigObj.cols;
        this.cellTypeMap = columnsConfigObj.cellTypeMap;
        this.cellIsEditMap = columnsConfigObj.cellIsEdit;
        
        return $outer;
    }
    
    async onPageLoaded() {
        await new Promise((resolve, reject) => {
            try {
                this.getBindingDataSourceValue(this.CellElement.CellType.DataSource, null, data => {
                    this.treeData = this.#buildNormalTree(data, this.relations);
                    resolve();
                }, true);
            } catch (e) {
                console.error(e);
            } finally {
                if(this.treeData == null) {
                    this.treeData = [{
                        "type": null,
                        "title" : "",
                        "children" : null
                    }];
                }
            }
        })
        
        try {
            let ForguncyTree= new mar10.Wunderbaum({
                id: "demo",
                element: document.getElementById("demo-tree"),
                debugLevel: 5,
                connectTopBreadcrumb: "output#parentPath",
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
                    for (const key of this.cellIsEditMap.keys()) {
                        let a = tree.findFirst((n) => {
                            return n.data;
                        });
                        break;
                    }
                },
                buttonClick: function (e) {
                    if (e.command === "sort") {
                        e.tree.sortByProperty({ colId: e.info.colId, updateColInfo: true });
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
                render: (e) => {
                    const node = e.node;
                    const util = e.util;
                    for (const col of Object.values(e.renderColInfosById)) {
                        const val = node.data[col.id];
                        if(e.isNew) {
                            col.elem.innerHTML = this.#setColumnCellType(this.cellTypeMap.get(col.id));
                            util.setValueToElem(col.elem, val);
                        }
                    }
                },
                lazyLoad: (e) => {
                    console.warn(`lazy---eee---${e}`);
                }
            });
            window.tree = ForguncyTree;
            this.ForguncyTree = ForguncyTree;
        } catch (e) {
            window.tree = null;
            throw new Error(e);
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
    
    #buildNormalTree(originalData, relationMap) {
        const map = {};
        const roots = [];
        originalData.forEach(item => {
            map[item.ID] = { ...item };
        });
        originalData.forEach(item => {
            const obj = {
                ID: item.ID,
                PID: item.PID,
                type: item.Type,
                selected: false,
                ...getSpecifiedFields(item, relationMap)
            };
            if (item.PID === null) {
                roots.push(obj);
            } else {
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
            
            map.forEach((value, key)=> {
                if(value.jsonPropertyName.toLowerCase() === "title") {
                    result[value.jsonPropertyName.toLowerCase()]= item[key];
                }
                result[value.jsonPropertyName] = item[key];
                if (value.cellType === 3) {
                    result[value.jsonPropertyName] =!!item[key]; // 转换为布尔值
                } else if(value.cellType === 2) {
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
        customColumns.forEach((item)=> {
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
                innerHTML = '<input type="number" min="0" tabindex="-1">';
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
        if(tree === null) return;
        tree.toDictArray();
    }

    GetUpdateData() {
        const obj = {};
        for(const [key, value] of this.updateData.entries()) {
            if (typeof key === 'string' || typeof key === 'number') {
                obj[key] = value;
            }
        }
        return {UpdateDataJson: obj}
    }
    
    ToggleExpandAll() {
        this.ForguncyTree.expandAll(!this.ForguncyTree.getFirstChild().isExpanded());
    }

    ToggleSelectAll() {
        if(this.checkbox) {
            this.ForguncyTree.toggleSelect();
        }
    }
    
    SetTreeDisabled(enabled) {
        if(enabled === '禁用') {
            this.ForguncyTree.setOption("enabled", false);
        } else {
            this.ForguncyTree.setOption("enabled", true);
        }
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);