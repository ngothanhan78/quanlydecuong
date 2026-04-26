// ════════════════════════════════════════════════════════════════
//  app.js — Khởi tạo App, Router module  (v6)
//
//  Tính năng mới v6:
//  • Sau login → gọi getMenuData với userName → filter Hocphan
//  • Sau login → auto-fill field chunhiem = user.name (readonly)
// ════════════════════════════════════════════════════════════════

const App = (() => {

  // ── State ────────────────────────────────────────────────────
  let _currentModule = null;
  let _menuData      = null;

  // ── Modules registry ─────────────────────────────────────────
  const modules = {
    dashboard : { init: initDashboard  },
    library   : { init: initLibrary    },
    form      : { init: initForm       },
    admin     : { init: initAdmin      },
    tonghop   : { init: initTonghop    },
  };

  // ════════════════════════════════════════════════════════════
  //  BOOT — Gọi sau khi đăng nhập thành công
  // ════════════════════════════════════════════════════════════
  async function boot(user) {
    // Lưu session
    sessionStorage.setItem('dcUser', JSON.stringify(user));

    // Áp dụng phân quyền lên DOM
    RBAC.applyToDOM();

    // Hiện tên user
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = user.name;
    const roleEl = document.getElementById('userRole');
    if (roleEl) roleEl.textContent = ENV_CONFIG.ROLE_LABELS?.[user.role] || user.role;

    // Load menu data với userName để filter Hocphan (v6)
    await loadMenuData();

    // Auto-fill chunhiem sau login (v6)
    _autoFillContextFields(user);

    // Navigate đến dashboard
    navigate('dashboard');
  }

  // ════════════════════════════════════════════════════════════
  //  LOAD MENU DATA — Gọi GAS getMenuData với userName
  // ════════════════════════════════════════════════════════════
  async function loadMenuData() {
    try {
      UI.setLoading(true, 'Đang tải dữ liệu...');
      const res = await API.getMenuData();
      if (!res?.success) throw new Error(res?.message || 'Lỗi getMenuData');

      _menuData = res.data;
      _applyMenuData(_menuData);
      UI.setLoading(false);
    } catch(err) {
      UI.setLoading(false);
      UI.toast('⚠️ Không tải được dữ liệu: ' + err.message, 'err');
    }
  }

  // ── Áp dụng menuData vào form ────────────────────────────────
  function _applyMenuData(data) {
    if (!data) return;

    // Nạp options cho từng field có source trong FIELD_SCHEMA
    Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
      if (!f.source?.sheet) return;
      const el = document.getElementById(f.formId || key);
      if (!el) return;

      // Map sheet name → data key
      const opts = _getOptsForField(key, f, data);
      if (!opts?.length) return;

      // Nạp vào datalist
      const dlId = `dl-${key}`;
      let dl = document.getElementById(dlId);
      if (!dl) {
        dl = document.createElement('datalist');
        dl.id = dlId;
        document.body.appendChild(dl);
      }
      dl.innerHTML = opts.map(o => `<option value="${o}">`).join('');
      if (el.tagName === 'INPUT') el.setAttribute('list', dlId);
    });

    // Nạp lookup map cho Hocphan (v6 — filtered)
    if (data.hocphanMap) {
      window._lookupMap_tenTV = data.hocphanMap;
    }

    // Nạp lookup map cho GiangVien
    if (data.giangVienEmail) {
      const gvMap = {};
      (data.giangVien || []).forEach(name => {
        gvMap[name] = {
          email  : data.giangVienEmail?.[name] || '',
          donviCT: data.giangVienDonvi?.[name] || '',
        };
      });
      window._lookupMap_hoTen = gvMap;
    }
  }

  // ── Map field key → data array ────────────────────────────────
  function _getOptsForField(key, f, data) {
    const sheetMap = {
      'tenTV'       : data.hocphanViet,   // filtered by user (v6)
      'hpTienQuyet' : data.hocphanViet,
      'hpTruoc'     : data.hocphanViet,
      'hpSongHanh'  : data.hocphanViet,
      'hoTen'       : data.giangVien,
      'donVi'       : data.boMon,
      'truongKhoa'  : data.truongKhoa,
      'truongBM'    : data.truongBM,
      'ppGD'        : data.ppgd,
      'ppHT'        : data.ppht,
      'chuyenNganh' : data.chuyenNganh,
      'trinhDo'     : data.trinhDo,
      'khoiKT'      : data.khoiKT,
      'loaiHP'      : data.loaiHP,
      'hockyDT'     : data.hocKyDT,
      'khoaDT'      : data.khoaDT,
      'cdrCtdt'     : data.cdrCtdt,
      'hdDG'        : data.hdDanhGia,
      'namHocApDung': data.namHoc,
      'hkApDung'    : data.hocKyDT,
    };
    return sheetMap[key] || data[f.source?.sheet?.toLowerCase()] || [];
  }

  // ════════════════════════════════════════════════════════════
  //  AUTO-FILL CONTEXT FIELDS (v6)
  //  Đọc FIELD_SCHEMA → tìm field có autoFill → tự điền
  // ════════════════════════════════════════════════════════════
  function _autoFillContextFields(user) {
    Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
      if (!f.autoFill) return;

      let value = '';
      switch (f.autoFill) {
        case 'currentUser.name'  : value = user.name   || ''; break;
        case 'currentUser.email' : value = user.email  || ''; break;
        case 'currentUser.donvi' : value = user.donvi  || ''; break;
        case 'today'             : value = new Date().toLocaleDateString('vi-VN'); break;
        default: value = '';
      }

      const el = document.getElementById(f.formId || key);
      if (!el || !value) return;

      el.value = value;

      // Readonly nếu readonlyIf = 'autoFill!=null'
      if (f.readonlyIf === 'autoFill!=null') {
        el.readOnly = true;
        el.style.background = '#F8FAFC';
        el.style.color = 'var(--accent, #2E75B6)';
        el.title = 'Tự động điền từ tài khoản đăng nhập';
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  NAVIGATE — Chuyển module
  // ════════════════════════════════════════════════════════════
  function navigate(moduleName) {
    if (!RBAC.canAccess(moduleName)) {
      UI.toast('⛔ Bạn không có quyền truy cập module này.', 'err');
      return;
    }

    // Ẩn tất cả module panels
    document.querySelectorAll('[data-module-panel]').forEach(el => {
      el.style.display = 'none';
    });

    // Hiện panel tương ứng
    const panel = document.querySelector(`[data-module-panel="${moduleName}"]`);
    if (panel) panel.style.display = '';

    // Active nav item
    document.querySelectorAll('[data-nav-module]').forEach(el => {
      el.classList.toggle('active', el.dataset.navModule === moduleName);
    });

    // Init module nếu chưa init
    if (modules[moduleName]?.init && !modules[moduleName]._initialized) {
      modules[moduleName].init();
      modules[moduleName]._initialized = true;
    }

    _currentModule = moduleName;
  }

  // ── Getters ───────────────────────────────────────────────────
  function getMenuData()      { return _menuData; }
  function getCurrentModule() { return _currentModule; }

  // ── Reload menu data (Admin dùng sau khi writeMenuData) ───────
  async function reloadMenuData() {
    _menuData = null;
    await loadMenuData();
  }

  return { boot, navigate, loadMenuData, reloadMenuData,
           getMenuData, getCurrentModule };
})();

window.App = App;

// ════════════════════════════════════════════════════════════════
//  MODULE INIT STUBS (override trong file module tương ứng)
// ════════════════════════════════════════════════════════════════
function initDashboard() {}
function initLibrary()   {}
function initAdmin()     {}
function initTonghop()   {}

// ── initForm — khởi tạo form nhập liệu ──────────────────────────
function initForm() {
  // Khởi tạo wizard sections
  if (typeof Wizard !== 'undefined') Wizard.init();

  // Thêm dòng mặc định cho các bảng
  DynRows.initDefault();

  // Áp dụng showIf rules từ schema
  _applyShowIfRules();

  // Tính toán lần đầu
  Calc.calcTC();
}

// ── Áp dụng showIf từ FIELD_SCHEMA ──────────────────────────────
function _applyShowIfRules() {
  Object.entries(FIELD_SCHEMA).forEach(([key, f]) => {
    if (!f.showIf) return;
    const el = document.getElementById(f.formId || key);
    if (!el) return;
    const wrapper = el.closest('.field-wrap') || el.parentElement;
    if (!wrapper) return;

    // Parse condition: "varName=value" hoặc "varName!=value"
    const match = f.showIf.match(/^(\w+)(!=|=)(.+)$/);
    if (!match) return;
    const [, watchKey, op, watchVal] = match;

    // Ẩn ban đầu
    wrapper.style.display = 'none';

    // Watch field thay đổi
    const watchEl = document.getElementById(watchKey);
    if (!watchEl) return;

    const check = () => {
      const cur   = watchEl.type === 'checkbox' ? (watchEl.checked ? 'true' : 'false') : watchEl.value;
      const show  = op === '=' ? cur === watchVal : cur !== watchVal;
      wrapper.style.display = show ? '' : 'none';
    };

    watchEl.addEventListener('change', check);
    watchEl.addEventListener('input',  check);
    check();
  });
}

// ════════════════════════════════════════════════════════════════
//  Hiện/ẩn màn hình
// ════════════════════════════════════════════════════════════════
function showAuth() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display  = 'none';
}

function showApp(user) {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('appScreen').style.display  = 'block';
}

// ════════════════════════════════════════════════════════════════
//  Khởi tạo khi DOM ready
// ════════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {

  // Kiểm tra session còn không
  const saved = sessionStorage.getItem('dcUser');
  if (saved) {
    try {
      const user = JSON.parse(saved);
      window._currentUser = user;
      // Hiện app rồi boot (load menu data, auto-fill, v.v.)
      showApp(user);
      App.boot(user);
    } catch(e) {
      sessionStorage.removeItem('dcUser');
      showAuth();
    }
  } else {
    // Chưa đăng nhập → hiện màn hình login
    showAuth();
  }

  // Auto-save draft mỗi 60 giây
  setInterval(() => {
    const user = sessionStorage.getItem('dcUser');
    if (!user) return;
    if (typeof Form !== 'undefined' && typeof Form.collectAll === 'function') {
      const d = Form.collectAll();
      if (d.tenTV || d.maHP) {
        sessionStorage.setItem('dcDraft', JSON.stringify(d));
      }
    }
  }, 60000);

});
