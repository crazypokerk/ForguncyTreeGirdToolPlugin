using TreeGridToolPlugin.Designer.DrawingControl;
using GrapeCity.Forguncy.CellTypes;
using System.Windows;

namespace TreeGridToolPlugin.Designer
{
    public class TreeGridToolPluginCellTypeDesigner : CellTypeDesigner<TreeGridToolPluginCellType>
    {
        public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            return new TreeGridToolPluginCellTypeDrawingControl(this.CellType, cellInfo, drawingHelper);
        }
    }
}
