using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System.Collections.Generic;
using System.ComponentModel;

namespace TreeGridToolPlugin
{
    [Icon("pack://application:,,,/TreeGridToolPlugin;component/Resources/Icon.png")]
    [Designer(typeof(TreeGridToolPlugin.Designer.TreeGridToolPluginCellTypeDesigner))]
    public class TreeGridToolPluginCellType : CellType
    {
        [DisplayName("数据源模式")]
        [DefaultValue(TreeGridDataSourceMode.FlatTable)]
        public TreeGridDataSourceMode DataSourceMode { get; set; } = TreeGridDataSourceMode.FlatTable;

        [BindingDataSourceProperty(AllowAddCustomColumns = true)]
        [DisplayName("绑定数据源")]
        public object DataSource { get; set; }

        [DisplayName("对象树 JSON")]
        [Description("支持直接输入 JSON 字符串，或输入返回 JSON 字符串/对象树的公式。")]
        [FormulaProperty(CanSelectResource = false)]
        public object ObjectTreeJson { get; set; }

        [DisplayName("平铺表 ID 字段")]
        [DefaultValue("ID")]
        public string FlatIdField { get; set; } = "ID";

        [DisplayName("平铺表父级字段")]
        [DefaultValue("PID")]
        public string FlatParentField { get; set; } = "PID";

        [DisplayName("平铺表标题字段")]
        [DefaultValue("Title")]
        public string FlatTitleField { get; set; } = "Title";

        [DisplayName("平铺表类型字段")]
        [DefaultValue("Type")]
        public string FlatTypeField { get; set; } = "Type";

        [DisplayName("对象树 Key 字段")]
        [Description("可为空。为空时会按树路径自动生成稳定 Key。")]
        [DefaultValue("key")]
        public string ObjectTreeKeyField { get; set; } = "key";

        [DisplayName("对象树标题字段")]
        [DefaultValue("title")]
        public string ObjectTreeTitleField { get; set; } = "title";

        [DisplayName("对象树子节点字段")]
        [DefaultValue("children")]
        public string ObjectTreeChildrenField { get; set; } = "children";

        [DisplayName("对象树类型字段")]
        [DefaultValue("type")]
        public string ObjectTreeTypeField { get; set; } = "type";

        [DisplayName("列配置")]
        [Description("按字段名配置列属性。平铺表模式下填写绑定数据源中的数据列名；对象树模式下填写节点属性名。显示列名可选，不填时默认显示字段名。")]
        [ObjectListProperty(ItemType = typeof(ColumnObject))]
        public List<INamedObject> ColumnsProperties { get; set; }

        [DisplayName("层级配置")]
        [Description("使用类型字段值匹配图标、首列合并和异步加载配置。")]
        [ObjectListProperty(ItemType = typeof(TypeObject))]
        public List<INamedObject> TypesProperties { get; set; }

        [DisplayName("启用复选框")]
        public bool IsCheckbox { get; set; }

        [DisplayName("多选策略")]
        [Description("单行多选表示仅选中当前行，下级多选表示勾选父节点时联动下级。")]
        public MultipleType MultipleProperty { get; set; }

        [DisplayName("启用面包屑导航")]
        public bool ConnectTopBreadcrumb { get; set; }

        [DisplayName("启用行拖拽")]
        public bool IsDragAndDrop { get; set; }

        #region Style configuration

        [DisplayName("表格字体")]
        [FontFamilyProperty]
        public string FontFamily { get; set; }

        [DisplayName("表格背景色")]
        [ColorProperty(SupportNoFill = true, SupportTranslucency = true)]
        public string TreeTableBackgroundColor { get; set; }

        [DisplayName("表格字体颜色")]
        [ColorProperty(SupportNoFill = true, SupportTranslucency = true)]
        public string TreeTableFontColor { get; set; }

        [DisplayName("表格边框颜色")]
        [ColorProperty(SupportNoFill = true, SupportTranslucency = true)]
        public string TreeTableBorderColor { get; set; }

        #endregion

        #region Run Time Method

        [DisplayName("获取树数据")]
        [RunTimeMethod]
        public GetTreeDataJson GetTreeData()
        {
            return new GetTreeDataJson { TreeDataJson = "[]" };
        }

        [DisplayName("获取更新数据")]
        [RunTimeMethod]
        public GetUpdateDataJson GetUpdateData()
        {
            return new GetUpdateDataJson { UpdateDataJson = "[]" };
        }

        [DisplayName("展开/收起所有节点")]
        [RunTimeMethod]
        public void ToggleExpandAll()
        {
        }

        [DisplayName("全选/取消全选")]
        [RunTimeMethod]
        public void ToggleSelectAll()
        {
        }

        [DisplayName("启用/禁用树形表")]
        [RunTimeMethod]
        public void SetTreeDisabled(
            [ItemDisplayName("选择")]
            [ComboProperty(ValueList = "启用|禁用")]
            string enabled)
        {
        }

        [DisplayName("获取选中行数据")]
        [RunTimeMethod]
        public GetSelectedDataJson GetSelectedData()
        {
            return new GetSelectedDataJson { SelectedDataJson = "[]" };
        }

        [DisplayName("清空更新数据")]
        [RunTimeMethod]
        public void ClearUpdateData()
        {
        }

        #endregion

        public override bool GetDesignerPropertyVisible(string propertyName)
        {
            if (propertyName == nameof(MultipleProperty))
            {
                return IsCheckbox;
            }

            if (propertyName == nameof(DataSource) ||
                propertyName == nameof(FlatIdField) ||
                propertyName == nameof(FlatParentField) ||
                propertyName == nameof(FlatTitleField) ||
                propertyName == nameof(FlatTypeField))
            {
                return DataSourceMode == TreeGridDataSourceMode.FlatTable;
            }

            if (propertyName == nameof(ObjectTreeJson) ||
                propertyName == nameof(ObjectTreeKeyField) ||
                propertyName == nameof(ObjectTreeTitleField) ||
                propertyName == nameof(ObjectTreeChildrenField) ||
                propertyName == nameof(ObjectTreeTypeField))
            {
                return DataSourceMode == TreeGridDataSourceMode.ObjectTreeJson;
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

    public class GetTreeDataJson
    {
        public string TreeDataJson { get; set; }
    }

    public class GetSelectedDataJson
    {
        public string SelectedDataJson { get; set; }
    }

    public class ColumnObject : ObjectPropertyBase, INamedObject
    {
        [DisplayName("数据列名")]
        [Description("平铺表模式下填写绑定数据源中的列名；对象树模式下填写节点属性名。")]
        public string Name { get; set; }

        [DisplayName("显示列名")]
        [Description("可选。不填写时默认显示数据列名。")]
        public string HeaderText { get; set; }

        [Browsable(false)]
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
        [Description("图标类名需要在 Bootstrap Icon 中查找，例如：bi bi-person")]
        public string Name { get; set; }

        [DisplayName("类型值")]
        [Description("和数据中的类型字段值匹配。")]
        public string Level { get; set; }

        [DisplayName("首列是否合并整行")]
        [Description("启用后该类型的节点只显示第一列内容。")]
        public bool IsColspan { get; set; }

        [DisplayName("异步加载数据")]
        [Description("仅平铺表模式有效。启用后该类型节点首次只渲染当前层，展开时再装载子节点。")]
        public bool IsAsyncLoadData { get; set; }

        [DisplayName("当前类型行背景色")]
        [ColorProperty(SupportNoFill = true, SupportTranslucency = true)]
        public string CurrentLevelRowBackgroundColor { get; set; }
    }

    public enum TreeGridDataSourceMode
    {
        [Description("平铺表")]
        FlatTable = 0,

        [Description("对象树 JSON")]
        ObjectTreeJson = 1
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
        [Description("列居中")]
        WbHelperCenter = 0,

        [Description("列禁用样式")]
        WbHelperDisabled = 1,

        [Description("列左对齐")]
        WbHelperStart = 2,

        [Description("列右对齐")]
        WbHelperEnd = 3,

        [Description("隐藏列")]
        WbHelperHidden = 4,

        [Description("无效样式")]
        WbHelperInvalid = 5,

        [Description("链接样式")]
        WbHelperLink = 6
    }
}
