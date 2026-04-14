# CLI Proxy API 管理中心（个人改进版）

本项目基于原项目 [router-for-me/Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center) 进行二次优化，重点是提升远程管理可用性和配置体验。

## 这版做了什么优化

1. 远程管理新增「面板仓库」配置入口  
支持在 `远程管理` 页面直接配置面板仓库地址，便于部署/更新面板来源。

![远程管理-面板仓库配置](./docs/images/remote-control-panel-repo.png)

2. API 密钥支持「别名」  
新增 API 密钥时可填写别名，方便区分不同用途（例如：生产/测试/不同平台）。

![API 密钥新增别名](./docs/images/api-key-alias.png)

3. 未保存配置离开提醒  
当存在未保存修改时，离开页面会弹窗确认，避免误操作导致配置丢失。

![未保存配置提醒](./docs/images/unsaved-changes-warning.png)

## 配置方法

1. 启动 CLIProxyAPI（建议 `v6.8.0+`）。  
2. 打开管理面板：`http://<服务器IP>:<端口>/management.html`。  
3. 输入管理密钥完成连接。  
4. 进入 `远程管理` 页面：  
   - 开启远程访问（按需）  
   - 在「面板仓库」中填写你的仓库地址  
5. 进入 `API 密钥` 页面：新增或编辑密钥时可填写别名。  
6. 修改配置后点击保存；若未保存直接离开，会收到离开确认提示。  
7. 若你改动的是后端配置，保存后重启 CLIProxyAPI 使配置生效。  

## 更新内容

- 新增：远程管理页支持配置面板仓库。  
- 新增：API 密钥别名字段。  
- 新增：未保存更改离开提醒弹窗。  
- 优化：配置流程更直观，降低误操作和维护成本。  

