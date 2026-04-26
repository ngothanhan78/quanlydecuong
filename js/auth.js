// ════════════════════════════════════════════════════════════════
//  auth.js — Login, Signup, OTP, Đổi mật khẩu  (v6)
//
//  Thay đổi so với v5:
//  • Sau login thành công → gọi App.boot(user) thay vì showApp(user)
//  • App.boot() sẽ tự gọi getMenuData với userName để filter Hocphan
//  • user object lưu thêm canEditForm từ GAS
//  • Dùng ENV_CONFIG thay vì APP_CONFIG
// ════════════════════════════════════════════════════════════════

const Auth = {

  _v  : (id)          => (document.getElementById(id)?.value||'').trim(),
  _msg: (id,text,type) => {
    const el=document.getElementById(id); if(!el)return;
    el.textContent=text; el.className='auth-msg '+(type||'');
  },

  async _hash(pass){
    const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pass));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  },

  switchTab(name){
    document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name));
    document.querySelectorAll('.auth-panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+name));
  },

  // ── Đăng ký ─────────────────────────────────────────────────
  async signup(){
    const name =this._v('signupName');
    const email=this._v('signupEmail');
    const msgv =this._v('signupMsgv');
    const pass =this._v('signupPass');
    const pass2=this._v('signupPass2');

    if(!name)                        return this._msg('msgSignup','Vui lòng nhập họ tên.','err');
    if(!email||!email.includes('@')) return this._msg('msgSignup','Email không hợp lệ.','err');
    if(!msgv)                        return this._msg('msgSignup','Vui lòng nhập Mã số giảng viên.','err');
    if(pass.length<6)                return this._msg('msgSignup','Mật khẩu tối thiểu 6 ký tự.','err');
    if(pass!==pass2)                 return this._msg('msgSignup','Mật khẩu xác nhận không khớp.','err');
    if(!ENV_CONFIG.GAS_URL||ENV_CONFIG.GAS_URL.includes('YOUR'))
      return this._msg('msgSignup','⚠ Chưa cấu hình GAS URL.','err');

    this._msg('msgSignup','Đang kiểm tra và đăng ký...','');
    const hashed=await this._hash(pass);
    const res=await API.signup(name,email,msgv,hashed);

    if(res?.success){
      const user={name,email,role:res.role||'GiangVien',canEditForm:res.canEditForm};
      this._saveSession(user);
      this._msg('msgSignup','✓ Đăng ký thành công!','ok');
      setTimeout(()=>App.boot(user),700);
    } else {
      this._msg('msgSignup',res?.message||'Lỗi kết nối.','err');
    }
  },

  // ── Đăng nhập ────────────────────────────────────────────────
  async login(){
    const email=this._v('loginEmail');
    const pass =this._v('loginPass');
    if(!email||!pass) return this._msg('msgLogin','Vui lòng nhập đủ email và mật khẩu.','err');
    if(!ENV_CONFIG.GAS_URL||ENV_CONFIG.GAS_URL.includes('YOUR'))
      return this._msg('msgLogin','⚠ Chưa cấu hình GAS URL trong environment.config.js.','err');

    this._msg('msgLogin','Đang đăng nhập...','');
    const hashed=await this._hash(pass);
    const res=await API.login(email,hashed);

    if(res?.success){
      // ✅ v6: lưu cả name (dùng filter Hocphan) và canEditForm
      const user={
        name       : res.name||email.split('@')[0],
        email,
        role       : res.role||'GiangVien',
        canEditForm: res.canEditForm,
      };
      this._saveSession(user);
      // ✅ v6: App.boot() thay vì showApp() — sẽ tự gọi getMenuData với userName
      App.boot(user);
    } else {
      this._msg('msgLogin',res?.message||'Lỗi kết nối.','err');
    }
  },

  _saveSession(user){
    window._currentUser=user;
    sessionStorage.setItem('dcUser',JSON.stringify(user));
  },

  signOut(){
    window._currentUser=null;
    sessionStorage.removeItem('dcUser');
    document.getElementById('appScreen').style.display='none';
    document.getElementById('authScreen').style.display='flex';
    Auth.switchTab('login');
  },

  confirmSignOut(){
    document.getElementById('modalKetThuc').style.display='flex';
  },

  // ── OTP ──────────────────────────────────────────────────────
  async requestOTP(){
    const email=this._v('resetEmail');
    if(!email||!email.includes('@')) return this._msg('msgReset','Email không hợp lệ.','err');
    this._msg('msgReset','Đang gửi mã OTP...','');
    document.getElementById('btnRequestOTP').disabled=true;
    const res=await API.forgotPass(email);
    document.getElementById('btnRequestOTP').disabled=false;
    if(res?.success){
      this._msg('msgReset',res.message,'ok');
      document.getElementById('otpPanel').style.display='block';
    } else {
      this._msg('msgReset',res?.message||'Lỗi kết nối.','err');
    }
  },

  async resetPass(){
    const email=this._v('resetEmail');
    const otp  =this._v('otpCode');
    const p1   =this._v('newPass1');
    const p2   =this._v('newPass2');
    if(!otp||otp.length!==6) return this._msg('msgReset','Mã OTP phải đủ 6 số.','err');
    if(p1.length<6)          return this._msg('msgReset','Mật khẩu mới tối thiểu 6 ký tự.','err');
    if(p1!==p2)              return this._msg('msgReset','Mật khẩu xác nhận không khớp.','err');
    this._msg('msgReset','Đang xử lý...','');
    const hashed=await this._hash(p1);
    const res=await API.resetPass(email,otp,hashed);
    if(res?.success){
      this._msg('msgReset','✓ '+res.message+' Vui lòng đăng nhập lại.','ok');
      document.getElementById('otpPanel').style.display='none';
      setTimeout(()=>this.switchTab('login'),2000);
    } else {
      this._msg('msgReset',res?.message||'Lỗi kết nối.','err');
    }
  },

  // ── Đổi mật khẩu (trong app) ─────────────────────────────────
  openChangePass(){
    document.getElementById('modalChangePass').style.display='flex';
    ['cpOldPass','cpNewPass1','cpNewPass2'].forEach(id=>document.getElementById(id).value='');
    this._msg('msgChangePass','','');
  },

  closeChangePass(){
    document.getElementById('modalChangePass').style.display='none';
  },

  async changePass(){
    const email=window._currentUser?.email;
    const oldP =this._v('cpOldPass');
    const p1   =this._v('cpNewPass1');
    const p2   =this._v('cpNewPass2');
    if(!oldP)      return this._msg('msgChangePass','Vui lòng nhập mật khẩu hiện tại.','err');
    if(p1.length<6)return this._msg('msgChangePass','Mật khẩu mới tối thiểu 6 ký tự.','err');
    if(p1!==p2)    return this._msg('msgChangePass','Mật khẩu xác nhận không khớp.','err');
    this._msg('msgChangePass','Đang xử lý...','');
    const [hashedOld,hashedNew]=await Promise.all([this._hash(oldP),this._hash(p1)]);
    const res=await API.changePass(email,hashedOld,hashedNew);
    if(res?.success){
      this._msg('msgChangePass','✓ '+res.message,'ok');
      setTimeout(()=>this.closeChangePass(),1500);
    } else {
      this._msg('msgChangePass',res?.message||'Lỗi kết nối.','err');
    }
  },
};

window.Auth=Auth;

// ── Shortcuts toàn cục ─────────────────────────────────────────
function doSignup()      { Auth.signup()        }
function doLogin()       { Auth.login()          }
function doSignOut()     { Auth.signOut()        }
function confirmSignOut(){ Auth.confirmSignOut() }
function doRequestOTP()  { Auth.requestOTP()    }
function doResetPass()   { Auth.resetPass()     }
function openChangePass(){ Auth.openChangePass()}
function closeChangePass(){ Auth.closeChangePass()}
function doChangePass()  { Auth.changePass()    }
function switchTab(name) { Auth.switchTab(name) }
function closeModal()    { document.getElementById('modalKetThuc').style.display='none'; }
function doKetThuc()     { closeModal(); Auth.signOut(); }
