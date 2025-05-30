using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.ComponentModel;

namespace TreeGridToolPlugin
{
    [Icon("pack://application:,,,/TreeGridToolPlugin;component/Resources/Icon.png")]
    [Designer("TreeGridToolPlugin.Designer.TreeGridToolPluginCellTypeDesigner, TreeGridToolPlugin")]
    public class TreeGridToolPluginCellType : CellType
    {
        public string MyProperty { get; set; } = "TreeGridToolPlugin";

        public override string ToString()
        {
            return "树形工具插件单元格";
        }
    }
}
