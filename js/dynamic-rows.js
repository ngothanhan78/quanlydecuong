// ════════════════════════════════════════════════════════════════
//  dynamic-rows.js  —  v2  (schema-driven)
//
//  ✅ Khi thêm/xóa/sửa cột bảng: chỉ cần sửa DYNAMIC_TABLES trong schema
//     Không cần đụng vào file này.
//
//  Mỗi bảng được render từ DYNAMIC_TABLES[tableId].columns
//  Các trường hợp đặc biệt (lookup, calc) được xử lý tự động.
// ════════════════════════════════════════════════════════════════

const DynRows = {

  // ════════════════════════════════════════════════════════════
  //  _buildCell — sinh HTML <td> cho 1 cột từ column definition
  // ════════════════════════════════════════════════════════════
  _buildCell(col, rowIdx, tableId) {
    const ph = col.placeholder || col.label || '';

    // STT — số thứ tự tự động
    if (col.key === 'STT') {
      return `<td class="col-center">${rowIdx}</td>`;
    }

    // Lookup readonly — tự điền từ field khác
    if (col.readonly && col.lookup) {
      const cls = `lk-${col.key}`;
      return `<td class="col-right">
        <input type="text" class="${cls}" placeholder="Tự động điền"
          readonly style="background:#f8fafc;color:var(--accent)"/>
      </td>`;
    }

    // Readonly calc
    if (col.readonly && col.calc) {
      return `<td class="col-center">
        <input type="number" min="0"
          style="width:55px;background:#f1f5f9;color:var(--accent);font-weight:700"
          readonly placeholder="0"/>
      </td>`;
    }

    // Menu (dropdown từ datalist hoặc select)
    if (col.type === 'menu' || col.type === 'select') {
      // Nếu có datalist đã khai báo
      const dlId = `dl-${col.key}`;
      const dl   = document.getElementById(dlId);
      if (dl) {
        return `<td class="col-left">
          <input type="text" placeholder="${ph}" list="${dlId}" autocomplete="off"
            ${this._oninput(col, tableId)}/>
        </td>`;
      }
      // Fallback: options từ window._opts_<key>
      const opts = (window[`_opts_${col.key}`] || [])
        .map(v => `<option value="${v}">${v}</option>`).join('');
      return `<td class="col-left">
        <select ${this._oninput(col, tableId)}>
          <option value="">-- Chọn --</option>${opts}
        </select>
      </td>`;
    }

    // Number
    if (col.type === 'number') {
      const hasCalc = DYNAMIC_TABLES[tableId]?.columns.some(c => c.calc);
      const oninput = hasCalc
        ? `oninput="Calc.calcTableRow(this,'${tableId}')"`
        : `oninput="Calc.updateTableSum('${tableId}')"`;
      return `<td class="col-center">
        <input type="number" min="0" style="width:55px" placeholder="0" ${oninput}/>
      </td>`;
    }

    // Textarea
    if (col.type === 'textarea') {
      return `<td class="col-left">
        <textarea placeholder="${ph}" ${this._oninput(col, tableId)}></textarea>
      </td>`;
    }

    // Default: text input
    return `<td class="col-left">
      <input type="text" placeholder="${ph}" ${this._oninput(col, tableId)}/>
    </td>`;
  },

  // Helper: tạo oninput nếu column có lookup
  _oninput(col, tableId) {
    if (col.lookup) {
      return `oninput="DynRows._onLookupInput(this,'${col.key}','${tableId}')"`;
    }
    return '';
  },

  // ════════════════════════════════════════════════════════════
  //  addRow — thêm 1 dòng vào bảng theo tableId
  // ════════════════════════════════════════════════════════════
  addRow(tableId) {
    const tableDef = DYNAMIC_TABLES[tableId];
    if (!tableDef) return console.warn(`[DynRows] Không tìm thấy table: ${tableId}`);

    const tbody  = document.getElementById(tableDef.tbodyId);
    if (!tbody) return;

    const rowIdx = tbody.rows.length + 1;
    const tr     = document.createElement('tr');

    // Sinh các cell từ columns
    const cells = tableDef.columns
      .map(col => this._buildCell(col, rowIdx, tableId))
      .join('');

    tr.innerHTML = cells + `<td><button class="btn-del" onclick="DynRows.del(this,'${tableId}')">✕</button></td>`;
    tbody.appendChild(tr);

    // Nếu là bảng nguồn học liệu (saveAs: 'merged') → thêm số thứ tự
    if (tableDef.saveAs === 'merged') {
      this._updateMergedIdx(tableDef.tbodyId);
    }
  },

  // ════════════════════════════════════════════════════════════
  //  del — xóa dòng
  // ════════════════════════════════════════════════════════════
  del(btn, tableId) {
    const tr = btn.closest('tr');
    const tb = btn.closest('tbody');
    tr.remove();
    if (tableId) {
      const def = DYNAMIC_TABLES[tableId];
      if (def?.saveAs === 'merged') this._updateMergedIdx(def.tbodyId);
      if (def?.aggregate) Calc.updateTableSum(tableId);
    }
  },

  // Cập nhật lại số thứ tự [1], [2]... cho bảng nguồn học liệu
  _updateMergedIdx(tbodyId) {
    document.getElementById(tbodyId)?.querySelectorAll('tr').forEach((tr, i) => {
      const sttEl = tr.querySelector('td:first-child');
      if (sttEl && /^\[\d+\]$/.test(sttEl.textContent.trim())) {
        sttEl.textContent = `[${i + 1}]`;
      }
    });
  },

  // ════════════════════════════════════════════════════════════
  //  _onLookupInput — xử lý tự điền khi nhập field anchor
  // ════════════════════════════════════════════════════════════
  _onLookupInput(el, colKey, tableId) {
    const tableDef = DYNAMIC_TABLES[tableId];
    if (!tableDef) return;
    const val = el.value.trim();
    const tr  = el.closest('tr');
    if (!tr) return;

    // Tìm column định nghĩa của colKey
    const anchorCol = tableDef.columns.find(c => c.key === colKey);
    if (!anchorCol?.lookup) return;

    // Tìm tất cả columns phụ thuộc lookup này (by = colKey)
    tableDef.columns.forEach(col => {
      if (!col.lookup || col.lookup.by !== colKey) return;
      const mapKey   = `_lookupMap_${colKey}`;
      const map      = window[mapKey] || {};
      const data     = map[val] || {};
      const cls      = `lk-${col.key}`;
      const targetEl = tr.querySelector(`.${cls}`);
      if (targetEl) targetEl.value = data[col.key] || '';
    });
  },

  // ════════════════════════════════════════════════════════════
  //  validateCLO — ngăn nhập nhiều CLO trong 1 cell
  // ════════════════════════════════════════════════════════════
  validateCLO(el) {
    if (/[,:]/.test(el.value)) {
      el.value = el.value.replace(/[,:]/g, '');
      el.style.borderColor = 'var(--danger)';
      el.title = 'Chỉ được nhập 1 CLO, không dùng dấu phẩy hoặc dấu hai chấm!';
      if (window.UI) UI.toast('⚠️ Mỗi dòng chỉ được nhập 1 CLO!', 'err');
      setTimeout(() => { el.style.borderColor = ''; el.title = ''; }, 2500);
    }
  },

  // ════════════════════════════════════════════════════════════
  //  clearAll — xóa nội dung tất cả bảng
  // ════════════════════════════════════════════════════════════
  clearAll() {
    Object.values(DYNAMIC_TABLES).forEach(def => {
      const el = document.getElementById(def.tbodyId);
      if (el) el.innerHTML = '';
    });
  },

  // ════════════════════════════════════════════════════════════
  //  initDefault — thêm số dòng mặc định khi mở form mới
  //  Cấu hình số dòng mặc định theo tableId
  // ════════════════════════════════════════════════════════════
  initDefault() {
    const defaults = {
      Table01: 2,
      Table02: 3,
      Table03: 2,
      Table04: 1,
      Table05: 1,
      Table06: 2,
      Table07: 1,
      Table08: 1,
    };
    Object.entries(defaults).forEach(([tableId, count]) => {
      for (let i = 0; i < count; i++) this.addRow(tableId);
    });
  },
};

window.DynRows = DynRows;

// ── Shortcuts toàn cục (backward-compatible) ────────────────────
function addGV()      { DynRows.addRow('Table01') }
function addCLO()     { DynRows.addRow('Table02') }
function addChuong()  { DynRows.addRow('Table03') }
function addChiTiet() { DynRows.addRow('Table04') }
function addPP()      { DynRows.addRow('Table05') }
function addDG()      { DynRows.addRow('Table06') }
function addGT()      { DynRows.addRow('Table07') }
function addTL()      { DynRows.addRow('Table08') }
function addPM()      { DynRows.addRow('Table09') }
function delRow(btn)  { DynRows.del(btn)          }
function validateCLOInput(el) { DynRows.validateCLO(el) }
