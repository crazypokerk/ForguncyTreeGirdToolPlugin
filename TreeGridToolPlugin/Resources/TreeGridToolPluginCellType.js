/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    treeData;
    columnsConfig;
    cellTypeMap;
    
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
        const $outer = $("<div style='width:100%;height:60%'>")
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
        //this.treeData = this.#buildTree(datasource);
        let columnsConfigObj =  this.#generateColumns(columnsProperties);
        this.columnsConfig = columnsConfigObj.cols;
        this.cellTypeMap = columnsConfigObj.cellTypeMap;
        console.warn(this.cellTypeMap);
        
        return $outer;
    }
    
    onPageLoaded() {
        console.warn(this.treeData)
        console.warn("onPageLoaded", this.columnsConfig);
        try {
            new mar10.Wunderbaum({
                id: "demo",
                element: document.getElementById("demo-tree"),
                debugLevel: 5,
                connectTopBreadcrumb: "output#parentPath",
                checkbox: true,
                // fixedCol: true,
                // navigationModeOption: "row",
                navigationModeOption: "startRow",
                // navigationModeOption: "cell",
                source:
                    "https://cdn.jsdelivr.net/gh/mar10/assets@master/wunderbaum/tree_department_M_p.json",
                types: {
                    department: { icon: "bi bi-diagram-3", colspan: true },
                    role: { icon: "bi bi-microsoft-teams", colspan: true },
                    person: { icon: "bi bi-person" },
                },
                columns: this.columnsConfig,
                columnsResizable: true,
                columnsSortable: true,

                edit: {
                    trigger: ["clickActive", "F2"], // "macEnter"],
                    select: true,
                    beforeEdit: function (e) {
                        // console.log(e.type, e);
                        // return e.node.type === "person";
                    },
                    edit: function (e) {
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
                init: (e) => { },
                // load: function (e) {
                // },
                buttonClick: function (e) {
                    console.log(e.type, e);
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
                        // Assumption: we named column.id === node.data.NAME

                        // We can hand-code and customize it like so:
                        // switch (colId) {
                        //   case "author":
                        //   case "details":
                        //   case "price":
                        //   case "qty":
                        //   case "sale": // checkbox control
                        //   case "avail": // checkbox control
                        //   case "state": // dropdown
                        //   case "year":
                        //     // e.node.data[colId] = e.inputValue;
                        //     // ... but this helper should work in most cases:
                        //     e.node.data[colId] = util.getValueFromElem(e.inputElem, true);
                        //     break;
                        // }

                        // ... but this helper should work in most cases:
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
        } catch (e) {
            throw new Error(e);
        }
    }

    #buildTree(data) {
        const map = new Map();
        const result = [];
        
        data.forEach(node => {
            map.set(node.ID, { ...node, children: [] });
        });

        data.forEach(node => {
            const current = map.get(node.ID);
            if (current.PID && map.has(current.PID)) {
                const parent = map.get(current.PID);
                parent.children.push(current);
            } else {
                result.push(current);
            }
        });

        return result;
    }

    #generateColumns(customColumns) {
        if (!customColumns.length) return [];
        
        const cellTypeMap = new Map();
        const cols = [];
        customColumns.forEach((item)=> {
            cols.push({
                title: item.Name,
                id: item.Id,
                width: item.Width == null ? "*" : `${item.Width}px`,
                classes: this.columnsStyleType[item.ColumnStyle]
            });
            cellTypeMap.set(item.Id, item.CellType);
        })
        return {cols, cellTypeMap};
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
                innerHTML = '<input type="url" tabindex="-1">';
                break;
            default:
                innerHTML = '<input type="text" tabindex="-1">';
                break;
        }
        
        return innerHTML;
    }

    SetJsonData(json) {
        this.treeData = json;
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);