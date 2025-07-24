# Accounting App

该项目是一个基于 **Cloudflare Pages + Workers + D1 数据库** 的多人记账应用，支持以下功能：
- 成员管理（添加、查看余额）
- 账单记录（按参与人员分摊）
- 储备金管理
- 自动结算与统计（每人应补/应退金额）
- Dashboard 统计图表
- 暗黑模式（Dark Mode）
- 多语言切换（中文/English）
- 自适应移动端界面

---

## 项目结构
```
frontend/   # React + Tailwind CSS 前端
worker/     # Cloudflare Workers API (CRUD + 结算计算)
```

---

## 部署步骤

### 1. 创建 Cloudflare Pages 项目
1. 将本项目代码上传至 GitHub。
2. 在 Cloudflare Pages 创建新项目并关联该 GitHub 仓库。
3. 构建命令：
   ```bash
   cd frontend && npm install && npm run build
   ```
   输出目录：`frontend/dist`

### 2. 创建 D1 数据库
```bash
npx wrangler d1 create accounting_db
npx wrangler d1 execute accounting_db --file=worker/schema.sql
```

### 3. 部署 Worker
```bash
cd worker
npx wrangler deploy
```
此 Worker 提供 `/api/members`、`/api/transactions`、`/api/reserve`、`/api/overview` 等接口。

### 4. 绑定 Pages 和 Worker
在 Cloudflare Pages 项目的 “Functions” 设置中，将 API 路径绑定至 Worker。

---

## 功能说明
1. **Members 页面**：添加成员，查看每人余额。
2. **Transactions 页面**：添加账单，自动分摊至参与人员。
3. **Reserve Fund 页面**：管理备用金，支持多笔记录。
4. **Overview 页面**：统计总开销、总备用金和差额，并显示每个人最终结算结果。
5. **Dashboard 页面**：整合图表展示，包括付款统计、备用金分布、结算饼图。
6. **Dark Mode**：右上角按钮可切换明亮/暗黑模式。
7. **多语言支持**：可在右上角切换 English / 中文。

---

## 本地开发
```bash
cd frontend
npm install
npm run dev
```
API 可通过本地 Worker 启动：
```bash
cd worker
npx wrangler dev
```

---

## 技术栈
- **前端**：React + Tailwind CSS + Chart.js
- **后端**：Cloudflare Workers + D1 (SQLite)
- **部署**：Cloudflare Pages + GitHub Actions (CI/CD)

---

## 页面效果

以下为页面示例效果（可根据实际部署后截图替换）：

### Dashboard
![Dashboard 示例](docs/screenshots/dashboard.png)

### Transactions
![Transactions 示例](docs/screenshots/transactions.png)

### Reserve Fund
![Reserve Fund 示例](docs/screenshots/reserve.png)

### Overview
![Overview 示例](docs/screenshots/overview.png)

### Members
![Members 示例](docs/screenshots/members.png)

---

## GitHub Actions 初始化 D1 数据库

本项目提供了 `.github/workflows/d1-init.yml` Workflow，可用于在 GitHub Actions 中自动执行 D1 数据库的表结构初始化。

### 使用步骤
1. 确保已在 Cloudflare Dashboard 中创建 D1 数据库 `accounting_db`。
2. 在 GitHub 仓库中配置以下 **Secrets**：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID` (如果需要)
3. 在 GitHub Actions 页面中，手动触发 `Init D1 Tables` 工作流。
4. Workflow 会自动执行 `worker/schema.sql`，创建所需的三张表：
   - `members`
   - `transactions`
   - `reserve_fund`
