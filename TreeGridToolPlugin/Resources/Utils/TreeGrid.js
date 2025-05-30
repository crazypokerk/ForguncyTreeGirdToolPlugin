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
                    { "title": "Chapter 1", "type": "chapter", "qty": 1, "price": 0.99 },
                    { "title": "Chapter 2", "type": "chapter", "qty": 1, "price": 0.99 },
                    { "title": "Chapter 3", "type": "chapter", "qty": 1, "price": 0.99 },
                    { "title": "Chapter 4", "type": "chapter", "qty": 1, "price": 0.99 },
                    { "title": "Chapter 5", "type": "chapter", "qty": 1, "price": 0.99 },
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
    {
        "title": "More...",
        "type": "folder",
        "lazy": true
    }
]

let treeGrid = new mar10.Wunderbaum({
    id: "demo",
    element: document.getElementById("demo-tree"),
    source: json,
    debugLevel: 5,
    connectTopBreadcrumb: "output#parentPath",
    checkbox: true,
    minExpandLevel: 1,
    // iconMap: "fontawesome6",
    // fixedCol: true,
    // Types are sent as part of the source data:
    navigationModeOption: "startRow",
    types: {},
    columns: [
        { id: "*", title: "Product", width: "250px" },
        {
            id: "author",
            title: "Author",
            width: 1,
            minWidth: "100px",
        },
        {
            id: "year",
            title: "Year",
            width: "50px",
            classes: "wb-helper-end",
        },
        {
            id: "qty",
            title: "Qty",
            width: "50px",
            classes: "wb-helper-end",
        },
        {
            id: "price",
            title: "Price ($)",
            width: "80px",
            classes: "wb-helper-end",
        },
        // In order to test horizontal scrolling, we need a fixed or at least minimal width:
        { id: "details", title: "Details", width: 3, minWidth: "200px" },
    ],
    columnsResizable: true,
    columnsSortable: true,
    dnd: {
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
            console.log("Drop " + e.sourceNode + " => " + e.region + " " + e.node);
            e.sourceNode.moveTo(e.node, e.suggestedDropMode);
        },
    },
    edit: {
        trigger: ["clickActive", "F2", "macEnter"],
        select: true,
        beforeEdit: function (e) {
            console.log(e.type, e);
            // return false;
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
        connect: {
            inputElem: "#filter-query",
            // modeButton: "#filter-hide",  // using a custom handler
            nextButton: "#filter-next",
            prevButton: "#filter-prev",
            matchInfoElem: "#filter-match-info",
        },
        // mode: "dim",
    },
    init: (e) => {
        console.log(e.type, e);
        e.tree.findFirst("More...").setExpanded();
        e.tree
            .findFirst((n) => {
                return n.data.qty === 21;
            })
            .setActive();
        // e.tree.setFocus();
    },
    load: (e) => {
        console.log(e.type, e);
        // e.tree.addChildren({ title: "custom1", classes: "wb-error" });
    },
    buttonClick: function (e) {
        console.log(e.type, e);
        if (e.command === "sort") {
            e.tree.sortByProperty({ colId: e.info.colId, updateColInfo: true });
        }
    },
    lazyLoad: function (e) {
        console.log(e.type, e);
        // return { url: "../assets/json/ajax-lazy-products.json" };
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject("Epic fail")
                // resolve({ url: "../assets/json/ajax-lazy-products.json", params: {foo: 42} , options:{method: "PUT"}});
                resolve({ url: "./assets/json/ajax-lazy-products.json" });
            }, 1500);
        });
    },
    render: function (e) {
        // console.log(e.type, e.isNew, e);
        const node = e.node;
        // const util = e.util;

        for (const col of Object.values(e.renderColInfosById)) {
            switch (col.id) {
                default:
                    // Assumption: we named column.id === node.data.NAME
                    col.elem.textContent = node.data[col.id];
                    break;
            }
        }
    },
});

export default treeGrid;