using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using System;
using System.ComponentModel;

namespace TreeGridToolPlugin
{
    [Icon("pack://application:,,,/TreeGridToolPlugin;component/Resources/Icon.png")]
    [Designer("TreeGridToolPlugin.Designer.TreeGridToolPluginCommandDesigner, TreeGridToolPlugin")]
    public class TreeGridToolPluginCommand : Command
    {
        [DisplayName("命令属性")]
        [FormulaProperty]
        public object MyProperty { get; set; }

        public override string ToString()
        {
            return "树形工具命令";
        }
    }
}
