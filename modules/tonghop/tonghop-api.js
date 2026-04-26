// ════════════════════════════════════════════════════════════════
//  modules/tonghop/tonghop-api.js  (v6)
// ════════════════════════════════════════════════════════════════

const TongHopAPI = {
  _auth(payload) {
    return { ...payload, email: window._currentUser?.email||'' };
  },

  kiemTraNopBai()                    { return API.call('th_kiemtra',        this._auth({}), 30000); },
  sapXep(order)                      { return API.call('th_sapxep',         this._auth({order}), 60000); },
  tongHop()                          { return API.call('th_tonghop',        this._auth({}), 120000); },
  getVerSheets()                     { return API.call('th_getvers',        this._auth({})); },
  getVerHeaders(version)             { return API.call('th_getheaders',     this._auth({version})); },

  // ✅ v6 — lấy options filter (trinhDo, nganhDT, khoaDT)
  getFilterOptions(version)          { return API.call('th_getfilteroptions', this._auth({version})); },

  // ✅ v6 — trích xuất với filter bắt buộc trinhDo + nganhDT
  trichXuat(filters, fields, version){
    return API.call('th_trichxuat', this._auth({filters, fields, version}), 60000);
  },
};

window.TongHopAPI = TongHopAPI;
