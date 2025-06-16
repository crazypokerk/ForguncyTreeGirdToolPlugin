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
        [BindingDataSourceProperty(AllowAddCustomColumns = true, Columns = "ID|PID:父ID|Title:标题", IsIdPidStructure = true,
            TreeIdColumnName = "ID", TreePidColumnName = "PID")]
        [DisplayName("绑定数据源")]
        public object DataSource { get; set; }

        public override string ToString()
        {
            return "树形工具单元格";
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