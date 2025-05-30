/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
     createContent() {
        
        // 构建 Jquery Dom 并返回
        const div = $("<div id='demo-tree'>" + "<div>");
        return div;
    }

    onPageLoaded() {
        let data = [
            {
                title: "Node 1",
                expanded: true,
                children: [
                    {
                        title: "Node 1.1",
                    },
                    {
                        title: "Node 1.2",
                    },
                ],
            },
            {
                title: "Node 2",
            },
        ];
        new mar10.Wunderbaum({
            element: document.getElementById("demo-tree"),
            source: data,
            init: (e) => {
                e.tree.setFocus();
            },
            activate: (e) => {
                alert(`Thank you for activating ${e.node}.`);
            },
        });
    }
}
Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);