# Hi Bus! 今天想搭乘哪輛公車呢？ | [Demo](https://lucie0417.github.io/hii-bus/)
## 關於 Hi Bus! 你可以：

* 支援裝置瀏覽 | 可在手機、平板與電腦隨時隨地使用Hi Bus!
* 快速查詢 | 全臺公車路線及動態時刻
* 會員登入 | 登入會員收藏您常用公車路線
* 附近站牌 | 根據您的位置定位附近公車站牌



## 系統說明

本專案使用 `create-react-app`，並部署到 Github Pages，運行方式使用 `npm` 下載依賴包，`npm start` 運行

* Node 版本 `v18.13.0`
* npm 版本 `v8.19.3`
* React 版本 `v18.2.0`
* React-router-dom 版本 `v6.10.0`

## 資料夾說明
```
|- /src
    |- /components：共用元件
    |- /data：存放API及城市中英對照資料
    |- /images：存放Icon、Logo
    |- /pages：頁面
    |- /utils：存放取得Leaflet地圖及授權相關工具
```

## 使用技術
* React
* Tailwind CSS
* Firebase (Database, Cloud Function)
* RWD
* 串接 TDX API
* Web APIs (Geolocation API, LocalStorage API)
* Leaflet

## 第三方服務
* TDX API: [[查看文件](https://tdx.transportdata.tw/api-service/swagger)] [[API 申請](https://tdx.transportdata.tw/register)]
* Leaflet: [[查看文件](https://leafletjs.com/reference.html)]
* Google Fonts: [[查看文件](https://fonts.google.com/)]

*© Hi BUS! | Developed by Lucie
此作品集僅供展示，非用於商業用途。*
