using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Windows;

namespace TreeGridToolPlugin
{
    [Icon("pack://application:,,,/TreeGridToolPlugin;component/Resources/Icon.png")]
    [Designer(typeof(TreeGirdPluginCellTypeDesigner))]
    public class TreeGridToolPluginCellType : CellType
    {
        [DisplayName("设置JSON数据")]
        [RunTimeMethod]
        [RunTimeMethodDesigner(typeof(SetJsonDataRuntimeMethod))]
        public void SetJsonData([ItemDisplayName("JSON字符串")]string json){}
        
        [DisplayName("列名配置")]
        [ObjectListProperty(ItemType = typeof(ColumnObject))]
        public List<INamedObject> ColumnsProperties { get; set; }
        
        public override string ToString()
        {
            return "树形工具单元格";
        }
    }
    public class ColumnObject : ObjectPropertyBase, INamedObject
    {
        [DisplayName("列名")]
        public string Name { get; set; }
        
        [DisplayName("Json属性名")]
        public string Id { get; set; }
        
        [DisplayName("列宽")]
        public string Width { get; set; }
        
        [DisplayName("列样式")]
        public ColumnClass ColumnStyle { get; set; }
        
        [DisplayName("单元格类型")]
        public CellTypeEnum CellType { get; set; }

        [DisplayName("是否可编辑")]
        public bool Editable { get; set; }
    }
    
    public enum CellTypeEnum
    {
        [Description("文本")]
        Text = 0,
        [Description("数字")]
        Number = 1,
        [Description("日期")]
        Date = 2,
        [Description("复选框")]
        Checkbox = 3,
        [Description("下拉框")]
        Select = 4,
        [Description("链接")]
        Link = 5
    }

    public enum ColumnClass
    {
        [Description("列对齐居中")]
        WbHelperCenter = 0,
        [Description("列禁用样式使用较暗的颜色渲染")]
        WbHelperDisabled = 1,
        [Description("列对齐到左侧")]
        WbHelperStart = 2,
        [Description("列对齐到右侧")]
        WbHelperEnd = 3,
        [Description("隐藏列")]
        WbHelperHidden = 4,
        [Description("列样式渲染为无效样式")]
        WbHelperInvalid = 5,
        [Description("列渲染为链接样式")]
        WbHelperLink = 6,
        // [Description("wb-helper-lazy-expander")]
        // WbHelperLazyExpander
    }

    public class SetJsonDataRuntimeMethod : RunTimeMethodDesigner
    {
        public override string Validate(IRuntimeMethodDesignerContext context)
        {
            return base.Validate(context);
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