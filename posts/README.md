# 梯云社文章库

以下文章中的性能数字为统一测试口径下的匿名样本与示例区间。正式发布前，应使用最新实测数据替换，并补充测试日期、入口城市、接入网络与设备信息。

1. [平价高性价比节点合集](01-budget-nodes.md)
2. [IPLC 与 IEPL 专线节点推荐](02-iplc-iepl-lines.md)
3. [AI 工具原生 IP 选择指南](03-ai-native-ip.md)
4. [流媒体原生解锁节点盘点](04-streaming-unlock.md)
5. [外贸与海外社媒节点选购](05-global-business-social.md)
6. [跨区游戏加速节点推荐](06-game-acceleration.md)
7. [Clash 与 Clash Verge 排错](07-clash-timeout-troubleshooting.md)
8. [Sing-box 与 Shadowrocket 排错](08-singbox-shadowrocket-errors.md)
9. [节点测速自检教程](09-node-speed-self-test.md)
10. [Shadowrocket iOS 完整指南](10-shadowrocket-ios-guide.md)

统一 CTA 目前指向 `airports.html`。上线前请填写真实套餐、优惠条件、有效期、退款规则与联盟关系披露。

## 自动更新

新增或修改 Markdown 后，在项目根目录运行：

```bash
npm run build
```

脚本会扫描所有以两位数字开头的文章文件，并自动生成：

- `assets/posts-data.js`：知识库、首页近期文章与热门标签的数据源
- `feed.xml`：RSS 订阅
- `sitemap.xml`：搜索引擎站点地图

Cloudflare Pages 可将构建命令设置为 `npm run build`，输出目录设置为项目根目录 `.`。GitHub Actions 中也只需在发布前执行相同命令。
