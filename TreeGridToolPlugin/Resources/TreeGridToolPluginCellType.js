/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    treeData = null;
    columnsConfig;
    cellTypeMap;
    cellIsEditMap;
    
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
        
        const columnsProperties = this.CellElement.CellType.ColumnsProperties;
        let columnsConfigObj =  this.#generateColumns(columnsProperties);
        this.columnsConfig = columnsConfigObj.cols;
        this.cellTypeMap = columnsConfigObj.cellTypeMap;
        this.cellIsEditMap = columnsConfigObj.cellIsEdit;
        
        return $outer;
    }
    
    async onPageLoaded() {
        await new Promise((resolve, reject) => {
            try {
                this.getBindingDataSourceValue(this.CellElement.CellType.DataSource, null, data => {
                    this.treeData = this.#buildTree(data);
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
            let tree= new mar10.Wunderbaum({
                id: "demo",
                element: document.getElementById("demo-tree"),
                debugLevel: 5,
                connectTopBreadcrumb: "output#parentPath",
                checkbox: true,
                // fixedCol: true,
                // navigationModeOption: "row",
                navigationModeOption: "startRow",
                // navigationModeOption: "cell",
                // source:"https://cdn.jsdelivr.net/gh/mar10/assets@master/wunderbaum/tree_department_M_p.json",
                source: this.treeData,
                types: {
                    department: { icon: "bi bi-diagram-3", colspan: true },
                    role: { icon: "bi bi-microsoft-teams", colspan: true },
                    person: { icon: "bi bi-person" },
                },
                columns: this.columnsConfig,
                columnsResizable: true,
                columnsSortable: true,
                tooltip: (e) => {
                    return `${e.node.title} (${e.node.key})`;
                },
                edit: {
                    trigger: ["clickActive", "F2"], // "macEnter"],
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
                change: function (e) {
                    const util = e.util;
                    const node = e.node;
                    const info = e.info;
                    const colId = info.colId;
                    this.logDebug(`change(${colId})`, util.getValueFromElem(e.inputElem, true));
                    // For demo purposes, simulate a backend delay:
                    return util.setTimeoutPromise(() => {
                        node.data[colId] = util.getValueFromElem(e.inputElem, true);
                    }, 500);
                },
                render: (e)=>  {
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
            });
            window.tree = tree;
        } catch (e) {
            window.tree = null;
            throw new Error(e);
        }
    }

    #buildTree(rawData) {
        const idToIndexMap = {};
        rawData.forEach((node, index) => {
           idToIndexMap[node.ID] = index; // 存储每个节点的索引
        });
        
        const flatData = this.convertToFlatFormat(rawData, idToIndexMap);
        
        return {
            "_format": "flat",
            "_positional": ["title", "key", "type"],
            "children": flatData,
        }
    }
    
    convertToFlatFormat(data, idToIndexMap) {
        const flatData = [];
        data.forEach((node) => {
            const parentIndex = node.PID !== null ? idToIndexMap[node.PID] : null;
            flatData.push([
                parentIndex,
                node.Title,
                node.ID.toString(),
                "defaultType",
                {
                    age: node.Age,
                    date: node.Date,
                    status: node.Status,
                    avail: node.Avail_,
                    remarks: node.Remarks
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
                id: item.Id,
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
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);