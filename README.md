# Hệ thống Quản lý Đề cương HUFI KCNHH — v6

## Kiến trúc mới

| File | Mô tả |
|------|-------|
| data/field-schema.js | NGUỒN SỰ THẬT — do Schema Generator tạo |
| config/environment.config.js | Cấu hình môi trường (điền 1 lần) |
| gas/data-input.config.gs | TẤT CẢ nguồn input |
| gas/data-output.config.gs | TẤT CẢ đích output |
| gas/config.gs | Router GAS |
| gas/auth.gs | Xác thực |
| js/app.js | App khởi tạo + filter Hocphan + auto-fill cnHp |
| js/api.js | Giao tiếp GAS |
| js/form.js | Schema-driven form |
| js/calc.js | Schema-driven calc |
| js/dynamic-rows.js | Schema-driven tables |
| tools/schema-generator.html | Tool tạo field-schema.js |

## Khi template thay đổi
1. Mở tools/schema-generator.html
2. Upload Template_ĐCCT.docx + Template_ĐCTQ.docx + BanVeThietKe_v6.xlsx
3. Bấm "Tạo field-schema.js" → Download
4. Copy vào data/field-schema.js

## Tính năng mới v6
- Dropdown tenTV chỉ hiện HP mà user đó là chủ nhiệm
- Field chunhiem tự điền tên user sau login, readonly
- data-input.config.gs: tách riêng toàn bộ nguồn input
- data-output.config.gs: tách riêng toàn bộ đích output
- Schema Generator Tool: tự động tạo schema từ Word + Excel
