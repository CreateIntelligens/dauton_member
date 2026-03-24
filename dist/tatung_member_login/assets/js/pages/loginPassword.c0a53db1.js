let LoginPasswordPage=e=>{let r=Router.state.username,t=(e.innerHTML=`
    <div class="card">
      <h2 class="page-title">登入帳號</h2>

      <div class="login-info">
        <p>請輸入您的密碼以完成登入</p>
      </div>

      <div class="form-group">
        <label class="form-label">帳號</label>
        <input type="tel" class="form-input disabled" id="login-username" value="${r}" disabled>
      </div>

      <div class="form-group">
        <label class="form-label">密碼</label>
        <input type="password" class="form-input" id="login-password" placeholder="請輸入密碼">
      </div>

      <div id="login-error"></div>

      <button class="btn btn-primary" id="login-submit-btn">登入</button>

      <a href="#/forgotPassword" class="forgot-password-link">忘記密碼？</a>
    </div>
  `,e.querySelector("#login-password")),a=e.querySelector("#login-submit-btn"),i=e.querySelector("#login-error");a.addEventListener("click",async()=>{var e=t.value.trim();if(e){i.innerHTML="",a.disabled=!0,a.textContent="登入中...";try{if((await ApiService.getTokenByPassword(r,e)).access_token){if(Router.state.password=e,Router.showToast("登入成功"),Router.state.lineUserId)try{await ApiService.sendLoginToBackend(Router.state.lineUserId,r,e),console.log("✅ 已發送登入資訊給後端系統")}catch(e){console.warn("⚠️ 發送登入資訊失敗，但不影響登入流程",e)}try{var s=await ApiService.getMemberAgreement();if("NEWPUBLISHV"===(s.data||s))return void Router.navigate("/agreement")}catch(e){console.warn("無法取得會員條款版本，繼續登入流程")}Router.state.isLoggedIn=!0,Router.navigate("/success")}else i.innerHTML='<p class="error-msg">登入失敗，請檢查密碼是否正確</p>',a.disabled=!1,a.textContent="登入"}catch(e){i.innerHTML='<p class="error-msg">密碼錯誤或網路異常，請稍後再試</p>',a.disabled=!1,a.textContent="登入"}}else i.innerHTML='<p class="error-msg">請輸入密碼</p>'}),t.addEventListener("keypress",e=>{"Enter"===e.key&&a.click()})};