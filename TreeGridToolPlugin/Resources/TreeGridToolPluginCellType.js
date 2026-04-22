/// <reference path="../Declarations/forguncy.d.ts" />
/// <reference path="../Declarations/forguncy.Plugin.d.ts" />

class TreeGridToolPluginCellType extends Forguncy.Plugin.CellTypeBase {
    TreeGridOptionsConfig;

    SOURCE_MODE = {
        FLAT: 0,
        OBJECT_TREE: 1
    };

    createContent() {
        const cellType = this.CellElement.CellType;
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

        this.#updateWunderbaumStyles(cellType);

        const columnsConfigObj = generateColumns(cellType.ColumnsProperties, this.#getConfiguredTitleField(cellType));
        const treeGridOptionsFirstNeededParams = {
            TreeGridToolPluginCellType: this,
            sourceMode: cellType.DataSourceMode,
            typesProperties: cellType.TypesProperties,
            columnsConfigObj: columnsConfigObj,
            columnsProperties: cellType.ColumnsProperties,
            checkbox: cellType.IsCheckbox === undefined ? false : cellType.IsCheckbox,
            dragAndDrop: cellType.IsDragAndDrop === undefined ? false : cellType.IsDragAndDrop,
            selectMode: cellType.MultipleProperty,
            connectTopBreadcrumb: cellType.ConnectTopBreadcrumb === undefined ? false : cellType.ConnectTopBreadcrumb,
            flatConfig: {
                idField: cellType.FlatIdField || "ID",
                parentField: cellType.FlatParentField || "PID",
                titleField: cellType.FlatTitleField || "Title",
                typeField: cellType.FlatTypeField || "Type"
            },
            objectTreeConfig: {
                jsonFormula: cellType.ObjectTreeJson || "",
                keyField: cellType.ObjectTreeKeyField || "key",
                titleField: cellType.ObjectTreeTitleField || "title",
                childrenField: cellType.ObjectTreeChildrenField || "children",
                typeField: cellType.ObjectTreeTypeField || "type"
            }
        };

        this.TreeGridOptionsConfig = new TreeGridOptionsConfig(treeGridOptionsFirstNeededParams);
        return $outer;
    }

    async onPageLoaded() {
        const cellType = this.CellElement.CellType;
        this.TreeGridOptionsConfig.bindingDataSourceModel = cellType.DataSource;
        this.TreeGridOptionsConfig.treeDom = document.getElementById("fgc-tree-table");

        const initialSourceValue = this.#getInitialSourceValue(cellType);
        this.TreeGridOptionsConfig.treeData = await this.TreeGridOptionsConfig.initializeTreeData(initialSourceValue);
        this.TreeGridOptionsConfig.buildTreeGridOptions();
        this.#registerSourceWatchers(cellType);
    }

    #registerSourceWatchers(cellType) {
        if (this.TreeGridOptionsConfig.isFlatMode()) {
            if (this.TreeGridOptionsConfig.bindingDataSourceModel) {
                this.onBindingDataSourceDependenceCellValueChanged(this.TreeGridOptionsConfig.bindingDataSourceModel, async () => {
                    await this.TreeGridOptionsConfig.refreshTreeData();
                });
            }
            return;
        }

        const jsonFormula = cellType.ObjectTreeJson;
        if (typeof jsonFormula === "string" && jsonFormula.trim().startsWith("=")) {
            this.onFormulaResultChanged(jsonFormula, async value => {
                await this.TreeGridOptionsConfig.refreshTreeData(this.#normalizeJsonValue(value));
            }, false);
        }
    }

    #getInitialSourceValue(cellType) {
        if (cellType.DataSourceMode === this.SOURCE_MODE.OBJECT_TREE) {
            const rawValue = typeof cellType.ObjectTreeJson === "string" && cellType.ObjectTreeJson.trim().startsWith("=")
                ? this.evaluateFormula(cellType.ObjectTreeJson)
                : cellType.ObjectTreeJson;
            return this.#normalizeJsonValue(rawValue);
        }
        return null;
    }

    #getConfiguredTitleField(cellType) {
        if (cellType.DataSourceMode === this.SOURCE_MODE.OBJECT_TREE) {
            return cellType.ObjectTreeTitleField || "title";
        }
        return cellType.FlatTitleField || "Title";
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
            }
        });
    }

    SetDataSourceByObjTree(json) {
        const treeData = this.#normalizeJsonValue(json);
        this.TreeGridOptionsConfig.reloadTreeData(this.TreeGridOptionsConfig.prepareObjectTreeData(treeData));
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
        const firstNode = this.TreeGridOptionsConfig.ForguncyTree.getFirstChild();
        if (!firstNode) {
            return;
        }
        this.TreeGridOptionsConfig.ForguncyTree.expandAll(!firstNode.isExpanded());
    }

    ToggleSelectAll() {
        if (this.TreeGridOptionsConfig.checkbox) {
            this.TreeGridOptionsConfig.ForguncyTree.toggleSelect();
        }
    }

    SetTreeDisabled(enabled) {
        this.TreeGridOptionsConfig.ForguncyTree.setOption("enabled", enabled !== "禁用");
    }

    GetSelectedData() {
        return {
            SelectedDataJson: JSON.stringify(this.TreeGridOptionsConfig.getSelectedDataSnapshot())
        };
    }

    #normalizeJsonValue(value) {
        if (typeof value === "string") {
            const trimmedValue = value.trim();
            if (!trimmedValue) {
                return [];
            }
            try {
                return JSON.parse(trimmedValue);
            } catch (error) {
                return [];
            }
        }
        return value;
    }
}

Forguncy.Plugin.CellTypeHelper.registerCellType("TreeGridToolPlugin.TreeGridToolPluginCellType, TreeGridToolPlugin", TreeGridToolPluginCellType);
