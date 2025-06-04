using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.ComponentModel;
using System.Windows;

namespace TreeGridToolPlugin
{
    [Icon("pack://application:,,,/TreeGridToolPlugin;component/Resources/Icon.png")]
    [Designer(typeof(TreeGirdPluginCellTypeDesigner))]
    public class TreeGridToolPluginCellType : CellType
    {
        public string MyProperty { get; set; } = "TreeGridToolPlugin";

        public override string ToString()
        {
            return "树形工具插件单元格";
        }
    }
    
    public class TreeGirdPluginCellTypeDesigner : CellTypeDesigner<TreeGridToolPluginCellType>
    {
        public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            return drawingHelper.GetHeadlessBrowserPreviewControl(); // 使用无头浏览器渲染设计时预览
        }
    }
}
