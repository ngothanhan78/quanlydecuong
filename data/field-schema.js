// ══════════════════════════════════════════════════════════════════
//  field-schema.js  —  v6
//  Generated: 17:35:42 26/4/2026
//  Sources:
//    • Template_DCCT.docx
//    • Template_DCTQ.docx
//    • BanVeThietKe_v6.xlsx
//
//  ⚠  NGUỒN SỰ THẬT DUY NHẤT — Do Schema Generator tạo
//     Không sửa tay file này
// ══════════════════════════════════════════════════════════════════

// FIELD_SCHEMA
const FIELD_SCHEMA = {
  // ── Section 0
  tietLT: {
    label      : "Tiết LT",
    type       : "calc",
    section    : 0,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    formula    : "tcLT*15",
    readonlyIf : "readonlyIf=calc",
    dataKey    : "tietLT",
  },

  tietTH: {
    label      : "Tiết TN/TH",
    type       : "calc",
    section    : 0,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    formula    : "tcTH*30",
    readonlyIf : "readonlyIf=calc",
    dataKey    : "tietTH",
  },

  gioTuHoc: {
    label      : "Giờ tự học",
    type       : "calc",
    section    : 0,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    formula    : "tcLT*35+tcTH*20",
    readonlyIf : "readonlyIf=calc",
    dataKey    : "gioTuHoc",
  },

  Tuhocchuong: {
    label      : "Tự học (calc)",
    type       : "calc",
    section    : 0,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    formula    : "(LTchuong/15)*35+(THchuong/30)*20",
    readonlyIf : "readonlyIf=calc",
    dataKey    : "Tuhocchuong",
  },

  // ── Section 1
  tenTV: {
    label      : "Tên HP (tiếng Việt)",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    required   : true,
    sourceKey  : "hocphanViet",
    sourceFilter: "F=currentUser",
    placeholder: "VD: Hóa đại cương",
    dataKey    : "tenTV",
  },

  tenTA: {
    label      : "Tên HP (tiếng Anh)",
    type       : "text",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    lookup     : { by: "tenTV", from: "hocphanMap!tenAnh" },
    placeholder: "VD: General Chemistry",
    readonlyIf : "autoFill!=null",
    dataKey    : "tenTA",
  },

  trinhDo: {
    label      : "Trình độ",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    required   : true,
    sourceKey  : "trinhDo",
    dataKey    : "trinhDo",
  },

  maHP: {
    label      : "Mã học phần",
    type       : "text",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    required   : true,
    lookup     : { by: "tenTV", from: "hocphanMap!maHP" },
    readonlyIf : "autoFill!=null",
    dataKey    : "maHP",
  },

  maTQ: {
    label      : "Mã tự quản",
    type       : "text",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    lookup     : { by: "tenTV", from: "hocphanMap!maTQ" },
    readonlyIf : "autoFill!=null",
    dataKey    : "maTQ",
  },

  khoiKT: {
    label      : "Khối kiến thức",
    type       : "checklist",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    sourceKey  : "khoiKT",
    dataKey    : "khoiKT",
  },

  loaiHP: {
    label      : "Loại học phần",
    type       : "checklist",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    sourceKey  : "loaiHP",
    dataKey    : "loaiHP",
  },

  tcLT: {
    label      : "TC Lý thuyết",
    type       : "number",
    section    : 1,
    showInForm : true,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    placeholder: "VD: 2",
    dataKey    : "tcLT",
  },

  tcTH: {
    label      : "TC Thực hành",
    type       : "number",
    section    : 1,
    showInForm : true,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "VD: 1",
    dataKey    : "tcTH",
  },

  tcTong: {
    label      : "Tổng TC",
    type       : "calc",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    readonlyIf : "readonlyIf=calc",
    dataKey    : "tcTong",
  },

  ects: {
    label      : "ECTS",
    type       : "calc",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    readonlyIf : "readonlyIf=calc",
    dataKey    : "ects",
  },

  donVi: {
    label      : "Đơn vị phụ trách",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    sourceKey  : "boMon",
    dataKey    : "donVi",
  },

  hpTienQuyet: {
    label      : "HP tiên quyết",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    sourceKey  : "hocphanViet",
    dataKey    : "hpTienQuyet",
  },

  hpTruoc: {
    label      : "HP học trước",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    sourceKey  : "hocphanViet",
    dataKey    : "hpTruoc",
  },

  hpSongHanh: {
    label      : "HP song hành",
    type       : "menu",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    sourceKey  : "hocphanViet",
    dataKey    : "hpSongHanh",
  },

  hpCotLoi: {
    label      : "HP cốt lõi",
    type       : "checklist",
    section    : 1,
    showInForm : false,
    exportDCCT : false,
    exportDCTQ : true,
    saveToSheet: false,
    dataKey    : "hpCotLoi",
  },

  htTrucTiep: {
    label      : "Hình thức: Trực tiếp",
    type       : "checkbox",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "hình_thức_gd",
    groupId    : "hinhThuc",
    dataKey    : "htTrucTiep",
  },

  htTrucTuyen: {
    label      : "Hình thức: Trực tuyến",
    type       : "checkbox",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    groupId    : "hinhThuc",
    dataKey    : "htTrucTuyen",
  },

  htThayDoi: {
    label      : "Hình thức: Thay đổi theo HK",
    type       : "checkbox",
    section    : 1,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    groupId    : "hinhThuc",
    dataKey    : "htThayDoi",
  },

  hockyDT: {
    label      : "Học kỳ đào tạo",
    type       : "menu",
    section    : 1,
    showInForm : false,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "hocKyDT",
    dataKey    : "hockyDT",
  },

  chuyenNganh: {
    label      : "Chuyên ngành",
    type       : "menu",
    section    : 1,
    showInForm : false,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "chuyenNganh",
    dataKey    : "chuyenNganh",
  },

  khoaDT: {
    label      : "Khóa đào tạo",
    type       : "menu",
    section    : 1,
    showInForm : false,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "khóa_đt",
    dataKey    : "khoaDT",
  },

  nganhDT: {
    label      : "Ngành đào tạo",
    type       : "menu",
    section    : 1,
    showInForm : false,
    exportDCCT : false,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "nganhdt",
    dataKey    : "nganhDT",
  },

  // ── Section 2
  hoTen: {
    label      : "Họ và tên GV",
    type       : "menu",
    section    : 2,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "giangVien",
    placeholder: "Chọn hoặc nhập tên GV",
    dataKey    : "hoTen",
  },

  email: {
    label      : "Email GV",
    type       : "text",
    section    : 2,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    lookup     : { by: "hoTen", from: "GiangvienGD!B:C" },
    readonlyIf : "autoFill!=null",
    dataKey    : "email",
  },

  donviCT: {
    label      : "Đơn vị GV",
    type       : "text",
    section    : 2,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    lookup     : { by: "hoTen", from: "Bomon!D:B" },
    readonlyIf : "autoFill!=null",
    dataKey    : "donviCT",
  },

  // ── Section 3
  moTa: {
    label      : "Nội dung mô tả",
    type       : "textarea",
    section    : 3,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    required   : true,
    placeholder: "Mô tả mục tiêu và nội dung học phần...",
    dataKey    : "moTa",
  },

  // ── Section 4
  cdrCtdt: {
    label      : "CĐR CTĐT (PLO)",
    type       : "menu",
    section    : 4,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "cđr_ctđt",
    dataKey    : "cdrCtdt",
  },

  cdrHP: {
    label      : "CĐR HP (CLO)",
    type       : "text",
    section    : 4,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "VD: CLO1",
    dataKey    : "cdrHP",
  },

  motaCDR: {
    label      : "Mô tả CĐR",
    type       : "textarea",
    section    : 4,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "Người học có khả năng...",
    dataKey    : "motaCDR",
  },

  mucdoNL: {
    label      : "Mức độ năng lực",
    type       : "text",
    section    : 4,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "VD: C3",
    dataKey    : "mucdoNL",
  },

  // ── Section 5
  tenChuong: {
    label      : "Tên chương/bài",
    type       : "text",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "Chương 1. Tên chương",
    dataKey    : "tenChuong",
  },

  cdrHPchuong: {
    label      : "CĐR HP chương",
    type       : "text",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO1, CLO2",
    dataKey    : "cdrHPchuong",
  },

  LTchuong: {
    label      : "LT (tiết)",
    type       : "number",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "0",
    dataKey    : "LTchuong",
  },

  THchuong: {
    label      : "TN/TH (tiết)",
    type       : "number",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "0",
    dataKey    : "THchuong",
  },

  trongsochuong: {
    label      : "Trọng số (%)",
    type       : "number",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "0",
    dataKey    : "trongsochuong",
  },

  noidungChuong: {
    label      : "Nội dung chương",
    type       : "textarea",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    placeholder: "Chương 1...\r\n1.1...",
    dataKey    : "noidungChuong",
  },

  huongdanTH: {
    label      : "Hướng dẫn tự học",
    type       : "textarea",
    section    : 5,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "Đọc TL [1] trang...",
    dataKey    : "huongdanTH",
  },

  // ── Section 6
  ppGD: {
    label      : "PP Giảng dạy",
    type       : "menu",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "ppgd",
    dataKey    : "ppGD",
  },

  ppHT: {
    label      : "PP Học tập",
    type       : "menu",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    sourceKey  : "ppgd",
    dataKey    : "ppHT",
  },

  cdrKienthuc: {
    label      : "CĐR Kiến thức",
    type       : "text",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO1",
    dataKey    : "cdrKienthuc",
  },

  cdrKynang: {
    label      : "CĐR KN Cá nhân",
    type       : "text",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO2",
    dataKey    : "cdrKynang",
  },

  cdrNhom: {
    label      : "CĐR KN Nhóm",
    type       : "text",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO3",
    dataKey    : "cdrNhom",
  },

  cdrThuchanh: {
    label      : "CĐR NL Nghề nghiệp",
    type       : "text",
    section    : 6,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO4",
    dataKey    : "cdrThuchanh",
  },

  // ── Section 7
  hdDG: {
    label      : "Hoạt động ĐG",
    type       : "menu",
    section    : 7,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    sourceKey  : "hđ_đánhgiá",
    dataKey    : "hdDG",
  },

  thoidiem: {
    label      : "Thời điểm",
    type       : "text",
    section    : 7,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "VD: Tuần 8",
    dataKey    : "thoidiem",
  },

  cdrDG: {
    label      : "CĐR đánh giá",
    type       : "text",
    section    : 7,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "CLO1, CLO2",
    dataKey    : "cdrDG",
  },

  tyleDG: {
    label      : "Tỷ lệ (%)",
    type       : "number",
    section    : 7,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    dataKey    : "tyleDG",
  },

  thangdiem: {
    label      : "Thang điểm/Rubrics",
    type       : "text",
    section    : 7,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    placeholder: "Rubrics số...",
    dataKey    : "thangdiem",
  },

  // ── Section 8
  giaotrinh: {
    label      : "Giáo trình chính",
    type       : "textarea",
    section    : 8,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "Tác giả, Tên GT, NXB, Năm",
    dataKey    : "giaotrinh",
  },

  tailieuTK: {
    label      : "Tài liệu tham khảo",
    type       : "textarea",
    section    : 8,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "Tác giả, Tên TL, NXB, Năm",
    dataKey    : "tailieuTK",
  },

  phanmem: {
    label      : "Phần mềm",
    type       : "textarea",
    section    : 8,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "VD: MATLAB, Python",
    dataKey    : "phanmem",
  },

  // ── Section 9
  hpCotLoiInternal: {
    label      : "HP cốt lõi (nội bộ)",
    type       : "select",
    section    : 9,
    showInForm : false,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    dataKey    : "hpCotLoiInternal",
  },

  // ── Section 10
  hkApDung: {
    label      : "Học kỳ áp dụng",
    type       : "menu",
    section    : 10,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: false,
    sourceKey  : "hocKyDT",
    dataKey    : "hkApDung",
  },

  namHocApDung: {
    label      : "Năm học áp dụng",
    type       : "menu",
    section    : 10,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: false,
    sourceKey  : "namHoc",
    placeholder: "VD: 2024-2025",
    dataKey    : "namHocApDung",
  },

  // ── Section 11
  pdLanDau: {
    label      : "Phê duyệt lần đầu",
    type       : "checkbox",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    groupId    : "pdLoai",
    dataKey    : "pdLanDau",
  },

  pdCapNhat: {
    label      : "Bản cập nhật",
    type       : "checkbox",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    groupId    : "pdLoai",
    dataKey    : "pdCapNhat",
  },

  pdLanThu: {
    label      : "Lần thứ",
    type       : "text",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    placeholder: "VD: 1",
    showIf     : "pdCapNhat=true",
    dataKey    : "pdLanThu",
  },

  ngayPD: {
    label      : "Ngày phê duyệt",
    type       : "date",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    dataKey    : "ngayPD",
  },

  ngayCapNhat: {
    label      : "Ngày cập nhật",
    type       : "date",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    showIf     : "pdCapNhat=true",
    dataKey    : "ngayCapNhat",
  },

  truongKhoa: {
    label      : "Trưởng khoa",
    type       : "menu",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    sourceKey  : "truongKhoa",
    dataKey    : "truongKhoa",
  },

  truongBM: {
    label      : "Trưởng BM / Ngành",
    type       : "menu",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    sourceKey  : "truongBM",
    dataKey    : "truongBM",
  },

  chunhiem: {
    label      : "Chủ nhiệm HP",
    type       : "text",
    section    : 11,
    showInForm : true,
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    required   : true,
    autoFill   : "currentUser.name",
    readonlyIf : "autoFill!=null",
    dataKey    : "chunhiem",
  },

};

// DYNAMIC_TABLES
const DYNAMIC_TABLES = {
  Table01: {
    label      : "Thông tin giảng viên",
    anchorField: "hoTen",
    tbodyId    : "table01Body",
    section    : 2,
    targetForm : "Both",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "rows",
    defaultRows: 2,
    columns: [
      { key:"STT_auto", label:"STT", type:"text", readonly:true, colWidth:40 },
      { key:"hoTen", label:"Họ và tên GV", type:"menu", sourceKey:"giangVien", colWidth:160, placeholder:"Họ và tên GV" },
      { key:"email", label:"Email GV", type:"text", readonly:true, lookup:{by:"hoTen",from:"GiangVien!B:C"}, colWidth:200, placeholder:"email@hufi.edu.vn" },
      { key:"donviCT", label:"Đơn vị GV", type:"text", readonly:true, lookup:{by:"hoTen",from:"GiangVien!B:D"}, colWidth:180 },
    ],
  },

  Table02: {
    label      : "Chuẩn đầu ra HP",
    anchorField: "cdrCtdt",
    tbodyId    : "table02Body",
    section    : 4,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "rows",
    defaultRows: 3,
    columns: [
      { key:"cdrCtdt", label:"CĐR CTĐT (PLO)", type:"menu", sourceKey:"cdrCtdt", colWidth:75 },
      { key:"cdrHP", label:"CĐR HP (CLO)", type:"text", colWidth:65, placeholder:"CLO1" },
      { key:"motaCDR", label:"Mô tả CĐR", type:"textarea", colWidth:300, placeholder:"Người học có khả năng..." },
      { key:"mucdoNL", label:"Mức độ năng lực", type:"text", colWidth:60 },
    ],
  },

  Table03: {
    label      : "Phân bổ thời gian",
    anchorField: "tenChuong",
    tbodyId    : "table03Body",
    section    : 5,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    saveAs     : "rows",
    defaultRows: 2,
    columns: [
      { key:"STT_auto", label:"STT", type:"text", readonly:true, colWidth:40 },
      { key:"tenChuong", label:"Tên chương/bài", type:"text", colWidth:200, placeholder:"Tên chương/bài" },
      { key:"cdrHPchuong", label:"CĐR HP chương", type:"text", colWidth:80, placeholder:"CLO1" },
      { key:"LTchuong", label:"LT (tiết)", type:"number", colWidth:55 },
      { key:"THchuong", label:"TN/TH (tiết)", type:"number", colWidth:55 },
      { key:"Tuhocchuong", label:"Tự học (calc)", type:"calc", readonly:true, calc:"(LTchuong/15)*35+(THchuong/30)*20", colWidth:55 },
      { key:"trongsochuong", label:"Trọng số (%)", type:"number", colWidth:60 },
    ],
    aggregate: {"tongsoLT":"SUM(LTchuong)","tongsoTH":"SUM(THchuong)","tongsoTuHoc":"SUM(Tuhocchuong)","tongsoTrongso":"SUM(trongsochuong)"},
  },

  Table04: {
    label      : "Nội dung chi tiết",
    anchorField: "noidungChuong",
    tbodyId    : "table04Body",
    section    : 5,
    targetForm : "Both",
    exportDCCT : true,
    exportDCTQ : true,
    saveToSheet: true,
    saveAs     : "rows",
    defaultRows: 1,
    columns: [
      { key:"noidungChuong", label:"Nội dung chương", type:"textarea", colWidth:360, placeholder:"Chương 1..." },
      { key:"huongdanTH", label:"Hướng dẫn tự học", type:"textarea", colWidth:300, placeholder:"Đọc TL [1]..." },
    ],
    exportDCTQ_cols: ["noidungChuong"],
  },

  Table05: {
    label      : "Phương pháp dạy học",
    anchorField: "ppGD",
    tbodyId    : "table05Body",
    section    : 6,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "rows",
    defaultRows: 1,
    columns: [
      { key:"ppGD", label:"PP Giảng dạy", type:"menu", sourceKey:"ppgd", colWidth:180, placeholder:"VD: Thuyết trình" },
      { key:"ppHT", label:"PP Học tập", type:"menu", sourceKey:"ppgd", colWidth:180, placeholder:"VD: Đọc trước TL" },
      { key:"cdrKienthuc", label:"CĐR Kiến thức", type:"text", colWidth:70 },
      { key:"cdrKynang", label:"CĐR KN Cá nhân", type:"text", colWidth:70 },
      { key:"cdrNhom", label:"CĐR KN Nhóm", type:"text", colWidth:70 },
      { key:"cdrThuchanh", label:"CĐR NL Nghề nghiệp", type:"text", colWidth:70 },
    ],
  },

  Table06: {
    label      : "Đánh giá học phần",
    anchorField: "hdDG",
    tbodyId    : "table06Body",
    section    : 7,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: false,
    saveAs     : "rows",
    defaultRows: 2,
    columns: [
      { key:"STT_auto", label:"STT", type:"text", readonly:true, colWidth:40 },
      { key:"hdDG", label:"Hoạt động ĐG", type:"menu", sourceKey:"hdDanhGia", colWidth:160 },
      { key:"thoidiem", label:"Thời điểm", type:"text", colWidth:80, placeholder:"VD: Tuần 8" },
      { key:"cdrDG", label:"CĐR đánh giá", type:"text", colWidth:100, placeholder:"CLO1" },
      { key:"tyleDG", label:"Tỷ lệ (%)", type:"number", colWidth:55 },
      { key:"thangdiem", label:"Thang điểm/Rubrics", type:"text", colWidth:160 },
    ],
  },

  Table07: {
    label      : "Giáo trình chính",
    anchorField: "giaotrinh",
    tbodyId    : "table07Body",
    section    : 8,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "merged",
    defaultRows: 1,
    columns: [
      { key:"giaotrinh", label:"Giáo trình chính", type:"textarea" },
    ],
  },

  Table08: {
    label      : "Tài liệu tham khảo",
    anchorField: "tailieuTK",
    tbodyId    : "table08Body",
    section    : 8,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "merged",
    defaultRows: 1,
    columns: [
      { key:"tailieuTK", label:"Tài liệu tham khảo", type:"textarea" },
    ],
  },

  Table09: {
    label      : "Phần mềm",
    anchorField: "phanmem",
    tbodyId    : "table09Body",
    section    : 8,
    targetForm : "DCCT",
    exportDCCT : true,
    exportDCTQ : false,
    saveToSheet: true,
    saveAs     : "merged",
    defaultRows: 1,
    columns: [
      { key:"phanmem", label:"Phần mềm", type:"textarea" },
    ],
  },

  Table10: {
    label      : "Nội dung chi tiết (ĐCTQ)",
    anchorField: "noidungChuong",
    tbodyId    : "table10Body",
    section    : 5,
    targetForm : "DCTQ",
    exportDCCT : false,
    exportDCTQ : true,
    saveToSheet: false,
    saveAs     : "rows",
    defaultRows: 1,
    columns: [
      { key:"noidungChuong", label:"Nội dung chương", type:"textarea", colWidth:500, placeholder:"Chương 1..." },
    ],
    exportDCTQ_cols: ["noidungChuong"],
  },

};

// SECTIONS
const SECTIONS = [
  { id:0, label:"Section 0", tableIds:["Table03"], showInNav:false },
  { id:1, label:"Section 1", tableIds:[], showInNav:true },
  { id:2, label:"Section 2", tableIds:["Table01"], showInNav:true },
  { id:3, label:"Section 3", tableIds:[], showInNav:true },
  { id:4, label:"Section 4", tableIds:["Table02"], showInNav:true },
  { id:5, label:"Section 5", tableIds:["Table03","Table04","Table10"], showInNav:true },
  { id:6, label:"Section 6", tableIds:["Table05"], showInNav:true },
  { id:7, label:"Section 7", tableIds:["Table06"], showInNav:true },
  { id:8, label:"Section 8", tableIds:["Table07","Table08","Table09"], showInNav:true },
  { id:9, label:"Section 9", tableIds:[], showInNav:true },
  { id:10, label:"Section 10", tableIds:[], showInNav:true },
  { id:11, label:"Section 11", tableIds:[], showInNav:true },
];

// FOLDER_RULES
const FOLDER_RULES = [
  { field:"trinhDo", parentField:null, isLeaf:false },
  { field:"chuyenNganh", parentField:"trinhDo", isLeaf:true, condition:{field:"trinhDo",value:"Đại học"} },
  { field:"nganhDT", parentField:"trinhDo", isLeaf:true, condition:{field:"trinhDo",value:"Đại học"} },
];

(function _check(){
  const issues=[];
  Object.entries(FIELD_SCHEMA).forEach(([k,f])=>{
    if(!f.dataKey) issues.push('FIELD ['+k+']: missing dataKey');
    if(f.type==='calc'&&!f.formula) issues.push('FIELD ['+k+']: calc missing formula');
  });
  if(issues.length){console.group('[Schema v6] ⚠');issues.forEach(i=>console.warn(' •',i));console.groupEnd();}
  else console.log('[Schema v6] ✅ 67 fields, 10 tables');
})();

if(typeof window!=='undefined'){
  window.FIELD_SCHEMA=FIELD_SCHEMA;
  window.DYNAMIC_TABLES=DYNAMIC_TABLES;
  window.SECTIONS=SECTIONS;
  window.FOLDER_RULES=FOLDER_RULES;
}
if(typeof module!=='undefined'&&module.exports)
  module.exports={FIELD_SCHEMA,DYNAMIC_TABLES,SECTIONS,FOLDER_RULES};
