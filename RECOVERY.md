# 回滚指南
- 冻结标签：v1.0-butterfly-frozen
- 冻结时间：2026-10-13

## 本地代码回滚（如果新主题开发失败）
git checkout v1.0-butterfly-frozen
git checkout -b recovery-branch

## 线上回滚（Vercel 操作）
登录 Vercel Dashboard -> 进入项目 -> 点击 Deployments -> 找到历史版本 -> 点击 Instant Rollback