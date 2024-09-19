# Changelog

All notable changes to this project will be documented in this file.

# [3.0.3](https://github.com/skyra-project/editable-commands/compare/v3.0.2...v3.0.3) - (2024-09-19)

## 🏠 Refactor

- Fix for discordjs 14.16.2 partialgroupdm typings ([000fc16](https://github.com/skyra-project/editable-commands/commit/000fc16fa2225db939c3616d5eeae78aed09f3be))

# [3.0.2](https://github.com/skyra-project/editable-commands/compare/v3.0.1...v3.0.2) - (2024-05-16)

## 🐛 Bug Fixes

- Split CJS and ESM builds correctly (#295) ([5f37869](https://github.com/skyra-project/editable-commands/commit/5f3786997d6d5aedb196bd2f53e7ab32d33b4a5b))

# [3.0.1](https://github.com/skyra-project/editable-commands/compare/v3.0.0...v3.0.1) - (2023-04-02)

## 📝 Documentation

- Fix name ([4b98668](https://github.com/skyra-project/editable-commands/commit/4b98668f43710248d75f8aa40fa551c299b5fb9c))

# [3.0.0](https://github.com/skyra-project/editable-commands/compare/v2.1.4...v3.0.0) - (2022-12-30)

## 📝 Documentation

- Change name ([d55e384](https://github.com/skyra-project/editable-commands/commit/d55e384a7b7916ca46f753cfcc272b0c0f461286))

## 🚀 Features

- **deps:** Support for discord.js v14 (#194) ([e7d9682](https://github.com/skyra-project/editable-commands/commit/e7d9682d83752c29333cfed65444ec6f97a032ec))
  - 💥 **BREAKING CHANGE:** This package now required DiscordJS v14. This means v13 is no longer supported.

# [2.1.4](https://github.com/skyra-project/editable-commands/compare/v2.1.3...v2.1.4) - (2022-08-26)

## 🐛 Bug Fixes

- Add smarter state tracking (#163) ([bab8053](https://github.com/skyra-project/editable-commands/commit/bab8053bacd8adb0c459fe92c19287db9f8e5550))

## 📝 Documentation

- Fix typedoc ([39d15bf](https://github.com/skyra-project/editable-commands/commit/39d15bf03f3746803ee9422601bdfec63f95272d))
- Add KrishAgarwal2811 as a contributor for code (#149) ([ba6bbaf](https://github.com/skyra-project/editable-commands/commit/ba6bbaf9aff5ba99df11e706ab312aadfaf97773))

# [2.1.3](https://github.com/skyra-project/editable-commands/compare/v2.1.2...v2.1.3) - (2022-07-11)

## 🐛 Bug Fixes

- Ensure messages retain components, files, and allowedMentions (#144) ([640eecf](https://github.com/skyra-project/editable-commands/commit/640eecf514dfe67b86430312f800d727873c2147))

### [2.1.2](https://github.com/skyra-project/editable-commands/compare/v2.1.1...v2.1.2) (2021-12-28)

### [2.1.1](https://github.com/skyra-project/editable-commands/compare/v2.1.0...v2.1.1) (2021-11-25)

### Bug Fixes

-   always create new empty arrays ([#68](https://github.com/skyra-project/editable-commands/issues/68)) ([406dd08](https://github.com/skyra-project/editable-commands/commit/406dd08835919bee2b7f81eade9dd7b36f113f46))

## [2.1.0](https://github.com/skyra-project/editable-commands/compare/v2.0.0...v2.1.0) (2021-08-08)

### Features

-   added editable attachments support ([#28](https://github.com/skyra-project/editable-commands/issues/28)) ([073a7ea](https://github.com/skyra-project/editable-commands/commit/073a7ead898d5bf1f5e321b235f5af5f21eee858))

## [2.0.0](https://github.com/skyra-project/editable-commands/compare/v1.0.0...v2.0.0) (2021-08-04)

### ⚠ BREAKING CHANGES

-   This package now requires the use of Discord.JS v13
-   This package no longer modifies the `message` class in Discord.JS
-   Use `send`, `reply`, `get`, `free`, and `track` utility methods instead

-   specify breaking changes ([a98c198](https://github.com/skyra-project/editable-commands/commit/a98c1986bd7114acf41881d58f7707d8068e7acc))

## 1.0.0 (2021-01-13)

### Bug Fixes

-   a few enhancements ([2b00df0](https://github.com/skyra-project/editable-commands/commit/2b00df0021b98e86a3d28f3b30a96c41dfe3f34c))
-   make discord.js a devDependency ([9810ae5](https://github.com/skyra-project/editable-commands/commit/9810ae5010388a28c4ae887d8f360b5c0f159873))
-   resolved a couple of bugs ([59b7be1](https://github.com/skyra-project/editable-commands/commit/59b7be1eb36550d0ddf2b473d2ce4cde1265219c))
-   resolved workflow errors ([aedc7e9](https://github.com/skyra-project/editable-commands/commit/aedc7e971614279994ccdcfba23da174e2e6880e))
