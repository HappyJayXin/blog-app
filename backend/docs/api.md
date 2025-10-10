# API 文件

## 基本資訊
伺服器預設 Base URL 為 `http://localhost:3000`。所有端點皆為公開 API，無需驗證，而裝載體回應以 HTML 或 JSON 為主，依端點而定。

## 功能概覽
| Method | Path | 說明 | 成功回應 |
| --- | --- | --- | --- |
| GET | / | 取得首頁，列出最新圖片與側邊統計 | 200 HTML |
| GET | /images/{image_id} | 取得單一圖片詳情與留言 | 200 HTML |
| POST | /images | 新增圖片，並觸發重新導向至詳情頁 | 302 Redirect |
| POST | /images/{image_id}/like | 對圖片按讚 | 200 JSON |
| POST | /images/{image_id}/comment | 新增圖片留言 | 302 Redirect |

## 端點詳細

### 取得首頁
URL: `GET /`。回傳最新圖片清單與側邊欄資訊的 HTML。伺服器同時提供最新留言與統計資料於頁面，可直接於瀏覽器造訪或使用 curl 擷取。

```bash
curl -i http://localhost:3000/
```

### 取得圖片詳情
URL: `GET /images/{image_id}`。回傳對應圖片的 HTML 詳情頁，包含描述、留言、按讚數量等資訊。若圖片不存在則回傳 404，並重新繪製首頁內容。

```bash
curl -i http://localhost:3000/images/{image_id}
```

### 上傳圖片
URL: `POST /images`。接受 `multipart/form-data`，限制 10 MB，伺服器會先將檔案存於暫存資料夾後再搬至正式目錄。成功後以 302 導向新圖片詳情頁。

| Field | Type | 必填 | 說明 |
| --- | --- | --- | --- |
| title | string | 是 | 圖片標題，會自動裁剪前後空白 |
| description | string | 否 | 圖片描述，可留空 |
| image | file | 是 | 支援 png、jpg、jpeg、gif、webp |

```bash
curl -i -X POST http://localhost:3000/images \
  -F "title=海邊日落" \
  -F "description=日落時分的海邊" \
  -F "image=@/absolute/path/to/photo.jpg"
```

常見錯誤
| 條件 | 狀態碼 | 回應 | 備註 |
| --- | --- | --- | --- |
| 缺少 title 或 image | 400 | HTML，包含錯誤訊息 | 頁面同時回傳最新圖片清單 |
| 檔案副檔名不符 | 400 | HTML，顯示僅接受指定格式 | 不會保留暫存檔案 |
| 伺服器錯誤 | 500 | HTML，顯示稍後再試 | 暫存檔案會在錯誤處理中移除 |

### 對圖片按讚
URL: `POST /images/{image_id}/like`。預期 JSON 回應，並自動累加 likes 欄位。建議在請求中帶入 `Accept: application/json` 以獲得 JSON。

```bash
curl -i -X POST http://localhost:3000/images/{image_id}/like \
  -H "Accept: application/json"
```

成功回應
```json
{
  "success": true,
  "likes": 11
}
```

錯誤回應
| 條件 | 狀態碼 | JSON |
| --- | --- | --- |
| 找不到圖片 | 404 | {"success":false,"message":"image not found"} |
| 伺服器錯誤 | 500 | {"success":false,"message":"internal error"} |

### 新增圖片留言
URL: `POST /images/{image_id}/comment`。接受 `application/x-www-form-urlencoded` 或 `multipart/form-data`。成功寫入留言後以 302 導向原圖片詳情頁，留言會顯示於最新留言列表中。

| Field | Type | 必填 | 說明 |
| --- | --- | --- | --- |
| name | string | 否 | 預設為「訪客」，會裁剪空白 |
| email | string | 否 | 若填寫會裁剪空白 |
| text | string | 是 | 留言內容，會裁剪空白 |

```bash
curl -i -X POST http://localhost:3000/images/{image_id}/comment \
  -d "name=訪客" \
  -d "email=user@example.com" \
  -d "text=很棒的照片"
```

錯誤回應
| 條件 | 狀態碼 | 回應 | 備註 |
| --- | --- | --- | --- |
| text 為空 | 400 | 302 導向原頁面，維持原表單 | 留言不會寫入 |
| 找不到圖片 | 404 | 302 導向首頁 | 使用者會看到首頁最新圖片 |
| 伺服器錯誤 | 500 | 302 導向原頁面 | 系統紀錄錯誤 log |

## 靜態資源
伺服器會透過 `express.static` 提供 `backend/public` 目錄檔案，可直接以 `GET /upload/{filename}` 形式下載圖片。此為純靜態檔案服務，無授權控制。

## 版本與測試
執行 `yarn test` 會使用 Jest 與 Supertest 驗證上述流程，包含首頁載入、圖片詳情、按讚與上傳流程。測試環境預設在記憶體 MongoDB 執行，以保持獨立性。
