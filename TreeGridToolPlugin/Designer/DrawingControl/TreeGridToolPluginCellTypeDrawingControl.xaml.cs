using GrapeCity.Forguncy.CellTypes;
using System.Windows.Controls;

namespace TreeGridToolPlugin.Designer.DrawingControl
{
    public partial class TreeGridToolPluginCellTypeDrawingControl : UserControl
    {
        public TreeGridToolPluginCellTypeDrawingControl(TreeGridToolPluginCellType cellType, ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            this.DataContext = new TreeGridToolPluginCellTypeDrawingControlViewModel(cellType, cellInfo, drawingHelper);

            InitializeComponent();
        }

        public class TreeGridToolPluginCellTypeDrawingControlViewModel
        {
            TreeGridToolPluginCellType _cellType;
            ICellInfo _cellInfo;
            IDrawingHelper _drawingHelper;
            public TreeGridToolPluginCellTypeDrawingControlViewModel(TreeGridToolPluginCellType cellType, ICellInfo cellInfo, IDrawingHelper drawingHelper)
            {
                _cellType = cellType;
                _cellInfo = cellInfo;
                _drawingHelper = drawingHelper;
            }
            public string Text { get => _cellType.ToString(); }
        }
    }
}
