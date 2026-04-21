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

        this.TreeGridOptionsConfig.treeData = await this.TreeGridOptionsConfig.initializeTreeData();
        this.TreeGridOptionsConfig.buildTreeGridOptions();

        if (this.TreeGridOptionsConfig.bindingDataSourceModel) {
            this.onBindingDataSourceDependenceCellValueChanged(this.TreeGridOptionsConfig.bindingDataSourceModel, async () => {
                await this.TreeGridOptionsConfig.refreshTreeData();
            });
        }
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
                // 设置CSS变量失败，静默处理
            }
        });
    }

    convertToFlatFormat(data, idToIndexMap) {

    }

    SetDataSourceByObjTree(json) {
        const treeData = this.#normalizeJsonValue(json);
        this.TreeGridOptionsConfig.reloadTreeData(Array.isArray(treeData) ? treeData : []);
    }

    SetDataSourceByIdPidTable(json) {
        const rows = this.#normalizeJsonValue(json);
        const treeData = this.TreeGridOptionsConfig.prepareTreeData(Array.isArray(rows) ? rows : []);
        this.TreeGridOptionsConfig.reloadTreeData(treeData);
    }

    GetTreeData() {
        return {
            TreeDataJson: JSON.stringify(this.TreeGridOptionsConfig.getTreeDataSnapshot())
        };
    }

    GetUpdateData() {
        return {
            UpdateDataJson: JSON.stringify(this.TreeGridOptionsConfig.getUpdateDataSnapshot())
        };
    }

    ClearUpdateData() {
        this.TreeGridOptionsConfig.clearUpdateData();
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
        return {
            SelectedDataJson: JSON.stringify(this.TreeGridOptionsConfig.getSelectedDataSnapshot())
        };
    }

    #normalizeJsonValue(value) {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch (error) {
                return [];
            }
        }
        return value;
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);
