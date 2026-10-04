---
title: Shadowrocket 使用教程：iOS 安装、配置导入与规则模式
description: 依据 Shadowrocket 官方 App Store 信息整理的安装、配置添加、规则选择和连接检查教程。
date: 2026-10-03
category: 工具使用
---

# Shadowrocket 使用教程：iOS 安装、配置导入与规则模式

Shadowrocket 用户最常见的坑，是购买了名称相似的应用，或导入配置后直接开启全局模式。官方 App Store 页面显示开发者为 **Shadow Launch Technology Limited**，应用名称为 Shadowrocket。安装前应核对这两项，不要从第三方网页安装描述文件或安装包。

![Shadowrocket 官方 App Store 截图](https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/2b/92/56/2b925644-65ea-55b8-70cc-b76c7dec5c55/pr_source.png/157x340bb.webp)

## 安装与首次启动

1. 从 [Apple App Store 官方页面](https://apps.apple.com/us/app/shadowrocket/id932747118)购买并安装。
2. 首次连接时，iOS 会请求添加网络配置；确认应用来源无误后允许。
3. Shadowrocket 本身不提供服务器资源，需要准备自己的服务器配置或订阅地址。

## 添加订阅配置

复制订阅地址后打开 Shadowrocket，点击首页右上角的添加按钮，类型选择“Subscribe”，填写备注和 URL 后保存。返回首页并更新订阅，确认节点列表出现。选择节点后再开启顶部连接开关。

如果使用单节点，可根据服务方提供的协议、地址、端口和认证信息逐项添加。不要把订阅地址或认证信息发送给他人，也不要截图公开完整配置。

## 规则模式怎么选

官方说明显示 Shadowrocket 支持域名、域名后缀、关键词、CIDR 与 GeoIP 等规则匹配，也支持从 URL 或 iCloud Drive 导入规则文件。日常使用建议选择规则模式：本地服务直连，指定请求按照策略转发。全局模式主要用于排查规则遗漏。

## 连接检查

| 检查项 | 正常表现 | 异常处理 |
|---|---|---|
| 节点延迟 | 多次测试结果相对稳定 | 更新订阅或切换网络 |
| DNS 请求 | 域名可以正常解析 | 检查 DNS 与规则文件 |
| Wi-Fi/蜂窝切换 | 切换后可自动恢复 | 关闭连接后重新开启 |
| 流量统计 | 直连与转发数据有记录 | 确认当前配置和策略 |

官方产品说明还包括网络速度统计、本地 DNS 映射、IPv6、DoH、DoT 与 DoQ 等能力。新用户不必一次打开全部高级选项，先完成稳定连接，再逐项调整 DNS 和规则。

> 配置导入后建议用不同网络分别测试。可在机场推荐选择品牌，再对照晚高峰表现决定是否长期使用。

## 官方资料

- [Shadowrocket App Store 官方页面](https://apps.apple.com/us/app/shadowrocket/id932747118)
- 开发者：Shadow Launch Technology Limited
- 官方说明：应用不附带服务器资源，配置需由用户自行提供

