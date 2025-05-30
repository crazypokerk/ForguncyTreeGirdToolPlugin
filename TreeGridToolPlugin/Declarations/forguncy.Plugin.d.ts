/// <reference path="./forguncy.d.ts" />

/**
 */
declare namespace Forguncy.Plugin {
    /**
     * 单元格的水平对齐方式。
     */
    enum CellHorizontalAlignment {
        /**
         * 左对齐。
         */
        Left = 0,
        /**
         * 居中对齐。
         */
        Center = 1,
        /**
         * 右对齐。
         */
        Right = 2,
        /**
         * 默认对齐方式。
         */
        General = 3,
    }

    /**
     * 单元格的垂直对齐方式
     */
    enum CellVerticalAlignment {
        /**
         * 顶部对齐
         */
        Top = 0,
        /**
         * 居中对齐
         */
        Center = 1,
        /**
         * 底部对齐
         */
        Bottom = 2,
    }

    /**
     * 单元格在设计器中设置的样式数据。
     */
    interface StyleMetaData {
        /**
         * 单元格的字体。
         */
        FontFamily?: string;
        /**
         * 单元格的字体大小。
         */
        FontSize?: number;
        /**
         * 单元格的字体粗细，值为`Bold`或`Normal`。
         */
        FontWeight?: string;
        /**
         * 单元格的字体风格，值为`Italic`或`Normal`。
         */
        FontStyle?: string;
        /**
         * 单元格是否显示下划线。
         */
        Underline?: boolean;
        /**
         * 单元格是否显示删除线。
         */
        Strikethrough?: boolean;
        /**
         * 单元格的背景颜色。
         */
        Background?: string;
        /**
         * 单元格的字体颜色。
         */
        Foreground?: string;
        /**
         * 单元格的水平对齐方式。
         */
        HorizontalAlignment?: CellHorizontalAlignment;
        /**
         * 单元格的垂直对齐方式。
         */
        VerticalAlignment?: CellVerticalAlignment;

        /**
         * 单元格是否设置折行。
         */
        WordWrap?: boolean;

        /**
         * 单元格格式字符串。
         */
        Formatter?: string;
    }

    /**
     * 表示在设计器中设计的单元格 UI 元素。
     */
    interface CellContentElement<T = object> {
        /**
         * C# 单元格类型的属性。
         */
        CellType?: T;
        /**
         * 设计器中设置的单元格的样式信息。
         */
        StyleInfo: StyleMetaData;
        /**
         * 单元格的快速样式模板。
         */
        StyleTemplate?: CellTypeStyleTemplate;
        /**
         * 设计时元素的宽度。
         */
        Width?: number;
        /**
         * 设计时元素的高度。
         */
        Height?: number;
    }

    /**
     * 单元格类型的默认值。
     */
    interface ICellTypeDefaultValue {
        /**
         * 默认值。
         */
        Value: any;
    }

    /**
     * 表示单元格的样式模板。
     */
    interface CellTypeStyleTemplate {
        /**
         * 样式的唯一键。
         */
        Key: string;
        /**
         * 样式的目录分类。
         */
        Category: string;
        /**
         * the scope of the style fashion, 0 is General(Default), 1 is old fashion, only JP and EN, 2 is new fashion, only CN and KR*/
        StyleTemplateFashionScope?: string;
        /**
         * 所有子样式。
         */
        Styles: { [key: string]: TemplatePartStyle };
    }

    /**
     * 单元格样式模板的子样式。
     */
    interface TemplatePartStyle {
        /**
         * 单元格状态改变时的动画周期。
         */
        Transition?: string;
        /**
         * 普通状态时的样式。
         */
        NormalStyle?: PartStyleUnit,
        /**
         * 鼠标在单元格上方时的样式。
         */
        HoverStyle?: PartStyleUnit,
        /**
         * 单元格获得焦点时的样式。
         */
        FocusStyle?: PartStyleUnit,
        /**
         * 单元格激活时的样式。比如按下按钮时。
         */
        ActiveStyle?: PartStyleUnit,
        /**
         * 单元格禁用时的样式。
         */
        DisableStyle?: PartStyleUnit,
        /**
         * 单元格选中时的样式。比如选中菜单类型单元格的某个子菜单。
         */
        SelectedStyle?: PartStyleUnit,
    }

    /**
     * 样式模板子样式的具体属性。
     */
    interface PartStyleUnit {
        /**
         * 字体颜色。
         */
        FontColor?: string;
        /**
         * 背景色。
         */
        Background?: string;
        /**
         * 边框 CSS 样式。它的优先级低于位置更具体的边框 CSS 字符串。
         */
        BorderString?: string;
        /**
         * 边框圆角 CSS 样式。
         */
        BorderRadiusString?: string;
        /**
         * 阴影 CSS 样式。
         */
        BoxShadowString?: string;
        /**
         * 上边框 CSS 样式。
         */
        BorderTopString?: string;
        /**
         * 右边框 CSS 样式。
         */
        BorderRightString?: string;
        /**
         * 下边框 CSS 样式。
         */
        BorderBottomString?: string;
        /**
         * 左边框 CSS 样式。
         */
        BorderLeftString?: string;
        /**
         * 水平对齐的 CSS 样式。
         */
        CellHorizontalAlignment?: string;
        /**
         * 垂直对齐的 CSS 样式。
         */
        CellVerticalAligment?: string;
        /**
         * 左内边距的 CSS 样式。
         */
        PaddingLeft?: number;
        /**
         * 右内边距的 CSS 样式。
         */
        PaddingRight?: number;
        /**
         * 上内边距的 CSS 样式。
         */
        PaddingTop?: number;
        /**
         * 下内边距的 CSS 样式。
         */
        PaddingBottom?: number;
        /**
         * 左外边距的 CSS 样式。
         */
        MarginLeft?: number;
        /**
         * 右外边距的 CSS 样式。
         */
        MarginRight?: number;
        /**
         * 上外边距的 CSS 样式。
         */
        MarginTop?: number;
        /**
         * 下外边距的 CSS 样式。
         */
        MarginBottom?: number;
    }

    /**
     * 单元格类型基类。通过插件实现的单元格类型需要从这个类继承。
     */
    class CellTypeBase {
        /**
         * 单元格的唯一键。
         */
        ID: string;
        /**
         * 在设计器中设置的单元格数据。
         */
        CellElement: CellContentElement;
        /**
         * 指定单元格是否在母版页中。
         */
        IsInMasterPage: boolean;
        /**
         * 获取插件资源
         * @param key 
         * 资源名称
         * @param args 
         * 占位符的值
         */
        getPluginResource(key: string, ...args: string[]): string;

        /**
         * 获取应用资源
         * @param key 
         * 资源名称
         * @param args 
         * 占位符的值
         */
        getApplicationResource(key: string, ...args: string[]): string;

        constructor(...params: any[]);
        /**
         * 创建该单元格类型的元素。需要在子类实现。
         * @returns 
         * jQuery，包含单元格类型元素的容器。
         */
        createContent(): JQuery;

        /**
         * 获取该单元类型的默认值。页面加载后，单元格会显示默认值。如果默认值不是在设计器中设置的单元格值，则实现此方法。
         * @returns 
         * 默认值
         */
        getDefaultValue(): ICellTypeDefaultValue;
        /**
         * 获取该单元格在“调试：页面元素”中的值。
         * @returns 
         * 调试值
         */
        getDebugValue(): any;
        /**
         * 执行一组命令。当需要在子类中执行命令时调用此方法。
         * @param commands 
         * 一组命令的信息。
         * @param context 
         * 可选参数。命令执行的上下文信息。
         */
        executeCommand(commands: object[], context?: CommandContext): void;
        /**
         * 附加一个处理函数在依赖的单元格的值发生变化时进行处理。如果c#类实现了IDependenceCells接口，则在子类中通过该方法附加一个处理函数。
         * @param valueChangedCallback 
         * 当依赖单元值发生变化时，每次执行的函数。
         */
        onDependenceCellValueChanged(valueChangedCallback: Function): void;

        /**
         * 当数据源引用的单元格值发生变更。每次执行的函数。
         */
        onBindingDataSourceDependenceCellValueChanged(bindingDataSourceModel: any, callback: Function): void;

        /**
         * 获取该单元类型是否具有焦点。需要在子类实现。
         */
        hasFocus(): boolean;
        /**
         * 设置焦点到该单元格类型。需要在子类实现。
         */
        setFocus(): void;
        /**
         * 获取单元格类型元素的容器。
         */
        getContainer(): JQuery;
        /**
         * 设置该单元类型的值。如果单元格的值发生更改，该单元格需要做出改动，则实现此方法。
         * @param value 
         * 赋予给单元格的值。
         */
        setValueToElement(jelement: JQuery, value: any): void;
        /**
         * 获取该单元类型的值。如果此单元格类型更改单元格的值，则实现此方法。
         * @returns 
         * 单元格的值。
         */
        protected getValueFromElement(): any;
        /**
         * 提交该单元格类型的值。当单元格类型的值由UI改变时，调用此方法来提交值。
         */
        commitValue(): void;
        /**
         * 数据校验。
         */
        validate(): void;

        /**
         * 获取验证结果。
         * @param value 
         * 需要校验的值。
         * @param validationInfo 
         * 校验信息。
         * @returns 
         * 校验结果。
         */
        getValidateResult(value: any, validationInfo: ForguncyDataValidationInfo): Promise<ForguncyDataValidateResult>;

        /**
         * 获取该单元类型是否禁用。
         */
        isDisabled(): boolean;
        /**
         * 禁用这个单元格类型。如果此单元类型支持禁用状态，则实现此方法。
         */
        disable(): void;
        /**
         * 启用这个单元格类型。如果此单元类型支持禁用状态，则实现此方法。
         */
        enable(): void;
        /**
         * 获取该单元类型是否只读。
         */
        isReadOnly(): boolean;
        /**
         * 设置单元格类型的只读状态。如果该单元格类型支持只读模式，则实现此方法
         * @param value 
         * 是否只读？
         */
        setReadOnly(value: boolean): void;
        /**
         * 为该单元格类型设置字体样式。如果该单元格类型显示单元格的字体设置，则实现此方法。
         * @param styleInfo 
         * 新的字体样式
         */
        setFontStyle(styleInfo: StyleMetaData): void;
        /**
         * 设置单元格的背景色。
         * @param value 
         * 新的背景色
         */
        setBackColor(color: string): void;
        /**
         * 获取单元格的tab键顺序。
         * @returns 
         * Tab键顺序值。
         */
        getElementTabIndex(): number;
        /**
         * 设置单元格的tab键顺序。在基类中，会给单元格类型里的button，input，a和textarea元素设置tabindex，如果插件中需要给其他类型的元素设置tabindex，则需要重写该方法。
         * @param tabIndex 
         * Tab键顺序值。
         */
        protected setTabIndexToElement(tabIndex: number): void;
        /**
         * 如果这个单元格需要在所有单元格创建完成并添加到页面之后做一些事情，则实现此方法。
         */
        onLoad(): void;

        /**
         * 如果这个单元格需要在所有单元格创建完成并添加到页面之后做一些事情，则实现此方法。
         */
        onPageLoaded(info: CellTypeInfo): void;
        /**
         * 销毁这个单元格类型。如果这个单元格在页面跳转时需要做一些事情，则实现此方法。
         */
        destroy(): void;

        /**
         * 判断单元格是否已经被销毁。
         */
        get hasDestroyed(): boolean;
        /**
         * 重新加载此单元格类型的数据。如果该单元格类型使用表或视图的数据，则实现此方法。当表的数据可能发生更改时，将触发此方法。
         */
        reload(): void;

        /**
         * 如果单元格绑定的数据源发生变化，可以通过重写此方法重新加载数据
         * @param tableName 变更的表名</en>
         */
        public onBindingTableChanged(tableName: string): void;

        /**
         * 隐藏数据校验的Tooltip。
         */
        hideValidateTooltip(): void;

        /**
         * 计算公式的值。
         * @param formula 
         * 公式。
         * @returns 
         * 计算结果。
         */
        evaluateFormula(formula: any): any;

        /**
         * 在公式引用的单元格值发生变更时，重新计算公式的值。
         * @param formula 公式
         * @param callback 公式结果回调
         * @param calcImmediately 是否立即计算，并调用回调函数，默认为true
         */
        onFormulaResultChanged(formula: any, callback: (value: any) => void, calcImmediately?: boolean): any;

        /**
         * Internal use
         */
        setContextVariableValue(variableName: string, value: any): void;

        /**
         * Internal use
         */
        clearContextVariableValue(variableName: string): void;

        /**
         * 获取用于公式计算的数据上下文。
         */
        getFormulaCalcContext(): FormulaCalcContext;
        /**
         * 获取单元格的可见或可用权限信息。
         * @param scope 
         * 单元格权限类型，如可用性权限。
         */
        protected getUIPermission(scope: UIPermissionScope): UIPermission;
        /**
         * 检查当前用户对于单元是否有可见或可用权限。
         * @param scope 
         * 单元格权限类型，如可用性权限。
         * @returns 
         * 如果当前用户有权限返回True，否则返回False。
         */
        protected checkAuthority(scope: UIPermissionScope): boolean;
        /**
         * 检查当前用户是否在有权限的角色列表中。
         * @param allowRoles 
         * 有权限的角色列表。
         * @returns 
         * 如果当前用户有权限返回True，否则返回False。
         */
        protected checkRoleAuthority(allowRoles: string[]): boolean;

        /**
         * 执行自定义命令对象列表。
         * @param command 
         * 命令。
         * @param initParam 
         * 上下文参数值。
         * @param eventType 
         * 事件类型（可选，用于区分不同命令）。
         * @param callbackOnCommandCompleted 
         * 命令执行完成时回调函数（可选）。
         */
        executeCustomCommandObject(command: ICustomCommandObject, initParam: {
            [paramName: string]: any
        }, eventType?: string, callbackOnCommandCompleted?: Function, commandId?: string)

        /**
         * 获取数据库数据。
         * @param bindingDataSourceModel 
         * 数据源查询模型，从设计器的BindingDataSourceProperty生成。
         * @param options 
         * 查询配置。
         * @param callback 
         * 查询结果回调
         * @param reloadWhenDependenceChanged 
         * 当依赖的单元格发生变化时，callback会被再次调用
         */
        getBindingDataSourceValue(bindingDataSourceModel: any, options: queryDataOption | null, callback: (data: any) => void, reloadWhenDependenceChanged?: boolean): void;

        /**
         * 是否是设计时预览
         */
        isDesignerPreview: boolean;

        /**
         * 设计时预览自定义参数
         */
        designerPreviewCustomArgs: unknown[];

        /**
         * 在设计时预览里面显示错误信息
         */
        showDesignerPreviewError: (message: string) => void;

        /**
         * 宽度是否是自适应模式
         */
        isAutoFitWidth: () => boolean;

        /**
         * 高度是否是自适应模式
         */
        isAutoFitHeight: () => boolean;

        /**
         * 是否是附件单元格
         */
        isAttachmentCell: () => boolean;
    }

    /**
     * 可以把组件作为子元素的单元格类型基类。
     */
    class UserControlContainerBase extends CellTypeBase {
        /**
         * 添加组件。
         * @param containerDivID 
         * 容纳组件的父容器的ID, 在调用该方法前，需要创建该元素。
         * @param userControlInfo 
         * 组件信息对象，在设计中由有[UserControlInfoProperty]标签的属性或参数生成。
         */
        protected addUserControl(containerDivID: string, userControlInfo: any);

        /**
         * 删除组件。
         * @param containerDivID 
         * 容纳组件的父容器的ID。
         */
        protected destroyUserControl(containerDivID: string);
    }

    interface CellTypeInfo {
        value: any;
        isReadOnly: boolean;
        isDisabled: boolean;
        styleData: StyleMetaData;
    }

    /**
     * 自定义命令对象。
     */
    interface ICustomCommandObject {
        /**
         * 命令列表。
         */
        Commands: any[];
        /**
         * 上下文参数名配置。
         */
        ParamProperties: { [name: string]: string };
    }

    /**
     * 通过CommandBase.executeSubCommands方法执行的子命令信息。
     */
    interface SubCommandInfo {
        /**
         * 这次命令执行的ID。
         */
        id: string;
        /**
         * 调用CommandBase.executeSubCommands方法时传递的上下文参数。
         */
        initParams: { [paramName: string]: any };
        /**
         * 调用CommandBase.executeSubCommands方法时传递的返回值参数。
         */
        returnParams: ReturnParams;
        /**
         * 调用CommandBase.executeSubCommands方法后的返回值结果。
         */
        returnResult: ReturnParams;
    }

    /**
     * 执行CommandBase.executeSubCommands方法时的返回值信息参数类型。
     */
    interface ReturnParams {
        /**
         * 返回值信息。
         */
        returnValues: { [name: string]: any };
    }

    /**
     * 数据查询配置。
     */
    interface queryDataOption {
        /**
         * 最大查询结果行数。
         */
        top?: number,
        /**
         * 查询条件。
         */
        queryConditions?: queryCondition[],
        /**
         * 查询条件关系。
         */
        relationType?: relationType,
        /**
         * 是否去掉重复项。
         */
        distinct?: boolean
    }
    /**
     * 条件关系。
     */
    const enum relationType {
        /**
         * 与关系。
         */
        And,
        /**
         * 或关系。
         */
        Or
    }
    /**
     * 查询条件。
     */
    interface queryCondition {
        /**
         * 列名。
         */
        columnName: string;
        /**
         * 比较类型。
         */
        compareType: compareType;
        /**
         * 比较值。
         */
        compareValue: any;
    }
    /**
     * 比较类型。
     */
    const enum compareType {
        /**
         * 等于。
         */
        EqualsTo,
        /**
         * 不等于。
         */
        NotEqualsTo,
        /**
         * 大于。
         */
        GreaterThan,
        /**
         * 大等于。
         */
        GreaterThanOrEqualsTo,
        /**
         * 小于。
         */
        LessThan,
        /**
         * 小于等于。
         */
        LessThanOrEqualsTo,
        /**
         * 以指定字符串开头。
         */
        BeginsWith,
        /**
         * 不以指定字符串开头。
         */
        NotBeginWith,
        /**
         * 以指定字符串结尾。
         */
        EndsWith,
        /**
         * 不以指定字符串结尾。
         */
        NotEndWith,
        /**
         * 包含指定字符串。
         */
        Contains,
        /**
         * 不包含指定字符串。
         */
        NotContains,
        /**
         * 在里边。
         */
        In,
        /**
         * 不在里边。
         */
        NotIn
    }

    /**
     * 单元格的权限信息。
     */
    interface UIPermission {
        /**
         * 单元格的名字或位置。如果单元格有名字，使用名字作为单元格权限的名字，否则使用单元格的位置信息作为名字，如"A1"。
         */
        Name: string;
        /**
         * 单元格的类型。使用单元格类型作为分类依据，如"按钮"，"文本框"等。
         */
        Category?: string;
        /**
         * 单元格的权限类型。
         */
        Scope: UIPermissionScope;
        /**
         * 是否启用单元格权限设置。
         */
        Enabled: boolean;
        /**
         * 有单元格权限的角色列表。
         */
        AllowRoles: string[];
        /**
         * 单元格中所有子项的的单元格权限信息。
         */
        Children?: SubUIPermission[];
    }

    /**
     * 单元格中子项的权限信息，例如菜单各子项的权限信息。
     */
    interface SubUIPermission {
        /**
         * 可以唯一标时单元格子项的名称。
         */
        Name: string;
        /**
         * 有单元格权限的角色列表。
         */
        AllowRoles: string[];
        /**
         * 单元格子项的子项的单元格权限信息。
         */
        Children?: SubUIPermission[];
    }

    /**
     * 单元格的权限类型。
     */
    const enum UIPermissionScope {
        /**
         * 无。
         */
        None = 0,
        /**
         * 可见性权限。
         */
        Visible = 1,
        /**
         * 可用性权限。
         */
        Enable = 2,
        /**
         * 可编辑权限。
         */
        Editable = 4,
        /**
         * 可见性、可用性和可编辑权限。
         */
        All = 7
    }

    /**
     * 提供注册单元格类型函数的帮助类。
     */
    class CellTypeHelper {
        /**
         * 注册一个单元格类型，将`javascript`单元格类型类与`C#`单元格类型类关联起来。
         * @param identifier 
         * 单元格类型的唯一标识符。标识符格式为: `Namespace.ClassName, AssemblyName`，是 C# 单元格类型类的`Namespace`，`ClassName`以及`AssemblyName`。
         * @param celltype 
         * 单元格类型的构造函数。
         * @example
         * ```javascript
         * Forguncy.CellTypeHelper.registerCellType("Namespace.ClassName, AssemblyName", customCellType);
         * // 图片轮转插件需要注册如下：
         * Forguncy.CellTypeHelper.registerCellType("CarouselCellType.Carousel, CarouselCellType", CarouselCellType);
         * ```
         */
        static registerCellType(identifier: string, celltype: Function): void;
    }

    /**
     * 命令执行的上下文信息。
     */
    export interface CommandContext {
        initParams?: { [name: string]: any };
    }

    /**
     * 命令类型基类。通过插件实现的命令类型需要从这个类继承。
     */
    class CommandBase {
        constructor();
        /**
         * C# 命令类属性的数据。
         */
        CommandParam: object;
        /**
         * 获取插件的多语言资源
         * @param key 
         * 资源名称
         * @param args 
         * 占位符的值
         */
        getPluginResource(key: string, ...args: string[]): string;

        /**
         * 获取应用资源
         * @param key 
         * 资源名称
         * @param args 
         * 占位符的值
         */
        getApplicationResource(key: string, ...args: string[]): string;
        /**
         * 执行这个命令。需要在子类实现。
         */
        execute(): void | Promise<void>;
        /**
         * 将一个公式转换成单元格位置信息。
         * @param formula 
         * Excel 公式，比如`=A1`。
         * @returns 
         * 返回单元格的位置，如果公式不是指向单元格，比如`=SUM(1,2)`，返回 null。
         */
        protected getCellLocation(formula: string): CellLocationInfo;
        /**
         * 计算公式。
         * @param formula 
         * 公式。
         * @returns 
         * 计算结果。
         */
        evaluateFormula(formula: string): any;
        /**
         * 获取用于公式计算的数据上下文。
         */
        getFormulaCalcContext(): FormulaCalcContext;

        /**
         * 写日志。
         * @param logText 
         * 日志内容。
         */
        public log(logText: string): void;

        /**
         * 执行自定义命令对象列表。
         * @param command 
         * 命令。
         * @param initParam 
         * 上下文参数值。
         * @param eventType 
         * 事件类型（可选，用于区分不同命令）。
         * @param callbackOnCommandCompleted 
         * 命令执行完成时回调函数（可选）。
         */
        executeCustomCommandObject(command: ICustomCommandObject, initParam: { [paramName: string]: any }, eventType?: string, callbackOnCommandCompleted?: Function, commandId?: string);

        /**
         * 在当前上下文中执行自定义命令对象列表。
         * @param command 
         * 命令。
         * @param initParams 
         * 上下文参数值（可选）。
         * @param returnParams 
         * 返回值信息（可选）。
         * @param needReenter 
         * 子命令执行完成后是否需要再次执行当前命令（可选），当前命令可根据返回值结果进行后续操作。
         * @example
         * ```javascript
         * // 在自定义命令中循环调用子命令，如果返回值"Return1"为true，则结果，否则继续
         * execute() {
         *     if (this.subCommandInfo?.returnResult["Return1"]) {
         *         return Forguncy.CommandResult.completed;
         *     }
         *     const initParams = { "Param1": "=A1" };
         *     const returnParams = {
         *         "returnValues": { "Return1": "=B1" }
         *     };
         *     const commandObj = this.CommandParam.Function1;
         *     this.executeSubCommands(commandObj, initParams, returnParams, true);
         * }
         * ```
         */
        executeSubCommands(command: ICustomCommandObject, initParams?: { [paramName: string]: any }, returnParams?: ReturnParams, needReenter?: boolean);

        /**
         * 获取子命令信息，一般用于调用executeSubCommands方法且再次执行当前命令时。
         */
        get subCommandInfo(): SubCommandInfo;

        /**
         * 获取数据库数据。
         * @param bindingDataSourceModel 
         * 数据源查询模型，从设计器的BindingDataSourceProperty生成。
         * @param options 
         * 查询配置。
         * @param callback 
         * 查询结果回调
         * @returns Promise&lt;any&gt;
         */
        getBindingDataSourceValue(bindingDataSourceModel: any, options: queryDataOption): Promise<any>;


        /**
        * 命令执行器
        */
        CommandExecutor: CommandExecutor;
        /**
        * 运行时页面唯一标识
        */
        runTimePageName: string;
    }
    /**
    * 命令执行器
    */
    interface CommandExecutor {
        /**
        * 执行命令
        * @param commands 
        * 命令列表。
        * @param options 
        * 执行选项。
        */
        executeCommand(commands: object[], options: CommandExecuteOptions);
    }

    /**
    * 命令执行选项
    */
    interface CommandExecuteOptions {
        /**
        * 运行时页面唯一标识
        */
        runTimePageName: string;
        /**
        * 命令ID，可以是任意字符串
        */
        commandID: string;
        /**
        * 命令类型，可以是任意字符串，如果未Click则相同ID的命令同一时间只执行一个
        */
        eventType: string;
        /**
        * 命令初始参数
        */
        initParams?: any;
        /**
        * 命令执行完成后回调函数
        */
        callbackOnCommandCompleted?: Function;
        /**
        * 定位字符串，用于日志显示
        */
        locationString?: string;
    }

    /**
     * 提供注册自定义命令类型函数的帮助类。
     */
    class CommandFactory {
        /**
         * 注册一个命令，将`javascript`命令类与`C#`命令类关联起来。
         * @param commandType 
         * 命令的唯一标识符。标识符格式为: `Namespace.ClassName, AssemblyName`，使用 C# 命令类的`Namespace`，`ClassName`以及`AssemblyName`。
         * @param command 
         * 命令的构造器。
         * @example
         * ```javascript
         * Forguncy.CommandFactory.RegisterCommand("Namespace.ClassName, AssemblyName", customCommand);
         * // 表格数据传递命令插件需要注册如下：
         * Forguncy.CommandFactory.registerCommand("PassListviewDataCommand.PassListviewDataCommand, PassListviewDataCommand", PassListviewDataCommand);
         * ```
         */
        static registerCommand(commandType: string, command: any): void;
    }

    /**
     * 设置样式
     */
    interface ForguncyStyleInfo {
        /**
         * 背景色
         */
        backgroundStr: string;

        /**
         * 左边框
         */
        borderLeft: ForguncyBorderLine;

        /**
         * 上边框
         */
        borderTop: ForguncyBorderLine;

        /**
         * 右边框
         */
        borderRight: ForguncyBorderLine;

        /**
         * 下边框
         */
        borderBottom: ForguncyBorderLine;

        /**
         * 字体
         */
        fontFamily: string;

        /**
         * 字号
         */
        fontSize: number;

        /**
         * 字体倾斜
         */
        fontStyle: string;

        /**
         * 字体加粗
         */
        fontWeight: string;

        /**
         * 字体颜色
         */
        foregroundStr: string;

        /**
         * 格式设置
         */
        formatString: string;

        /**
         * 是否有删除线
         */
        strikethrough: boolean;

        /**
         * 缩进
         */
        textIndent: number;

        /**
         * 是否有下划线
         */
        underline: boolean;

        /**
         * 是否可换行
         */
        wordWrap: boolean;

        /**
         * 缩小字体填充
         */
        shrinkToFit: boolean;

        /**
         * 超出的文本显示省略号
         */
        ellipsis: boolean;

        /**
         * 水平对齐方式
         */
        horizontalAlignment: CellHorizontalAlignment;

        /**
         * 垂直对齐方式
         */
        verticalAlignment: CellVerticalAlignment;
    }

    /**
     * 设置边框
     */
    interface ForguncyBorderLine {
        /**
         * 边框颜色
         */
        colorStr: string;

        /**
         * 边框线型
         */
        style: ForguncyBorderLineStyle;
    }

    /**
     * 边框线型样式设置
     */
    enum ForguncyBorderLineStyle {
        /**
         * 无
         */
        None = 0,
        /**
         * 单线型（较细）
         */
        Thin = 1,
        /**
         * 单线型（中等粗细）
         */
        Medium = 2,
        /**
         * 虚线（较细）
         */
        Dashed = 3,
        /**
         * 斑点线
         */
        Dotted = 4,
        /**
         * 粗线型
         */
        Thick = 5,
        /**
         * 双线型
         */
        Double = 6,
        /**
         * 虚线（中等粗细）
         */
        MediumDashed = 8,
    }

    /**
     * 数据验证信息
     */
    interface ForguncyDataValidationInfo {
        /**
         * 验证类型
         */
        numberType: ForguncyDataValidationType;

        /**
         * 比较参数类型
         */
        compareParamType: ForguncyCompareParamType;

        /**
         * 第一个参数值
         */
        firstParamValue: any;

        /**
         * 第二个参数值
         */
        secondParamValue: any;

        /**
         * 忽略空白值
         */
        ignoreBlank: boolean;

        /**
         * 验证命令
         */
        validateCommand: object[];

        /**
         * 选择单元格时显示输入信息
         */
        showInputMessageWhenCellIsSelected: boolean;

        /**
         * 输入信息标题
         */
        inputMessageTitle: string;

        /**
         * 输入信息
         */
        inputMessage: string;

        /**
         * 输入无效数据后显示错误信息
         */
        showErrorMessageAfterInvalidDataIsEntered: boolean;

        /**
         * 错误信息
         */
        errorMessage: string;

        /**
         * 错误显示目标
         */
        errorTo: ForguncyErrorTo;

        /**
         * 选择的默认正则表达式
         */
        selectedDefaultRegularExpression: string;
    }

    /**
     * 数据验证类型设置
     */
    enum ForguncyDataValidationType {
        /**
         * 任意值
         */
        AnyValue = 1,
        /**
         * 整数
         */
        WholeNumber = 2,
        /**
         * 小数
         */
        Decimal = 4,
        /**
         * 列表
         */
        List = 8,
        /**
         * 日期
         */
        Date = 16,
        /**
         * 时间
         */
        Time = 32,
        /**
         * 文本长度
         */
        TextLength = 64,
        /**
         * 自定义
         */
        Custom = 128,
        /**
         * 正则表达式
         */
        Regular = 256,
        /**
         * 命令
         */
        Command = 512,
        /**
         * 全部
         */
        All = AnyValue | WholeNumber | Decimal | List | Date | Time | TextLength | Custom | Regular | Command,
    }

    /**
     * 比较参数类型
     */
    enum ForguncyCompareParamType {
        /**
         * 在...之间
         */
        Between = 0,

        /**
         * 不在...之间
         */
        NotBetween = 1,

        /**
         * 等于
         */
        EqualTo = 2,

        /**
         * 不等于
         */
        NotEqualTo = 3,

        /**
         * 大于
         */
        GreaterThan = 4,

        /**
         * 小于
         */
        LessThan = 5,

        /**
         * 大于等于
         */
        GreaterThanOrEqualTo = 6,

        /**
         * 小于等于
         */
        LessThanOrEqualTo = 7,
    }

    /**
     * 错误显示目标
     */
    enum ForguncyErrorTo {
        /**
         * 工具提示
         */
        Tooltip = 0,
        /**
         * 单元格
         */
        Cell = 1,
    }

    /**
     * Forguncy数据验证结果
     */
    interface ForguncyDataValidateResult {
        /**
         * 数据是否有效
         */
        isValid: boolean;
        /**
         * 错误信息
         */
        errorMessage: string;
    }
}

declare namespace Forguncy {
    interface Cell {
        /**
         * 获取单元格上的单元格类型。
         */
        getCellType(): Forguncy.Plugin.CellTypeBase;
    }
}
