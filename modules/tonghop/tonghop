// ════════════════════════════════════════════════════════════════
//  modules/tonghop/tonghop.js — UI Tổng hợp đề cương  (v6)
//
//  Thay đổi v6:
//  • Trích xuất có 3 bước bắt buộc:
//    B1: Chọn Trình độ + Ngành (+ Khóa tùy chọn)
//    B2: Chọn fields cần xuất
//    B3: Xem kết quả + download
// ════════════════════════════════════════════════════════════════

const TongHopPanel = {

  _currentTab    : 'kiemtra',
  _trichXuatData : null,
  _filterOptions : null,   // { trinhDo[], nganhByTD{}, khoaByTDNG{} }

  _stepDone : {
    kiemtra : false,
    tonghop : false,
  },

  _unlockTab(tabId) {
    const btn = document.getElementById('thTab-' + tabId);
    if (btn) { btn.disabled = false; btn.classList.remove('locked'); }
  },

  _lockTab(tabId) {
    const btn = document.getElementById('thTab-' + tabId);
    if (btn) { btn.disabled = true; btn.classList.add('locked'); }
  },

  // ════════════════════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════════════════════
  init() {
    this._stepDone.kiemtra = false;
    this._stepDone.tonghop = false;
    ['tonghop','trichxuat'].forEach(t => this._lockTab(t));
    this.switchTab('kiemtra');
  },

  switchTab(tab) {
    if (tab === 'tonghop'  && !this._stepDone.kiemtra) {
      UI.toast('⚠️ Vui lòng hoàn thành Kiểm tra trước.','err'); return;
    }
    if (tab === 'trichxuat' && !this._stepDone.tonghop) {
      UI.toast('⚠️ Vui lòng hoàn thành Tổng hợp trước.','err'); return;
    }
    this._currentTab = tab;
    document.querySelectorAll('[data-th-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.thTab === tab);
    });
    document.querySelectorAll('[data-th-panel]').forEach(el => {
      el.style.display = el.dataset.thPanel === tab ? '' : 'none';
    });
    if (tab === 'trichxuat') this._initTrichXuat();
  },

  _setLoading(tab, on, msg) {
    const el = document.getElementById('thLoading-' + tab);
    if (el) { el.style.display = on ? '' : 'none'; el.textContent = msg || ''; }
  },

  // ════════════════════════════════════════════════════════════
  //  TAB 1 — KIỂM TRA NỘP BÀI
  // ════════════════════════════════════════════════════════════
  async runKiemTra() {
    this._setLoading('kiemtra', true, '🔍 Đang kiểm tra...');
    const res = await TongHopAPI.kiemTraNopBai();
    this._setLoading('kiemtra', false);
    if (!res?.success) { UI.toast('❌ ' + (res?.message||'Lỗi'),'err'); return; }

    const box = document.getElementById('thKiemTraResult');
    if (!box) return;
    box.style.display = 'block';

    const pct = res.total ? Math.round((res.daNop/res.total)*100) : 0;
    box.innerHTML = `
      <div class="th-summary">
        <div class="th-stat ok">✅ Đã nộp<br><b>${res.daNop}</b></div>
        <div class="th-stat err">❌ Chưa nộp<br><b>${res.chuaNop}</b></div>
        <div class="th-stat">📋 Tổng<br><b>${res.total}</b></div>
        <div class="th-stat"><div class="th-progress-ring">${pct}%</div></div>
      </div>
      <table class="th-table">
        <thead><tr><th>#</th><th>Mã HP</th><th>Tên học phần</th><th>Trạng thái</th></tr></thead>
        <tbody>
          ${(res.result||[]).map((r,i) => `
            <tr class="${r.daNop?'row-ok':'row-err'}">
              <td>${i+1}</td><td>${r.maHP}</td><td>${r.tenHP}</td>
              <td>${r.status}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    this._stepDone.kiemtra = true;
    this._unlockTab('tonghop');
    UI.toast('✅ Kiểm tra hoàn tất!','ok');
  },

  // ════════════════════════════════════════════════════════════
  //  TAB 2 — TỔNG HỢP
  // ════════════════════════════════════════════════════════════
  async runTongHop() {
    if (!confirm('Bắt đầu tổng hợp? Quá trình có thể mất 1-2 phút.')) return;
    this._setLoading('tonghop', true, '🗂 Đang tổng hợp đề cương...');
    const res = await TongHopAPI.tongHop();
    this._setLoading('tonghop', false);
    if (!res?.success) { UI.toast('❌ ' + (res?.message||'Lỗi'),'err'); return; }

    const box = document.getElementById('thTongHopResult');
    if (box) {
      box.style.display = 'block';
      box.innerHTML = `
        <div class="th-result-card ok">
          <div class="th-result-icon">✅</div>
          <div>
            <b>${res.message}</b><br>
            <span>Phiên bản: <code>${res.version ? 'Ver_'+res.version : 'N/A'}</code></span>
          </div>
        </div>`;
    }
    this._stepDone.tonghop = true;
    this._unlockTab('trichxuat');
    UI.toast('✅ Tổng hợp hoàn tất!','ok');
  },

  // ════════════════════════════════════════════════════════════
  //  TAB 3 — TRÍCH XUẤT (v6: 3 bước bắt buộc)
  // ════════════════════════════════════════════════════════════
  async _initTrichXuat() {
    // Reset về bước 1
    this._showTXStep(1);
    this._trichXuatData = null;

    // Load filter options từ GAS
    const loadEl = document.getElementById('thTX-step1-loading');
    if (loadEl) loadEl.style.display = '';
    const res = await TongHopAPI.getFilterOptions();
    if (loadEl) loadEl.style.display = 'none';

    if (!res?.success) {
      UI.toast('❌ ' + (res?.message||'Lỗi tải options'),'err');
      return;
    }
    this._filterOptions = res;
    this._renderTXStep1(res);
  },

  _showTXStep(step) {
    [1,2,3].forEach(s => {
      const el = document.getElementById('thTX-step' + s);
      if (el) el.style.display = (s === step) ? '' : 'none';
    });
    // Update step indicator
    document.querySelectorAll('.tx-step-dot').forEach((dot,i) => {
      dot.classList.toggle('active', i+1 === step);
      dot.classList.toggle('done', i+1 < step);
    });
  },

  // ── Step 1: Chọn Trình độ → Ngành → Khóa ────────────────────
  _renderTXStep1(opts) {
    const tdSel = document.getElementById('thTX-trinhdo');
    if (!tdSel) return;

    tdSel.innerHTML = '<option value="">— Chọn trình độ —</option>' +
      opts.trinhDo.map(td => `<option value="${td}">${td}</option>`).join('');

    // Reset ngành và khóa
    this._renderTXNganh(null);
    this._renderTXKhoa(null, null);
    this._checkStep1();
  },

  onTDChange() {
    const td = document.getElementById('thTX-trinhdo')?.value;
    this._renderTXNganh(td);
    this._renderTXKhoa(null, null);
    this._checkStep1();
  },

  _renderTXNganh(trinhDo) {
    const sel = document.getElementById('thTX-nganh');
    if (!sel) return;
    if (!trinhDo || !this._filterOptions) {
      sel.innerHTML = '<option value="">— Chọn trình độ trước —</option>';
      sel.disabled = true;
      return;
    }
    const opts = this._filterOptions.nganhByTD[trinhDo] || [];
    sel.disabled = false;
    sel.innerHTML = '<option value="">— Chọn ngành đào tạo —</option>' +
      opts.map(ng => `<option value="${ng}">${ng}</option>`).join('');
  },

  onNganhChange() {
    const td = document.getElementById('thTX-trinhdo')?.value;
    const ng = document.getElementById('thTX-nganh')?.value;
    this._renderTXKhoa(td, ng);
    this._checkStep1();
  },

  _renderTXKhoa(trinhDo, nganhDT) {
    const sel = document.getElementById('thTX-khoa');
    if (!sel) return;
    if (!trinhDo || !nganhDT || !this._filterOptions) {
      sel.innerHTML = '<option value="">(Tất cả khóa)</option>';
      sel.disabled = true;
      return;
    }
    const key  = trinhDo + '||' + nganhDT;
    const opts = this._filterOptions.khoaByTDNG?.[key] || [];
    sel.disabled = false;
    sel.innerHTML = '<option value="">(Tất cả khóa)</option>' +
      opts.map(kh => `<option value="${kh}">${kh}</option>`).join('');
  },

  _checkStep1() {
    const td  = document.getElementById('thTX-trinhdo')?.value;
    const ng  = document.getElementById('thTX-nganh')?.value;
    const btn = document.getElementById('thTX-nextStep1');
    if (btn) btn.disabled = !(td && ng);
  },

  goStep2() {
    const td = document.getElementById('thTX-trinhdo')?.value;
    const ng = document.getElementById('thTX-nganh')?.value;
    if (!td || !ng) { UI.toast('Vui lòng chọn đủ Trình độ và Ngành.','err'); return; }

    // Hiện thông tin đã chọn ở step 2
    const info = document.getElementById('thTX-step2-filter');
    if (info) {
      const kh = document.getElementById('thTX-khoa')?.value;
      info.textContent = `${td} — ${ng}${kh ? ' — Khóa: '+kh : ' — (Tất cả khóa)'}`;
    }

    // Render danh sách fields có thể chọn
    this._renderFieldCheckboxes();
    this._showTXStep(2);
  },

  // ── Step 2: Chọn fields cần xuất ─────────────────────────────
  _renderFieldCheckboxes() {
    const container = document.getElementById('thTX-fields');
    if (!container) return;

    // Fields mặc định luôn có (không cho bỏ)
    const defaults = ['maHP','tenViet','chunhiem'];

    // Fields có thể chọn thêm — lấy từ FIELD_SCHEMA
    const available = Object.entries(FIELD_SCHEMA)
      .filter(([key, f]) =>
        f.saveToSheet &&
        f.showInForm &&
        !defaults.includes(key) &&
        f.type !== 'calc' &&
        f.type !== 'hidden'
      )
      .map(([key, f]) => ({ key, label: f.label, section: f.section }));

    // Group theo section
    const bySection = {};
    available.forEach(f => {
      if (!bySection[f.section]) bySection[f.section] = [];
      bySection[f.section].push(f);
    });

    let html = `
      <div class="tx-fields-note">
        <b>Mặc định luôn có:</b> Mã HP, Tên học phần, Chủ nhiệm HP
      </div>
      <div class="tx-fields-label">Chọn thêm field cần xuất:</div>`;

    Object.entries(bySection).sort(([a],[b])=>+a-+b).forEach(([sec, fields]) => {
      const secDef = SECTIONS?.find(s => s.id === +sec);
      html += `<div class="tx-section-label">${secDef?.label || 'Section '+sec}</div>`;
      html += `<div class="tx-fields-grid">`;
      fields.forEach(f => {
        html += `<label class="tx-field-check">
          <input type="checkbox" name="txField" value="${f.key}">
          ${f.label}
        </label>`;
      });
      html += `</div>`;
    });

    container.innerHTML = html;
  },

  goStep1() { this._showTXStep(1); },

  async goStep3() {
    const td  = document.getElementById('thTX-trinhdo')?.value;
    const ng  = document.getElementById('thTX-nganh')?.value;
    const kh  = document.getElementById('thTX-khoa')?.value;

    const checked = [...document.querySelectorAll('input[name=txField]:checked')]
      .map(el => el.value);

    const filters = { trinhDo: td, nganhDT: ng, ...(kh ? { khoaDT: kh } : {}) };

    this._setLoading('trichxuat', true, '🔍 Đang trích xuất dữ liệu...');
    const res = await TongHopAPI.trichXuat(filters, checked);
    this._setLoading('trichxuat', false);

    if (!res?.success) { UI.toast('❌ ' + (res?.message||'Lỗi'),'err'); return; }

    this._trichXuatData = res;
    this._renderTXResult(res);
    this._showTXStep(3);
  },

  // ── Step 3: Hiển thị kết quả ──────────────────────────────────
  _renderTXResult(res) {
    const box = document.getElementById('thTX-result-box');
    if (!box) return;

    // Tiêu đề
    const title = document.getElementById('thTX-result-title');
    if (title) {
      title.textContent =
        `${res.trinhDo} — ${res.nganhDT} — ${res.khoaDT} — ${res.total} học phần`;
    }

    // Bảng kết quả
    const thead = document.getElementById('thTX-thead');
    const tbody = document.getElementById('thTX-tbody');
    if (thead) thead.innerHTML = '<tr>' +
      res.exportHeaders.map(h => `<th>${h}</th>`).join('') + '</tr>';
    if (tbody) tbody.innerHTML = res.exportRows.map(row =>
      '<tr>' + row.map(cell => `<td>${cell||''}</td>`).join('') + '</tr>'
    ).join('');
  },

  goStep2FromResult() { this._showTXStep(2); },

  // ── Download CSV ──────────────────────────────────────────────
  downloadTrichXuat() {
    const data = this._trichXuatData;
    if (!data) { UI.toast('Chưa có dữ liệu.','err'); return; }

    const csvRows = [
      data.exportHeaders,
      ...data.exportRows,
    ].map(row => row.map(cell =>
      '"' + String(cell||'').replace(/"/g, '""') + '"'
    ).join(',')).join('\n');

    const BOM  = '\uFEFF';
    const blob = new Blob([BOM + csvRows], { type: 'text/csv;charset=utf-8;' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `TrichXuat_${data.trinhDo}_${data.nganhDT}_${data.khoaDT}.csv`
      .replace(/\s+/g,'_').replace(/[()]/g,'');
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

window.TongHopPanel = TongHopPanel;

// ── Shortcuts toàn cục ──────────────────────────────────────────
function thSwitchTab(tab)   { TongHopPanel.switchTab(tab)    }
function thRunKiemTra()     { TongHopPanel.runKiemTra()      }
function thRunTongHop()     { TongHopPanel.runTongHop()      }
function thTXonTDChange()   { TongHopPanel.onTDChange()      }
function thTXonNganhChange(){ TongHopPanel.onNganhChange()   }
function thTXgoStep2()      { TongHopPanel.goStep2()         }
function thTXgoStep1()      { TongHopPanel.goStep1()         }
function thTXgoStep3()      { TongHopPanel.goStep3()         }
function thTXgoStep2Back()  { TongHopPanel.goStep2FromResult()}
function thDownload()       { TongHopPanel.downloadTrichXuat()}
