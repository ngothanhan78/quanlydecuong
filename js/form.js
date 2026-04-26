// ════════════════════════════════════════════════════════════════
//  form.js  —  v2  (schema-driven)
//
//  ✅ Khi thêm/xóa field: chỉ cần sửa FIELD_SCHEMA trong schema
//  ✅ Khi thêm/xóa bảng: chỉ cần sửa DYNAMIC_TABLES trong schema
//     Không cần đụng vào file này.
// ════════════════════════════════════════════════════════════════

const Form = {

  // ── DOM helpers ───────────────────────────────────────────────
  _v(id)        { return document.getElementById(id)?.value?.trim() || '' },
  _set(id, val) {
    const el = document.getElementById(id);
    if (!el || val === undefined) return;
    el.value = val || '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  },
  _check(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  },

  // ════════════════════════════════════════════════════════════
  //  collectAll — đọc toàn bộ form → object data
  //  Hoàn toàn schema-driven: loop FIELD_SCHEMA + DYNAMIC_TABLES
  // ════════════════════════════════════════════════════════════
  collectAll() {
    const data = {};

    // ── 1. Field tĩnh — đọc theo type từ FIELD_SCHEMA ──────────
    Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
      if (f.type === 'hidden' || f.type === 'calc') {
        // Calc & hidden: đọc từ hidden input hoặc _val
        const el = document.getElementById((f.formId || key) + '_val')
                || document.getElementById(f.formId || key);
        if (el) data[f.dataKey || key] = el.value?.trim() || '';
        return;
      }

      if (f.type === 'checkbox') {
        // Checkbox nhóm (groupId): gộp thành array
        const groupId = f.groupId || (f.dataKey || key);
        if (!data[groupId]) data[groupId] = [];
        const el = document.getElementById(f.formId || key);
        if (el?.checked) data[groupId].push(el.value || key);
        return;
      }

      // text, number, textarea, date, menu, checklist, select
      const el = document.getElementById(f.formId || key);
      if (!el) return;
      data[f.dataKey || key] = el.value?.trim() || '';
    });

    // ── 2. Bảng động — loop DYNAMIC_TABLES ─────────────────────
    Object.entries(DYNAMIC_TABLES).forEach(([tableId, def]) => {
      const tbody = document.getElementById(def.tbodyId);
      if (!tbody) return;

      if (def.saveAs === 'merged') {
        // Bảng nguồn học liệu: mỗi dòng là 1 string
        const rows = [];
        tbody.querySelectorAll('tr').forEach(tr => {
          const inp = tr.querySelector('input[type=text],input:not([type]),textarea');
          if (inp?.value?.trim()) rows.push(inp.value.trim());
        });
        data[def.anchorField] = rows;
        return;
      }

      // Bảng thông thường: mỗi dòng là object {colKey: value}
      const rows = [];
      tbody.querySelectorAll('tr').forEach(tr => {
        const row = {};
        const inputs = tr.querySelectorAll('input,select,textarea');
        def.columns.forEach((col, i) => {
          if (col.key === 'STT') { row[col.key] = tr.rowIndex; return; }
          const el = inputs[i] || inputs[i > 0 ? i - 1 : 0];
          row[col.key] = el?.value?.trim() || '';
        });
        // Bỏ qua dòng hoàn toàn trống
        const hasData = Object.entries(row).some(([k, v]) => k !== 'STT' && v);
        if (hasData) rows.push(row);
      });
      data[tableId] = rows;
    });

    return data;
  },

  // ════════════════════════════════════════════════════════════
  //  fill — điền dữ liệu từ object d vào form
  //  Hoàn toàn schema-driven
  // ════════════════════════════════════════════════════════════
  fill(d) {
    if (!d) return;

    // ── 1. Field tĩnh ───────────────────────────────────────────
    Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
      const val = d[f.dataKey || key];
      if (val === undefined) return;

      if (f.type === 'checkbox') {
        // Checkbox group: tick nếu value nằm trong array
        const el = document.getElementById(f.formId || key);
        if (el) el.checked = Array.isArray(d[f.groupId || f.dataKey || key])
          ? d[f.groupId || f.dataKey || key].includes(el.value || key)
          : !!val;
        return;
      }

      if (f.type === 'calc' || f.type === 'hidden') {
        // Calc: điền vào hidden input và trigger recalc cuối
        const hidEl = document.getElementById((f.formId || key) + '_val')
                   || document.getElementById(f.formId || key);
        if (hidEl) hidEl.value = val;
        return;
      }

      this._set(f.formId || key, val);
    });

    // Trigger tính lại calc sau khi điền
    setTimeout(() => Calc.calcTC(), 50);

    // ── 2. Bảng động ─────────────────────────────────────────────
    Object.entries(DYNAMIC_TABLES).forEach(([tableId, def]) => {
      const tbody = document.getElementById(def.tbodyId);
      if (!tbody) return;
      tbody.innerHTML = '';

      if (def.saveAs === 'merged') {
        // Mảng string
        const arr = d[def.anchorField] || [];
        arr.forEach(val => {
          DynRows.addRow(tableId);
          const tr  = tbody.lastElementChild;
          const inp = tr?.querySelector('input[type=text],input:not([type]),textarea');
          if (inp) inp.value = val;
        });
        return;
      }

      // Mảng object
      const rows = d[tableId] || [];
      rows.forEach(row => {
        DynRows.addRow(tableId);
        const tr     = tbody.lastElementChild;
        if (!tr) return;
        const inputs = tr.querySelectorAll('input,select,textarea');

        def.columns.forEach((col, i) => {
          if (col.key === 'STT') return;
          const el = inputs[i] || inputs[i > 0 ? i - 1 : 0];
          if (el && row[col.key] !== undefined) {
            el.value = String(row[col.key] || '');
            el.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });

      // Tính lại aggregate nếu có
      if (def.aggregate) setTimeout(() => Calc.updateTableSum(tableId), 100);
    });

    // Cập nhật các render phụ
    setTimeout(() => {
      Calc.updateQuyDinh();
      Calc.updateHuongDan();
    }, 100);
  },

  // ════════════════════════════════════════════════════════════
  //  reset — xóa sạch form
  // ════════════════════════════════════════════════════════════
  reset() {
    // Reset tất cả input trong form
    document.querySelectorAll(
      '#mod-form input[type=text], #mod-form input[type=number],' +
      '#mod-form input[type=email], #mod-form input[type=date],' +
      '#mod-form textarea, #mod-form select'
    ).forEach(el => {
      if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });
    document.querySelectorAll('#mod-form input[type=checkbox]').forEach(el => el.checked = false);

    // Reset display của calc fields từ schema
    Object.entries(FIELD_SCHEMA)
      .filter(([, f]) => f.type === 'calc')
      .forEach(([key, f]) => {
        const id  = f.formId || key;
        const dis = document.getElementById(id + 'Display') || document.getElementById(id);
        if (dis && dis.tagName !== 'INPUT') dis.textContent = '—';
      });

    DynRows.clearAll();
    DynRows.initDefault();
  },

  // ════════════════════════════════════════════════════════════
  //  validate — kiểm tra field bắt buộc trước khi chuyển section
  //  Trả về số field còn trống (0 = hợp lệ)
  // ════════════════════════════════════════════════════════════
  validate(sectionIdx) {
    document.querySelectorAll('.field-empty').forEach(el => el.classList.remove('field-empty'));
    document.querySelectorAll('.field-empty-label').forEach(el => el.remove());

    let emptyCount = 0;

    // ── Field tĩnh: đọc required từ FIELD_SCHEMA ──
    Object.values(FIELD_SCHEMA)
      .filter(f => f.section === sectionIdx && f.required && f.showInForm && f.type !== 'hidden')
      .forEach(f => {
        const el = document.getElementById(f.formId || f.dataKey);
        if (!el) return;
        const val = el.tagName === 'SELECT' ? el.value : el.value?.trim();
        if (!val) {
          el.classList.add('field-empty');
          const hint = document.createElement('span');
          hint.className   = 'field-empty-label';
          hint.textContent = '⚠ Chưa điền';
          el.parentNode.insertBefore(hint, el.nextSibling);
          emptyCount++;
        }
      });

    // ── Bảng động: kiểm tra các bảng thuộc section này ──
    Object.entries(DYNAMIC_TABLES)
      .filter(([, def]) => def.section === sectionIdx)
      .forEach(([tableId, def]) => {
        const tbody = document.getElementById(def.tbodyId);
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        if (rows.length === 0) {
          emptyCount++;
          if (window.UI) UI.toast(`⚠️ Bảng "${def.label}" chưa có dữ liệu!`, 'err');
        } else {
          rows.forEach(row => {
            row.querySelectorAll('input:not([readonly]):not([type=hidden]), select').forEach(el => {
              // Bỏ qua field nhỏ (%) và calc
              if (el.readOnly || el.style.width === '55px') return;
              const val = el.tagName === 'SELECT' ? el.value : el.value?.trim();
              if (!val) { el.classList.add('field-empty'); emptyCount++; }
            });
          });
        }
      });

    return emptyCount;
  },

  // ════════════════════════════════════════════════════════════
  //  validateFinal — validate các field cốt lõi trước khi submit
  //  Đọc từ FIELD_SCHEMA: required=true, section=1
  // ════════════════════════════════════════════════════════════
  validateFinal() {
    return Object.entries(FIELD_SCHEMA)
      .filter(([, f]) => f.required && f.showInForm)
      .filter(([key, f]) => {
        const el = document.getElementById(f.formId || key);
        return !el || !el.value?.trim();
      })
      .map(([, f]) => ({ id: f.formId, label: f.label }));
  },
};

window.Form = Form;

// ── Shortcuts toàn cục (backward-compatible) ────────────────────
function collectAllData() { return Form.collectAll() }
function fillForm(d)      { Form.fill(d)             }
function resetForm()      { Form.reset()             }
