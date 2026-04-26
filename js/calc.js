// ════════════════════════════════════════════════════════════════
//  calc.js  —  v2  (schema-driven)
//
//  ✅ Khi thêm/sửa field calc: chỉ cần sửa formula trong field-schema.js
//  ✅ Khi thêm/sửa cột calc trong bảng: sửa calc trong DYNAMIC_TABLES
//     Không cần đụng vào file này.
// ════════════════════════════════════════════════════════════════

const Calc = {

  // ── Lấy value số từ DOM element ──────────────────────────────
  _num(id) {
    return parseFloat(document.getElementById(id)?.value) || 0;
  },

  // ── Evaluate formula từ schema với context là object {varName: value} ─
  // Hỗ trợ: +, -, *, /, (), số thực
  // Ví dụ: '(tinchiLT * 1.73) + (tinchiTH * 1.64)'
  _evalFormula(formula, ctx) {
    try {
      // Thay tên biến bằng giá trị số
      const expr = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, k => {
        const v = ctx[k];
        return (v !== undefined && v !== '') ? Number(v) : 0;
      });
      // eslint-disable-next-line no-new-func
      return +(new Function('return ' + expr)()).toFixed(2);
    } catch {
      return 0;
    }
  },

  // ════════════════════════════════════════════════════════════
  //  calcTC — tính tất cả field type='calc' trong FIELD_SCHEMA
  //  Đọc input fields → evaluate formula → ghi ra display + hidden
  // ════════════════════════════════════════════════════════════
  calcTC() {
    // Bước 1: thu thập context từ tất cả field số có trong DOM
    const ctx = {};
    Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
      if (['number', 'text', 'hidden'].includes(f.type)) {
        const el = document.getElementById(f.formId || key);
        if (el) ctx[f.dataKey || key] = parseFloat(el.value) || 0;
      }
    });

    // Bước 2: tính từng calc field
    Object.entries(FIELD_SCHEMA)
      .filter(([, f]) => f.type === 'calc' && f.formula)
      .forEach(([key, f]) => {
        const result  = this._evalFormula(f.formula, ctx);
        const hasInput = Object.values(ctx).some(v => v > 0);
        const fmtVal  = hasInput ? result : '';

        // Cập nhật context để các formula sau dùng được
        ctx[f.dataKey || key] = result;

        // Display element (span/div) và hidden input
        const displayId = f.formId || key;
        const display   = document.getElementById(displayId + 'Display') ||
                          document.getElementById(displayId);
        const hidden    = document.getElementById(displayId + '_val') ||
                          document.getElementById(displayId);

        if (display && display.tagName !== 'INPUT') {
          display.textContent = hasInput ? result : '—';
        }
        if (hidden && hidden.tagName === 'INPUT') {
          hidden.value = fmtVal;
        }
      });

    // Bước 3: cập nhật tổng TC (field tinchi = tinchiLT + tinchiTH)
    const tcEl = document.getElementById('tinchi') ||
                 document.getElementById('tcTong');
    if (tcEl) {
      const tong = ctx['tinchiLT'] + ctx['tinchiTH'];
      if (tong > 0) tcEl.value = tong;
    }
  },

  // ════════════════════════════════════════════════════════════
  //  calcTableRow — tính calc column trong 1 dòng bảng động
  //  Đọc từ DYNAMIC_TABLES[tableId].columns[].calc
  // ════════════════════════════════════════════════════════════
  calcTableRow(el, tableId) {
    tableId = tableId || 'Table03';
    const tableDef = DYNAMIC_TABLES[tableId];
    if (!tableDef) return;

    const tr   = el.closest('tr');
    if (!tr) return;

    // Thu thập context từ các input trong dòng
    const ctx  = {};
    const cols = tableDef.columns.filter(c => !c.readonly || c.calc);
    const inputs = tr.querySelectorAll('input[type=number], input[type=text], select, textarea');

    // Map theo thứ tự cột
    tableDef.columns.forEach((col, i) => {
      if (col.key === 'STT') return;
      const inp = inputs[i] || inputs[i - 1];
      if (inp) ctx[col.key] = parseFloat(inp.value) || 0;
    });

    // Tính và ghi ngược lại cho các cột có calc
    tableDef.columns.forEach((col, i) => {
      if (!col.calc) return;
      const result = this._evalFormula(col.calc, ctx);
      const inp    = inputs[i] || inputs[i - 1];
      if (inp) inp.value = result ? +result.toFixed(1) : '';
    });

    this.updateTableSum(tableId);
  },

  // ════════════════════════════════════════════════════════════
  //  updateTableSum — cập nhật dòng tổng cho bảng có aggregate
  //  Đọc từ DYNAMIC_TABLES[tableId].aggregate
  // ════════════════════════════════════════════════════════════
  updateTableSum(tableId) {
    tableId = tableId || 'Table03';
    const tableDef = DYNAMIC_TABLES[tableId];
    if (!tableDef?.aggregate) return;

    const tbody = document.getElementById(tableDef.tbodyId);
    if (!tbody) return;

    // Tính SUM cho từng cột theo aggregate
    const sums = {};
    tbody.querySelectorAll('tr').forEach(tr => {
      tableDef.columns.forEach((col, i) => {
        if (!tableDef.aggregate[col.key] &&
            !Object.values(tableDef.aggregate).some(f => f.includes(col.key))) return;
        const inp = tr.querySelectorAll('input[type=number]')[i];
        sums[col.key] = (sums[col.key] || 0) + (parseFloat(inp?.value) || 0);
      });
    });

    // Ghi ra element tổng (id = aggregateKey)
    Object.entries(tableDef.aggregate).forEach(([sumKey, formula]) => {
      // formula dạng 'SUM(colKey)' → lấy colKey
      const match = formula.match(/SUM\((\w+)\)/);
      if (!match) return;
      const colKey = match[1];
      const el     = document.getElementById(sumKey);
      if (el) el.textContent = sums[colKey] ? Math.round(sums[colKey]) : 0;
    });
  },

  // ════════════════════════════════════════════════════════════
  //  updateQuyDinh — render nội dung tĩnh section Quy định
  //  (không phụ thuộc schema — nội dung từ APP_CONFIG.QUY_DINH)
  // ════════════════════════════════════════════════════════════
  updateQuyDinh() {
    const el       = document.getElementById('quyDinhDK');
    const isCotLoi = document.getElementById('hpCotLoi')?.value === 'yes';
    const cfg      = APP_CONFIG.QUY_DINH;
    if (!el) return;

    el.innerHTML = '<b>Điều kiện đạt học phần:</b> ' + cfg.dkDat_ref
      + '<br>- ' + cfg.dkDat_thuong
      + (isCotLoi ? '<br>- ' + cfg.dkDat_cotloi : '');
  },

  // ════════════════════════════════════════════════════════════
  //  updateHuongDan — render đoạn text Hướng dẫn thực hiện
  //  Đọc field từ FIELD_SCHEMA theo section 10
  // ════════════════════════════════════════════════════════════
  updateHuongDan() {
    const el = document.getElementById('hdText');
    if (!el) return;

    // Đọc các field section 10 từ schema
    const get = (key) => {
      const f   = Object.values(FIELD_SCHEMA).find(f => f.dataKey === key);
      const fId = f?.formId || key;
      return document.getElementById(fId)?.value || '';
    };

    const trinhDo = get('hdTrinh')  || get('trinhDoHP') || '<trình độ>';
    const nganh   = get('hdNganh')  || get('nganhDT')   || '<tên ngành>';
    const khoa    = get('hdKhoa')   || get('khoaDT')    || '<Khóa>';
    const hk      = get('hdHocky')  || get('hockyDT')   || '<Học kỳ>';
    const namHoc  = get('namhoc')   || '<Năm học>';
    const thoiDiem = (hk && namHoc) ? `${hk} năm học ${namHoc}` : hk || namHoc || '<Thời điểm>';

    el.innerHTML = `
      <b>- Phạm vi áp dụng:</b> Đề cương này được áp dụng cho chương trình đào tạo
      <strong>${trinhDo}</strong> ngành <strong>${nganh}</strong>,
      từ <strong>${khoa}</strong>, năm học <strong>${thoiDiem}</strong>;<br>
      <b>- Giảng viên:</b> sử dụng đề cương này để làm cơ sở cho việc chuẩn bị bài giảng,
      lên kế hoạch giảng dạy và đánh giá kết quả học tập của người học;<br>
      <b>- Lưu ý:</b> Trước khi giảng dạy, giảng viên cần nêu rõ các nội dung chính
      của đề cương học phần cho người học;<br>
      <b>- Người học:</b> sử dụng đề cương này làm cơ sở để nắm được thông tin chi tiết
      về học phần, từ đó xác định phương pháp học tập phù hợp.
    `;
  },

  // ── Lookup tự động khi chọn học phần ────────────────────────
  autoFillLookup(anchorKey, anchorValue) {
    // Tìm tất cả field có lookup.by = anchorKey
    Object.entries(FIELD_SCHEMA)
      .filter(([, f]) => f.lookup?.by === anchorKey)
      .forEach(([key, f]) => {
        const map  = window[`_lookupMap_${anchorKey}`] || {};
        const data = map[anchorValue?.trim()];
        if (!data) return;
        const targetKey = f.dataKey || key;
        const el = document.getElementById(f.formId || key);
        if (el && data[targetKey] !== undefined) {
          el.value = data[targetKey];
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
  },

  // ── Toggle quy định cốt lõi ──────────────────────────────────
  toggleLoaiDK() {
    const isCotLoi = document.getElementById('hpCotLoi')?.value === 'yes';
    const field    = document.getElementById('fieldLoaiDK');
    const loaiDK   = document.getElementById('loaiDK');
    if (field) field.style.display = isCotLoi ? '' : 'none';
    if (loaiDK && isCotLoi) loaiDK.value = 'cotloi';
    else if (loaiDK)        loaiDK.value = 'thuong';
    this.updateQuyDinh();
  },
};

window.Calc = Calc;

// ── Shortcuts toàn cục (dùng trong HTML oninput=) ───────────────
function calcTC()                     { Calc.calcTC()                          }
function calcChuongRow(el)            { Calc.calcTableRow(el, 'Table03'); }
function updateChuongSum()            { Calc.updateTableSum('Table03')          }
function updateQuyDinh()              { Calc.updateQuyDinh()                    }
function updateHuongDan()             { Calc.updateHuongDan()                   }
function toggleLoaiDK()               { Calc.toggleLoaiDK()                     }
function autoFillHocphan(val)         { Calc.autoFillLookup('tenTV', val)       }
function togglePheduyet()             { /* checkbox độc lập — không làm gì */   }
