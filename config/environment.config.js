// ════════════════════════════════════════════════════════════════
//  environment.config.js — Cấu hình môi trường
//
//  ⚠  Điền 1 lần khi deploy — hiếm khi cần thay đổi
//     Không import file này vào Schema Generator
//     Không commit file này lên git (chứa IDs nhạy cảm)
// ════════════════════════════════════════════════════════════════

const ENV_CONFIG = {

  // ── Google Apps Script ───────────────────────────────────
  GAS_URL: 'https://script.google.com/macros/s/AKfycbw57BRmggvacL_ph54-TtP1gVhRrvViTvumhEymuNhiQZXusdQ9aGBAbbp9asfjTVWw/exec',

  // ── Thông tin đơn vị ─────────────────────────────────────
  UNIT_NAME   : 'Khoa Công nghệ Hóa học',
  UNIT_SHORT  : 'KCNHH',
  SCHOOL_NAME : 'Trường Đại học Công nghiệp Thực phẩm TP.HCM',
  SCHOOL_SHORT: 'HUFI',

  // ── CDN cho thư viện tạo file Word ───────────────────────
  DOCX_CDN_PRIMARY : 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js',
  DOCX_CDN_FALLBACK: 'https://unpkg.com/docx@8.5.0/build/index.umd.js',

  // ── Timeout (ms) ─────────────────────────────────────────
  GAS_TIMEOUT_DEFAULT: 20000,
  GAS_TIMEOUT_SAVE   : 30000,

  // ── Hướng dẫn sử dụng (link Drive) ──────────────────────
  HUONG_DAN_URL: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',

  // ── Giá trị mặc định cho form ────────────────────────────
  DEFAULTS: {
    trinhDo : 'Đại học',
    loaiHP  : 'Bắt buộc',
    hpCotLoi: 'no',
  },

  // ── Quy định cố định (nội dung tĩnh Section 9) ───────────
  QUY_DINH: {
    dkDat_ref:
      'Khoản 4, điều 30 QĐ số 4959/QĐ-DCT V/v điều chỉnh nội dung ' +
      '1 số điều trong Quy chế đào tạo theo hệ thống tín chỉ.',
    dkDat_thuong:
      'Người học được công nhận đạt học phần khi đạt điểm tổng kết ' +
      'học phần từ 4,0 điểm trở lên (Theo thang 10).',
    dkDat_cotloi:
      'Người học được công nhận đạt học phần cốt lõi khi đáp ứng đồng ' +
      'thời 2 điều kiện: Đạt điểm tổng kết học phần từ 4,0 điểm trở lên ' +
      '(theo thang 10) và từng CLO đạt 4,0 điểm trở lên (theo thang 10).',
  },

  // ── RBAC labels ──────────────────────────────────────────
  ROLE_LABELS: {
    Admin    : '⚙ Quản trị viên',
    GiangVien: '👨‍🏫 Giảng viên',
    ThuKy    : '📋 Thư ký',
  },

};

// Export
if (typeof window !== 'undefined') window.ENV_CONFIG = ENV_CONFIG;
if (typeof module !== 'undefined' && module.exports) module.exports = ENV_CONFIG;
