let ForgotPasswordPage=e=>{var t=Router.state.username||"";e.innerHTML=`
    <div class="card">
      <h2 class="page-title">忘記密碼</h2>

      <p class="page-desc">請輸入您的手機號碼，系統將自動產生新密碼並以簡訊發送給您。</p>

      <div class="form-group">
        <label class="form-label">手機號碼</label>
        <input type="tel" class="form-input" id="forgot-phone" value="${t}" placeholder="請輸入手機號碼" maxlength="10">
      </div>

      <div id="reset-error"></div>

      <button class="btn btn-primary" id="reset-password-btn">重設密碼</button>

      <div style="margin-top: 20px; text-align: center;">
        <a href="#/login" style="color: #5a5a5a; text-decoration: underline; font-size: 14px;">返回登入</a>
      </div>
    </div>
  `;let r=e.querySelector("#forgot-phone"),s=e.querySelector("#reset-password-btn"),a=e.querySelector("#reset-error");s.addEventListener("click",async()=>{let e=r.value.trim();if(e)if(/^09\d{8}$/.test(e)){s.disabled=!0,s.textContent="處理中...",a.innerHTML="";try{var t=await ApiService.resetPassword(e);t.success||t.data||"0"===t.code?(Router.showToast("密碼重設成功！新密碼已發送至您的手機，請查收簡訊。"),setTimeout(()=>{Router.state.username=e,Router.navigate("/loginPassword")},2e3)):(a.innerHTML=`<p class="error-msg">${t.message||"密碼重設失敗，請檢查手機號碼是否正確"}</p>`,s.disabled=!1,s.textContent="重設密碼")}catch(e){a.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>',s.disabled=!1,s.textContent="重設密碼"}}else a.innerHTML='<p class="error-msg">請輸入正確的手機號碼格式</p>';else a.innerHTML='<p class="error-msg">請輸入手機號碼</p>'}),r.addEventListener("keypress",e=>{"Enter"===e.key&&s.click()})};