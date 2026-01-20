# React Native Events App

[English](#english) | [中文](#chinese)

<a name="english"></a>

## 🇬🇧 English

A modern React Native application for discovering events, built with Expo and the Ticketmaster API. This project demonstrates best practices in mobile development, including local-first architecture, modern UI styling, and robust build automation.

### 🚀 Features

- **Event Discovery**: Browse a vast catalog of events sourced directly from the Ticketmaster API.
- **Smart Search**: Search events by keywords with real-time feedback.
- **Rich Details**: View comprehensive event information including venue details, dates, ticket availability, and status.
- **Modern UI**: A polished, responsive interface built with `styled-components` featuring hero headers, status pills, and adaptive layouts.
- **Local Persistence**: Seamless data storage using **SQLite** and **Drizzle ORM** for high-performance local caching.
- **Authentication**: Secure user sessions powered by **Supabase** and **Better Auth**, with persistent storage adapters.
- **Cross-Platform**: Fully optimized for both iOS and Android devices.

### 🛠 Tech Stack

- **Core**: [React Native](https://reactnative.dev/) (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [styled-components](https://styled-components.com/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query) + Axios
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: Supabase + Better Auth
- **Build Tools**: EAS CLI (Expo Application Services)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   EXPO_PUBLIC_TICKETMASTER_API_KEY=your_ticketmaster_api_key
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 🏃‍♂️ Running the App

- **Start Development Server**
  ```bash
  pnpm start
  ```

- **Run on Android**
  ```bash
  pnpm android
  ```

- **Run on iOS**
  ```bash
  pnpm ios
  ```

### 🏗 Build & Deployment

This project uses EAS (Expo Application Services) for building and deploying.

#### Cloud Builds (Recommended)
No local environment setup required.

- **Android APK/AAB**
  ```bash
  pnpm build:android
  ```

- **iOS IPA**
  ```bash
  pnpm build:ios
  ```

#### Local Builds
Requires Android Studio (JDK 17) or Xcode installed locally.

- **Android Local Build**
  ```bash
  pnpm build:android:local
  ```

- **iOS Local Build**
  ```bash
  pnpm build:ios:local
  ```

### 📂 Project Structure

```
src/
├── api/          # API clients and type definitions (Ticketmaster)
├── app/          # Expo Router pages and layouts
│   ├── events/   # Event listing and detail screens
│   └── user/     # User profile and settings
├── auth/         # Authentication logic and storage adapters
├── db/           # Drizzle ORM schema and database setup
├── store/        # Zustand global state stores
└── components/   # (Optional) Shared UI components
```

---

<a name="chinese"></a>

## 🇨🇳 中文

这是一个基于 Expo 和 Ticketmaster API 构建的现代 React Native 活动发现应用。本项目展示了移动开发的最佳实践，包括 Local-First 架构、现代 UI 样式设计以及强大的自动化构建流程。

### 🚀 功能特性

- **活动发现**：浏览直接来源于 Ticketmaster API 的海量活动目录。
- **智能搜索**：通过关键词搜索活动，支持实时反馈。
- **丰富详情**：查看包括场馆详情、日期、票务情况和状态在内的全面活动信息。
- **现代 UI**：使用 `styled-components` 构建的精致响应式界面，包含 Hero 头部、状态胶囊标签和自适应布局。
- **本地持久化**：使用 **SQLite** 和 **Drizzle ORM** 实现无缝数据存储，提供高性能的本地缓存。
- **身份验证**：由 **Supabase** 和 **Better Auth** 支持的安全用户会话，配备持久化存储适配器。
- **跨平台**：针对 iOS 和 Android 设备进行了全面优化。

### 🛠 技术栈

- **核心**：[React Native](https://reactnative.dev/) (Expo SDK 54)
- **语言**：TypeScript
- **导航**：[Expo Router](https://docs.expo.dev/router/introduction/)
- **样式**：[styled-components](https://styled-components.com/)
- **数据获取**：[TanStack Query](https://tanstack.com/query/latest) (React Query) + Axios
- **状态管理**：[Zustand](https://github.com/pmndrs/zustand)
- **数据库**：[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/)
- **认证**：Supabase + Better Auth
- **构建工具**：EAS CLI (Expo Application Services)

### 📦 安装指南

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   在根目录创建一个 `.env.local` 文件并添加你的密钥：
   ```env
   EXPO_PUBLIC_TICKETMASTER_API_KEY=your_ticketmaster_api_key
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 🏃‍♂️ 运行应用

- **启动开发服务器**
  ```bash
  pnpm start
  ```

- **运行 Android 版**
  ```bash
  pnpm android
  ```

- **运行 iOS 版**
  ```bash
  pnpm ios
  ```

### 🏗 构建与部署

本项目使用 EAS (Expo Application Services) 进行构建和部署。

#### 云端构建（推荐）
无需配置本地环境。

- **Android APK/AAB**
  ```bash
  pnpm build:android
  ```

- **iOS IPA**
  ```bash
  pnpm build:ios
  ```

#### 本地构建
需要在本地安装 Android Studio (JDK 17) 或 Xcode。

- **Android 本地构建**
  ```bash
  pnpm build:android:local
  ```

- **iOS 本地构建**
  ```bash
  pnpm build:ios:local
  ```

### 📂 项目结构

```
src/
├── api/          # API 客户端和类型定义 (Ticketmaster)
├── app/          # Expo Router 页面和布局
│   ├── events/   # 活动列表和详情页
│   └── user/     # 用户个人资料和设置
├── auth/         # 认证逻辑和存储适配器
├── db/           # Drizzle ORM 模式定义和数据库设置
├── store/        # Zustand 全局状态存储
└── components/   # (可选) 共享 UI 组件
```

## 📝 许可证

本项目开源并遵循 [MIT 许可证](LICENSE)。
