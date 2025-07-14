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
        [BindingDataSourceProperty(
            AllowAddCustomColumns = true,
            Columns = "ID|PID|Type|Title",
            ColumnsDescription = "ID:ID列|PID:父级ID列|Type:图标列|Title:标题列",
            IsIdPidStructure = true, 
            TreeIdColumnName = "ID", 
            TreePidColumnName = "PID"
            )]
        [DisplayName("绑定数据源")]
        public object DataSource { get; set; }
        
        [DisplayName("列名配置")]
        [Description("注意，列名配置的列名属性值必须与绑定数据源的列名一致，否则会导致数据显示异常")]
        [ObjectListProperty(ItemType = typeof(ColumnObject))]
        public List<INamedObject> ColumnsProperties { get; set; }
        
        [DisplayName("图标配置")]
        [Description("此配置用于配置树型表每一层级的图标样式，注意，图标配置的层级属性值必须与绑定数据源的层级一致，否则会导致数据显示异常")]
        [ObjectListProperty(ItemType = typeof(TypeObject))]
        public List<INamedObject> TypesProperties { get; set; }
        
        [DisplayName("是否开启选择行")]
        public bool IsCheckbox { get; set; }
        
        [DisplayName("多选时策略")]
        [Description("多选时策略，默认为单行多选，即每次只能选择一行数据，如需多选下级数据，请选择下级多选")]
        public MultipleType MultipleProperty { get; set; }
        
        [DisplayName("开启面包屑导航")]
        public bool ConnectTopBreadcrumb { get; set; }
        
        [DisplayName("设置数据")]
        [RunTimeMethod]
        public void SetTreeData()
        { }
        
        [DisplayName("获取数据")]
        [RunTimeMethod]
        public void GetTreeData()
        { }
        
        [DisplayName("获取更新数据")]
        [RunTimeMethod]
        public GetUpdateDataJson GetUpdateData()
        {
            return null;
        }
        
        [DisplayName("展开/收起所有节点")]
        [RunTimeMethod]
        public void ToggleExpandAll()
        { }
        
        [DisplayName("全选/取消全选")]
        [RunTimeMethod]
        public void ToggleSelectAll()
        { }

        [DisplayName("启用/禁用树形表")]
        [RunTimeMethod]
        public void SetTreeDisabled(
            [ItemDisplayName("选择")]
            [ComboProperty(ValueList = "启用|禁用")]
            string enabled)
        { }

        [DisplayName("获取选中行数据")]
        [RunTimeMethod]
        public GetSelectedDataJson GetSelectedData()
        {
            return null;
        }

        public override bool GetDesignerPropertyVisible(string propertyName)
        {
            if (propertyName == nameof(MultipleProperty))
            {
                return IsCheckbox;
            }
            return base.GetDesignerPropertyVisible(propertyName);
        }

        public override string ToString()
        {
            return "树形工具单元格";
        }
    }

    public class GetUpdateDataJson
    {
        public string UpdateDataJson { get; set; }
    }
    
    public class GetSelectedDataJson
    {
        public string SelectedDataJson { get; set; }
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
        [DefaultValue(false)]
        public bool Editable { get; set; }
    }

    public class TypeObject : ObjectPropertyBase, INamedObject
    {
        [DisplayName("图标类名")]
        [Description("图标类名需要在Bootstrap Icon中查找，例如：bi bi-person")]
        public string Name { get; set; }
        
        [DisplayName("层级")]
        [Description("层级从1开始，层级为1的图标会显示第一层级的行，层级为2的图标会显示在第二层级的行，以此类推")]
        public string Level { get; set; }
        
        [DisplayName("是否首行单元格合并为一行")]
        [Description("如果当前行只需要展示第一行数据，可以合并当前行的列，默认值为false")]
        public bool IsColspan { get; set; }
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
        [Description("时间")]
        Link = 5
    }
    
    public enum MultipleType
    {
        [Description("单行多选")]
        Multi = 0,
        [Description("下级多选")]
        Hier = 1
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
    
    public enum CheckboxType
    {
        [Description("复选框")]
        Checkbox = 0,
        [Description("单选框")]
        Radio = 1
    }
    
    public class TreeGirdPluginCellTypeDesigner : CellTypeDesigner<TreeGridToolPluginCellType>
    {
        public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            return drawingHelper.GetHeadlessBrowserPreviewControl(); // 使用无头浏览器渲染设计时预览
        }
    }
}