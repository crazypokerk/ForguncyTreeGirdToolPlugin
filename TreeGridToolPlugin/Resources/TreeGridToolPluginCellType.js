/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    TreeGridOptionsConfig;

    createContent() {
        const $outer = $("<div style='width:100%;height:100%'>")
            .attr("id", "outer")
            .addClass("outer");
        const $main = $("<main>").addClass("view");
        const $output = $("<output>")
            .attr("id", "parentPath")
            .addClass("hide-on-welcome hidden");
        const $div = $("<div>")
            .attr("id", "fgc-tree-table")
            .addClass("wb-skeleton wb-no-select wunderbaum wb-grid wb-ext-keynav wb-ext-edit wb-ext-filter wb-ext-dnd wb-ext-grid wb-cell-mode");
        $outer.append($main).append($output).append($div);

        /**
         * STYLE
         */
        this.#updateWunderbaumStyles.call(this, this.CellElement.CellType);

        let columnsConfigObj = generateColumns(this.CellElement.CellType.ColumnsProperties);
        let treeGridOptionsFirstNeededParams = {
            TreeGridToolPluginCellType: this,
            typesProperties: this.CellElement.CellType.TypesProperties,
            columnsConfigObj: columnsConfigObj,
            columnsProperties: this.CellElement.CellType.ColumnsProperties,
            checkbox: this.CellElement.CellType.IsCheckbox === undefined ? false : this.CellElement.CellType.IsCheckbox,
            dragAndDrop: this.CellElement.CellType.IsDragAndDrop === undefined ? false : this.CellElement.CellType.IsDragAndDrop,
            selectMode: this.CellElement.CellType.MultipleProperty,
            connectTopBreadcrumb: this.CellElement.CellType.ConnectTopBreadcrumb === undefined ? false : this.CellElement.CellType.ConnectTopBreadcrumb,
        }

        this.TreeGridOptionsConfig = new TreeGridOptionsConfig(treeGridOptionsFirstNeededParams);
        return $outer;
    }

    async onPageLoaded() {
        this.TreeGridOptionsConfig.bindingDataSourceModel = this.CellElement.CellType.DataSource;
        this.TreeGridOptionsConfig.treeDom = document.getElementById("fgc-tree-table");

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
        
        // first loading
        this.TreeGridOptionsConfig.treeData = await this.TreeGridOptionsConfig.getBindingDataWithOptions(queryDataOption, 0);
        this.TreeGridOptionsConfig.buildTreeGridOptions();

        // value changed loading
        this.onBindingDataSourceDependenceCellValueChanged(this.TreeGridOptionsConfig.bindingDataSourceModel, async () => {
            this.TreeGridOptionsConfig.treeData = await this.TreeGridOptionsConfig.getBindingDataWithOptions(queryDataOption, 0);
            this.TreeGridOptionsConfig.reloadTreeData(this.TreeGridOptionsConfig.treeData);
        });
    }

    #updateWunderbaumStyles(cellType) {
        const styleMapping = {
            FontFamily: "--wb-font-stack",
            TreeTableBackgroundColor: "--wb-background-color",
            TreeTableFontColor: "--wb-node-text-color",
            TreeTableBorderColor: "--wb-border-color"
        };

        const defaultValueMap = {
            "--wb-font-stack": "Helvetica, sans-serif",
            "--wb-background-color": "#ffffff"
        };

        Object.entries(styleMapping).forEach(([propKey, cssVar]) => {
            try {
                let value = Forguncy.ConvertToCssColor(cellType?.[propKey]);
                if (value == null && cssVar in defaultValueMap) {
                    value = defaultValueMap[cssVar];
                }
                if (value != null) {
                    document.documentElement.style.setProperty(cssVar, value);
                }
            } catch (error) {
                console.error(`Failed to set CSS variable ${cssVar}:`, error);
            }
        });
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