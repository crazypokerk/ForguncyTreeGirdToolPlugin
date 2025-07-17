/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    TreeGridOptionsConfig;

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
        
        let columnsConfigObj = generateColumns(this.CellElement.CellType.ColumnsProperties);
        let treeGridOptionsFirstNeededParams = {
            TreeGridToolPluginCellType: this,
            typesProperties: this.CellElement.CellType.TypesProperties,
            columnsConfigObj: columnsConfigObj,
            columnsProperties: this.CellElement.CellType.ColumnsProperties,
            checkbox: this.CellElement.CellType.IsCheckbox === undefined ? false : this.CellElement.CellType.IsCheckbox,
            selectMode: "multi",
            connectTopBreadcrumb: this.CellElement.CellType.ConnectTopBreadcrumb === undefined ? null : this.CellElement.CellType.ConnectTopBreadcrumb,
        }
        
        this.TreeGridOptionsConfig = new TreeGridOptionsConfig(treeGridOptionsFirstNeededParams);
        return $outer;
    }

    async onPageLoaded() {
        this.TreeGridOptionsConfig.bindingDataSourceModel = this.CellElement.CellType.DataSource;
        this.TreeGridOptionsConfig.treeDom = document.getElementById("demo-tree");
        
        let queryConditions = [];
        let relationType = 1;
        this.TreeGridOptionsConfig.levelMap.forEach((value, key) => {
            if (value.asyncLoadData) {
                queryConditions.push({columnName: "Type", compareType: 0, compareValue: key})
            }
        })
        let queryDataOption = {
            queryConditions: queryConditions,
            relationType
        };

        this.TreeGridOptionsConfig.treeData = await this.TreeGridOptionsConfig.getBindingDataWithOptions(queryDataOption, 0);
        this.TreeGridOptionsConfig.buildTreeGridOptions();
    }
    
    convertToFlatFormat(data, idToIndexMap) {
        
    }
    
    SetTreeData(json) {
        this.TreeGridOptionsConfig.treeData = json;
    }

    GetTreeData() {
        if (this.TreeGridOptionsConfig.treeData === null) return;
        this.TreeGridOptionsConfig.treeData.toDictArray();
    }

    GetUpdateData() {
        const obj = {};
        for (const [key, value] of this.TreeGridOptionsConfig.updateData.entries()) {
            if (typeof key === 'string' || typeof key === 'number') {
                obj[key] = value;
            }
        }
        return {UpdateDataJson: JSON.stringify(obj)}
    }

    ToggleExpandAll() {
        this.TreeGridOptionsConfig.ForguncyTree.expandAll(!this.TreeGridOptionsConfig.ForguncyTree.getFirstChild().isExpanded());
    }

    ToggleSelectAll() {
        if (this.TreeGridOptionsConfig.checkbox) {
            this.TreeGridOptionsConfig.ForguncyTree.toggleSelect();
        }
    }

    SetTreeDisabled(enabled) {
        if (enabled === '禁用') {
            this.TreeGridOptionsConfig.ForguncyTree.setOption("enabled", false);
        } else {
            this.TreeGridOptionsConfig.ForguncyTree.setOption("enabled", true);
        }
    }

    GetSelectedData() {
        let selectedNodes = this.TreeGridOptionsConfig.ForguncyTree.getSelectedNodes();
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