// ════════════════════════════════════════════════════════════════
//  api.js — Giao tiếp với GAS qua JSONP  (v6)
// ════════════════════════════════════════════════════════════════

const API = (() => {
  let _cbIdx = 0;

  // ── Gọi GAS (JSONP) ──────────────────────────────────────────
  function call(action, payload, opts = {}) {
    return new Promise((resolve, reject) => {
      const id   = 'cb_' + (++_cbIdx) + '_' + Date.now();
      const body = { action, ...payload };

      // Tự động đính kèm email + userName từ session
      const user = _getSession();
      if (user?.email && !body.email) body.email = user.email;
      if (user?.name  && !body.userName) body.userName = user.name;

      const timeout = opts.timeout || ENV_CONFIG.GAS_TIMEOUT_DEFAULT || 20000;
      const timer   = setTimeout(() => {
        _cleanup(id);
        reject(new Error(`Timeout (${timeout}ms) khi gọi action: ${action}`));
      }, timeout);

      window[id] = (result) => {
        clearTimeout(timer);
        _cleanup(id);
        resolve(result);
      };

      const url = ENV_CONFIG.GAS_URL +
        '?data=' + encodeURIComponent(JSON.stringify(body)) +
        '&callback=' + id;

      const script = document.createElement('script');
      script.src   = url;
      script.onerror = () => {
        clearTimeout(timer);
        _cleanup(id);
        reject(new Error('Network error khi gọi GAS'));
      };
      document.head.appendChild(script);
    });
  }

  function _cleanup(id) {
    delete window[id];
    document.querySelectorAll(`script[src*="${id}"]`).forEach(s => s.remove());
  }

  function _getSession() {
    try { return JSON.parse(sessionStorage.getItem('dcUser')) || null; }
    catch { return null; }
  }

  // ── Shorthand methods ─────────────────────────────────────────

  // getMenuData — tự động gửi userName để filter Hocphan
  function getMenuData() {
    return call('getMenuData', {});
  }

  function saveDecuong(data) {
    return call('saveDecuong', { formData: data }, { timeout: ENV_CONFIG.GAS_TIMEOUT_SAVE });
  }

  function saveDCTQ(data) {
    return call('saveDCTQ', { formData: data }, { timeout: ENV_CONFIG.GAS_TIMEOUT_SAVE });
  }

  function loadDecuong(sheetId) {
    return call('loadDecuong', { sheetId });
  }

  function getMyFiles() {
    return call('getMyFiles', {});
  }

  function getSheetFiles() {
    return call('getSheetFiles', {});
  }

  function createDriveDoc(data) {
    return call('createDriveDoc', { formData: data },
      { timeout: ENV_CONFIG.GAS_TIMEOUT_SAVE });
  }

  // Auth
  function login(email, pass) {
    return call('login', { email, pass });
  }

  function signup(name, email, msgv, pass) {
    return call('signup', { name, email, msgv, pass, timestamp: Date.now() });
  }

  function forgotPass(email) {
    return call('forgotPass', { email });
  }

  function resetPass(email, otp, newPass) {
    return call('resetPass', { email, otp, newPass });
  }

  function changePass(email, oldPass, newPass) {
    return call('changePass', { email, oldPass, newPass });
  }

  // Admin
  function adminCall(action, payload) {
    return call(action, payload);
  }

  return {
    call, getMenuData,
    saveDecuong, saveDCTQ, loadDecuong, getMyFiles, getSheetFiles, createDriveDoc,
    login, signup, forgotPass, resetPass, changePass,
    adminCall,
  };
})();

window.API = API;
