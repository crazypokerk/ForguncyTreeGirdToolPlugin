/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    treeData;

    createContent() {
        // 构建 Jquery Dom 并返回
        const $main = $("<main>").addClass("view");

        const $output = $("<output>")
            .attr("id", "parentPath")
            .addClass("hide-on-welcome hidden");

        const $div = $("<div>")
            .attr("id", "demo-tree")
            .addClass("wb-skeleton wb-initializing wb-no-select");
        // 组装结构
        $main.append($output).append($div);

        return $main;
    }

    #getBindingDataSourceValueAsync(datasource) {
        return new Promise((resolve, reject) => {
            this.getBindingDataSourceValue(datasource, null, data => {
                resolve(data);
            });
        });
    }
    async onPageLoaded() {
        const datasource = this.CellElement.CellType.DataSource;
        let treeColumns = [];
        let json = [
            {
                "title": "Books",
                "type": "folder",
                "details": "A collection of books from various genres.",
                "expanded": true,
                "children": [
                    {
                        "title": "Art of War",
                        "type": "book",
                        "expanded": true,
                        "author": "Sun Tzu",
                        "year": -500,
                        "qty": 21,
                        "price": 5.95,
                        "children": [
                            {"title": "Chapter 1", "type": "chapter", "qty": 1, "price": 0.99},
                            {"title": "Chapter 2", "type": "chapter", "qty": 1, "price": 0.99},
                            {"title": "Chapter 3", "type": "chapter", "qty": 1, "price": 0.99},
                            {"title": "Chapter 4", "type": "chapter", "qty": 1, "price": 0.99},
                            {"title": "Chapter 5", "type": "chapter", "qty": 1, "price": 0.99},
                        ]
                    },
                    {
                        "title": "The Hobbit",
                        "type": "book",
                        "author": "J.R.R. Tolkien",
                        "year": 1937,
                        "qty": 32,
                        "price": 8.97
                    },
                    {
                        "title": "The Little Prince",
                        "type": "book",
                        "author": "Antoine de Saint-Exupery",
                        "year": 1943,
                        "qty": 2946,
                        "price": 6.82
                    },
                    {
                        "title": "Don Quixote",
                        "type": "book",
                        "author": "Miguel de Cervantes",
                        "year": 1615,
                        "qty": 932,
                        "price": 15.99
                    }
                ]
            },
            {
                "title": "Music",
                "type": "folder",
                "children": [
                    {
                        "title": "Nevermind",
                        "type": "music",
                        "author": "Nirvana",
                        "year": 1991,
                        "qty": 916,
                        "price": 15.95
                    },
                    {
                        "title": "Autobahn",
                        "type": "music",
                        "author": "Kraftwerk",
                        "year": 1974,
                        "qty": 2261,
                        "price": 23.98
                    },
                    {
                        "title": "Kind of Blue",
                        "type": "music",
                        "author": "Miles Davis",
                        "year": 1959,
                        "qty": 9735,
                        "price": 21.9
                    },
                    {
                        "title": "Back in Black",
                        "type": "music",
                        "author": "AC/DC",
                        "year": 1980,
                        "qty": 3895,
                        "price": 17.99
                    },
                    {
                        "title": "The Dark Side of the Moon",
                        "type": "music",
                        "author": "Pink Floyd",
                        "year": 1973,
                        "qty": 263,
                        "price": 17.99
                    },
                    {
                        "title": "Sgt. Pepper's Lonely Hearts Club Band",
                        "type": "music",
                        "author": "The Beatles",
                        "year": 1967,
                        "qty": 521,
                        "price": 13.98
                    }
                ]
            },
            {
                "title": "Electronics & Computers",
                "expanded": true,
                "type": "folder",
                "children": [
                    {
                        "title": "Cell Phones",
                        "type": "folder",
                        "children": [
                            {
                                "title": "Moto G",
                                "type": "phone",
                                "author": "Motorola",
                                "year": 2014,
                                "qty": 332,
                                "price": 224.99
                            },
                            {
                                "title": "Galaxy S8",
                                "type": "phone",
                                "author": "Samsung",
                                "year": 2016,
                                "qty": 952,
                                "price": 509.99
                            },
                            {
                                "title": "iPhone SE",
                                "type": "phone",
                                "author": "Apple",
                                "year": 2016,
                                "qty": 444,
                                "price": 282.75
                            },
                            {
                                "title": "G6",
                                "type": "phone",
                                "author": "LG",
                                "year": 2017,
                                "qty": 951,
                                "price": 309.99
                            },
                            {
                                "title": "Lumia",
                                "type": "phone",
                                "author": "Microsoft",
                                "year": 2014,
                                "qty": 32,
                                "price": 205.95
                            },
                            {
                                "title": "Xperia",
                                "type": "phone",
                                "author": "Sony",
                                "year": 2014,
                                "qty": 77,
                                "price": 195.95
                            },
                            {
                                "title": "3210",
                                "type": "phone",
                                "author": "Nokia",
                                "year": 1999,
                                "qty": 3,
                                "price": 85.99
                            }
                        ]
                    },
                    {
                        "title": "Computers",
                        "type": "folder",
                        "children": [
                            {
                                "title": "ThinkPad",
                                "type": "computer",
                                "author": "IBM",
                                "year": 1992,
                                "qty": 16,
                                "price": 749.9
                            },
                            {
                                "title": "C64",
                                "type": "computer",
                                "author": "Commodore",
                                "year": 1982,
                                "qty": 83,
                                "price": 595
                            },
                            {
                                "title": "MacBook Pro",
                                "type": "computer",
                                "author": "Apple",
                                "year": 2006,
                                "qty": 482,
                                "price": 1949.95
                            },
                            {
                                "title": "Sinclair ZX Spectrum",
                                "type": "computer",
                                "author": "Sinclair Research",
                                "year": 1982,
                                "qty": 1,
                                "price": 529
                            },
                            {
                                "title": "Apple II",
                                "type": "computer",
                                "author": "Apple",
                                "year": 1977,
                                "qty": 17,
                                "price": 1298
                            },
                            {
                                "title": "PC AT",
                                "type": "computer",
                                "author": "IBM",
                                "year": 1984,
                                "qty": 3,
                                "price": 1235
                            }
                        ]
                    }
                ]
            },
        ]
        
        try {
            const data = await this.#getBindingDataSourceValueAsync(datasource);
            let datasourceColumnsNameArray = datasource.CustomColumns;
            datasourceColumnsNameArray.push("ID");
            treeColumns = this.#generateColumns(data);

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

                // The JSON only contains a list of nested node dicts, but no types or
                // column definitions:
                source:
                    "https://cdn.jsdelivr.net/gh/mar10/assets@master/wunderbaum/tree_department_M_p.json",
                types: {
                    department: { icon: "bi bi-diagram-3", colspan: true },
                    role: { icon: "bi bi-microsoft-teams", colspan: true },
                    person: { icon: "bi bi-person" },
                },
                // The `html` properties are shown as comments.
                // If enabled, it would be used as markup, so `if (e.isNew) {...}` could be
                // omitted in the `render` callback:
                columns: [
                    {
                        title: "Title",
                        id: "*",
                        width: "250px",
                    },
                    {
                        title: "Age",
                        id: "age",
                        width: "50px",
                        classes: "wb-helper-end",
                        //"html": "<input type=number min=0 tabindex='-1'>",
                    },
                    {
                        title: "Date",
                        id: "date",
                        width: "100px",
                        classes: "wb-helper-end",
                        // "html": '<input type=date tabindex="-1">',
                    },
                    {
                        title: "Status",
                        id: "state",
                        width: "70px",
                        classes: "wb-helper-center",
                        // "html": `<select tabindex="-1">
                        //     <option value="h">Happy</option>
                        //     <option value="s">Sad</option>
                        //     </select>`
                    },
                    {
                        title: "Avail.",
                        id: "avail",
                        width: "80px",
                        classes: "wb-helper-center",
                        // "html": '<input type=checkbox tabindex="-1">',
                    },
                    {
                        title: "Remarks",
                        id: "remarks",
                        width: "*",
                        // "html": "<input type=text tabindex='-1'>",

                        menu: true,
                    },
                ],
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
                render: function (e) {
                    // console.log(e.type, e.isNew, e);
                    const node = e.node;
                    const util = e.util;

                    // Render embedded input controls for all data columns
                    for (const col of Object.values(e.renderColInfosById)) {
                        // Assumption: we named column.id === node.data.NAME
                        const val = node.data[col.id];

                        switch (col.id) {
                            case "author":
                                if (e.isNew) {
                                    col.elem.innerHTML = '<input type="text" tabindex="-1">';
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            case "remarks": // text control
                                if (e.isNew) {
                                    col.elem.innerHTML = '<input type="text" tabindex="-1">';
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            // case "details": // text control
                            //   if (e.isNew) {
                            //     col.elem.innerHTML = '<input type="text" tabindex="-1">';
                            //   }
                            //   util.setValueToElem(col.elem, node.data.details);
                            //   break;
                            // case "price":
                            //   if (e.isNew) {
                            //     col.elem.innerHTML = '<input type="number" min="0.00" step="0.01" tabindex="-1">';
                            //   }
                            //   util.setValueToElem(col.elem, node.data.price.toFixed(2));
                            //   break;
                            case "age":
                                if (e.isNew) {
                                    col.elem.innerHTML = '<input type="number" min="0" tabindex="-1">';
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            case "state":
                                if (e.isNew) {
                                    col.elem.innerHTML = `<select tabindex="-1">
                <option value="h">Happy</option>
                <option value="s">Sad</option>
                </select>`;
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            case "avail":
                                if (e.isNew) {
                                    col.elem.innerHTML = '<input type="checkbox" tabindex="-1">';
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            // case "qty":
                            //   if (e.isNew) {
                            //     col.elem.innerHTML = '<input type="number" min="0" tabindex="-1">';
                            //   }
                            //   util.setValueToElem(col.elem, val);
                            //   break;
                            // case "sale": // checkbox control
                            //   if (e.isNew) {
                            //     col.elem.innerHTML = '<input type="checkbox" tabindex="-1">';
                            //   }
                            //   // Cast value to bool, since we don't want tri-state behavior
                            //   util.setValueToElem(col.elem, !!val);
                            //   break;
                            case "date":
                                if (e.isNew) {
                                    col.elem.innerHTML = '<input type="date" tabindex="-1">';
                                }
                                util.setValueToElem(col.elem, val);
                                break;
                            // case "year":
                            //   if (e.isNew) {
                            //     col.elem.innerHTML = '<input type="number" max="9999" tabindex="-1">';
                            //   }
                            //   util.setValueToElem(col.elem, node.data.year);
                            //   break;
                            default:
                                // Assumption: we named column.id === node.data.NAME
                                col.elem.textContent = node.data[col.id];
                                break;
                        }
                    }
                },
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    #generateColumns(data) {
        if (!data.length) return [];

        // 1. 获取所有字段名，并排除 ID 和 PID
        const keys = Object.keys(data[0]);
        const filteredKeys = keys.filter(key => !['ID', 'PID'].includes(key));

        // 2. 生成列配置数组
        return filteredKeys.map(key => {
            const title = key.charAt(0).toUpperCase() + key.slice(1); // 首字母大写
            const id = key.toLowerCase(); // id 为字段名小写
            if(key === "product"){
                return {id: "*", title: "Product"}
            }

            // 3. 根据字段名设置默认配置（可扩展）
            const column = {id, title};

            return column;
        });
    }

    #buildTree(data, idKey = 'ID', parentKey = 'PID', rootValue = null) {
        const map = _.keyBy(data, idKey); // 建立 ID 到节点的映射
        const tree = [];

        _.forEach(data, (item) => {
            const parentId = item[parentKey];
            const parent = map[parentId];

            if (parentId === rootValue || !parent) {
                // 根节点
                tree.push(item);
            } else {
                // 子节点，加入父节点的 children 数组
                parent.children = parent.children || [];
                parent.children.push(item);
            }
        });

        return tree;
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);