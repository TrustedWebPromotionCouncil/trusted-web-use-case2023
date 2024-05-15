# Matching System (2023/09/25)

- [Environment](Environment)
- [Structure](Structure)

## Environment

\* `yarn` and `nvm` must be installed globally.  
\*\* This project recommends using MacOS(Linux) and Visual Studio Code for development.

- [homebrew](https://brew.sh/index_ja): 4.1.7
- [yarn](https://formulae.brew.sh/formula/yarn#default): 1.22.19
- [nvm](https://formulae.brew.sh/formula/nvm): 0.39.3
- [Node.js](https://nodejs.org/es/blog/release/v18.15.0/): 18.15.0 (LTS)
- [Visual Studio Code](https://formulae.brew.sh/cask/visual-studio-code)

## Structure

- Language
  - HTML
  - [Typescript](https://www.npmjs.com/package/typescript): v5.0.2
  - [SCSS(sass)](https://www.npmjs.com/package/sass): v1.67.0
- Framework
  - [Vue3](https://v3.vuejs.org/guide/introduction.html): v3.3.4
  - [Vite](https://vitejs.dev/): v4.4.5
  - [Vuetify](https://vuetifyjs.com/): v3.3.16
- Other
  - [Vitest](https://vitest.dev/): v0.34.5
  - [vuex-module-decorators](https://www.npmjs.com/package/vuex-module-decorators): v2.0.0
  - [axios](https://github.com/axios/axios): v1.5.0
  - [chart.js](https://www.chartjs.org/): v4.4.0
  - [vue-chartjs](https://vue-chartjs.org/): v5.2.0
  - [secure-ls](https://www.npmjs.com/package/secure-ls): v1.2.6
  - [docker](https://www.docker.com/): 20.10.24, build 297e128
  - [Docker Compose](https://docs.docker.com/compose/): v2.17.2

## Run Using Docker

1. Open command palette.  
   `cmd + shift + p`
2. Input `Tasks: Run Task` and select this.
3. Select `🐳docker-compose up`.
4. Access it at http://localhost:19132.

## Environment Setup for M1, M2 Mac (ARM64 Machines) - Simplified Version

1. Install brew.  
   \* Please refer to the official documentation for any changes related to paths or versions.
2. Install nvm via brew.  
   `brew install nvm`
3. Add the path as instructed after the installation.  
   \* If you missed the instructions, you can re-display them using brew info nvm.
4. Install yarn via brew.  
   `brew install yarn`
5. Install Node.js via nvm (for example, version v18.15.0).  
   `nvm install 18.15.0`
6. Switch Node.js to version 18.15.0 (or your desired version).  
   `nvm use 18.15.0`  
   \*You can also switch versions using .nvmrc by specifying the version.
7. Install the project's node_modules.  
   `yarn`
8. Copy .env.sample and create .env.local.
   `cp .env.sample .env.local`
9. Start the server.
   `yarn serve`
10. You are done if you can access it at http://localhost:19132.
