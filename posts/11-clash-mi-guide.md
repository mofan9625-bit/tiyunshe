---
title: Clash Mi 安装与订阅导入教程：从下载到规则切换
description: 基于 Clash Mi 官方资料整理的跨平台安装、订阅导入、策略选择与连接排查指南。
date: 2026-10-03
category: 工具使用
---

# Clash Mi 安装与订阅导入教程：从下载到规则切换

新用户最容易踩的坑，是从非官方站点下载二次打包版本，或者导入订阅后没有选择策略组。Clash Mi 官方明确说明唯一官网为 [clashmi.app](https://clashmi.app/)，项目源码与版本发布位于 [KaringX/clashmi](https://github.com/KaringX/clashmi)。先确认来源，再开始配置。

![Clash Mi 官方界面](https://raw.githubusercontent.com/KaringX/clashmi/main/assets/demo/home.png)

## 它适合哪些设备

Clash Mi 是基于 Flutter 的 Mihomo 图形客户端，官方支持 iOS、macOS、Android、Windows 与 Linux。官方列出的最低要求包括 iOS 15、macOS 12、Android 8 和 Windows 10；桌面端与移动端的菜单位置略有差异，但导入和启用逻辑基本一致。

## 安装步骤

1. iPhone 或 iPad 在 App Store 搜索“Clash Mi”，核对开发者和应用名称；其他系统从[官方下载页](https://clashmi.app/download)或 [GitHub Releases](https://github.com/KaringX/clashmi/releases/latest)获取。
2. 首次启动后允许系统创建网络配置。只有在准备连接时才需要开启。
3. 进入配置或订阅页面，选择“从 URL 导入”，粘贴服务方提供的订阅地址。
4. 更新配置后进入策略组，先选择一个延迟正常的节点，再启用连接。

## 推荐的首次配置顺序

先使用规则模式，让本地站点保持直连，其他请求按照配置文件分流。随后运行一次延迟测试，但不要只选择数字最低的节点；连续打开网页、播放视频并保持十分钟，稳定性比单次延迟更重要。需要查看实时连接时，可使用应用内置的 Zashboard 面板。

## 常见问题

| 现象 | 优先检查 | 处理方法 |
|---|---|---|
| 导入后没有节点 | 订阅是否过期 | 在浏览器确认链接有效，再重新更新 |
| 已连接但网页打不开 | 策略组与 DNS | 选择具体节点，切换规则模式后重连 |
| 延迟测试全部超时 | 本地网络或配置 | 切换 Wi-Fi/移动网络，重新拉取配置 |
| 桌面端无法启动 | 系统版本与安装包架构 | 根据官方系统要求下载对应版本 |

> 需要挑选可用于测试的品牌，可前往机场推荐，先进行短周期验证再长期使用。

## 官方资料

- [Clash Mi 官方网站](https://clashmi.app/)
- [Clash Mi 官方 GitHub](https://github.com/KaringX/clashmi)
- [官方常见问题](https://clashmi.app/guide/faq)

