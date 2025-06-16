# 活字格树形表插件

这是一个基于 [Wunderbaum](https://github.com/mar10/wunderbaum) 库的树形控件演示项目，展示了树形控件的各种功能和使用场景。

## 功能特点

- 🌲 基于 Wunderbaum 库实现的树形控件
- 📊 支持树形网格(TreeGrid)视图
- 🔍 实时搜索和过滤功能
- ↕️ 列排序功能
- 📱 响应式布局设计
- ✨ 多个演示用例

## 项目结构

```
├── Resources/            # 静态资源
│   ├── css/       
│   ├── js 
│   └── util
├── PluginConfig.json
├── TreeGridToolPluginCellType.cs
├── TreeGridToolPluginCommand.cs
└── README.md
```

## 核心功能

### 导航树

- 支持多级目录结构
- 可展开/折叠节点
- 支持键盘导航
- 动态加载子节点

### 树形网格

- 可调整列宽
- 支持列排序
- 支持单元格编辑
- 支持拖放操作

### 过滤功能

- 实时搜索
- 支持隐藏/淡化未匹配项
- 提供匹配计数
- 支持快速导航到匹配项

### 其他功能

- 支持复选框选择
- 支持自定义图标
- 支持自定义样式
- 支持禁用/启用节点

## 使用技术

- Wunderbaum 树形控件库
- 原生 JavaScript
- CSS Grid 和 Flexbox 布局
- Bootstrap Icons

## 开始使用

1. 克隆项目到本地
2. 使用 Web 服务器打开项目目录
3. 在浏览器中访问 index.html
4. 浏览不同的演示用例来了解功能

## 演示用例

- 基础树形控件
- 网格视图
- 大数据加载
- 只读模式
- 可编辑模式
- 固定列模式
- 自定义数据展示

## 浏览器支持

支持所有现代浏览器，包括：
- Chrome
- Firefox
- Safari
- Edge

## 许可证

本项目基于 MIT 许可证开源。

## 致谢

感谢 [Wunderbaum](https://github.com/mar10/wunderbaum) 项目提供的优秀树形控件库。