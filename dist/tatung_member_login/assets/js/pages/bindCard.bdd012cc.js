let BindCardPage=e=>{var s=Router.state.existMembers||[];e.innerHTML=`
    <div class="bind-title">請選擇綁定會員卡</div>

    <div class="bind-header-info">
      <p>提醒您：每支電話號碼僅能綁定一張會員卡，選定後將以此會員卡作為您享有會員權益之會員帳戶。若對會員卡資訊有任何疑問，請您洽詢客服專線，勿進行綁卡以免影響您的會員權益。</p>
      <p class="bold">客服專線：(02) 2591-5068</p>
      <p class="bold">服務時間：週一～週六 9:00～18:00（國定例假日除外）</p>
    </div>

    <div id="card-list"></div>

    <!-- 密碼輸入區塊 -->
    <div id="password-section" style="display: none; margin-top: 20px;">
      <div class="card">
        <p class="page-desc" id="password-desc">請設定您的登入密碼。</p>

        <!-- 設定新密碼 (無 EC 帳號) -->
        <div id="new-password-fields">
          <div class="form-group">
            <label class="form-label"><span class="required">* </span>請設定新密碼</label>
            <input type="password" class="form-input" id="bind-new-password" placeholder="新密碼（6-20字元，需包含英文及數字）">
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">* </span>請再次輸入新密碼</label>
            <input type="password" class="form-input" id="bind-new-password-confirm" placeholder="確認新密碼">
          </div>
        </div>

        <!-- 輸入原密碼 (有 EC 帳號) -->
        <div id="existing-password-field" style="display: none;">
          <div class="form-group">
            <label class="form-label"><span class="required">* </span>請輸入會員密碼</label>
            <input type="password" class="form-input" id="bind-password" placeholder="請輸入原會員密碼">
          </div>
        </div>
      </div>
    </div>

    <div id="bind-error"></div>

    <button class="btn btn-primary" id="bind-submit-btn" disabled>送出</button>
  `;let i=e.querySelector("#card-list"),d=e.querySelector("#bind-submit-btn"),t=e.querySelector("#bind-error"),n=e.querySelector("#password-section"),l=e.querySelector("#password-desc"),o=e.querySelector("#new-password-fields"),c=e.querySelector("#existing-password-field"),p=e.querySelector("#bind-new-password"),u=e.querySelector("#bind-new-password-confirm"),m=e.querySelector("#bind-password"),v=null;s.forEach((e,s)=>{let r=document.createElement("div"),a=(r.className="member-card",r.innerHTML=`
      <input type="radio" name="member-card" class="member-card-radio" id="card-${s}" value="${s}">
      <div class="member-card-info">
        <div class="member-card-number">會員卡號：${e.serialNumber||"N/A"}</div>
        <div class="member-card-name">會員姓名：${e.name||"N/A"}</div>
        <div class="member-card-points">點數餘額：${e.point||0}</div>
      </div>
      <hr class="member-card-divider">
      <div class="member-card-detail">入會方式：${e.joinMethod||"門市"}</div>
      <div class="member-card-detail sub">入會日：${e.joinDate||"N/A"}</div>
      <div class="member-card-detail sub">最近一消費日：${e.lastBuyDate||"N/A"}</div>
    `,r.querySelector('input[type="radio"]'));a.addEventListener("change",()=>{document.querySelectorAll(".member-card").forEach(e=>e.classList.remove("selected")),a.checked&&(r.classList.add("selected"),v=e,d.disabled=!1,n.style.display="block",e.hasECAccount?(l.textContent="此會員卡需要密碼驗證，請輸入原會員密碼。",o.style.display="none",c.style.display="block",p.value="",u.value=""):(l.textContent="請為此會員卡設定登入密碼。",o.style.display="block",c.style.display="none",m.value=""))}),r.addEventListener("click",()=>{a.checked=!0,a.dispatchEvent(new Event("change"))}),i.appendChild(r)}),d.addEventListener("click",async()=>{if(v){let e="";if(v.hasECAccount){if(!(e=m.value.trim()))return void(t.innerHTML='<p class="error-msg">請輸入會員密碼</p>')}else{var s=p.value.trim(),r=u.value.trim();if(!s||!r)return void(t.innerHTML='<p class="error-msg">請輸入新密碼及確認密碼</p>');if(s!==r)return void(t.innerHTML='<p class="error-msg">密碼與確認密碼不一致</p>');if(s.length<6||20<s.length)return void(t.innerHTML='<p class="error-msg">密碼長度需介於 6-20 字元</p>');if(!/\d/.test(s))return void(t.innerHTML='<p class="error-msg">密碼需包含至少一個數字</p>');if(!/[a-zA-Z]/.test(s))return void(t.innerHTML='<p class="error-msg">密碼需包含至少一個英文字母</p>');e=s}d.disabled=!0,d.textContent="綁定中...",t.innerHTML="";try{var a=await ApiService.registerLink({ssoAccountId:v.ssoAccountId||0,serialNumber:v.serialNumber||"",needVerifyUserAccount:v.hasECAccount||!1,ssoUserAccount:v.hasECAccount?Router.state.username:"",password:e});if(a.data){if(Router.showToast("綁定成功"),Router.state.password=e,Router.state.lineUserId)try{await ApiService.sendLoginToBackend(Router.state.lineUserId,Router.state.username,e),console.log("✅ 已發送登入資訊給後端系統")}catch(e){console.warn("⚠️ 發送登入資訊失敗，但不影響綁定流程",e)}try{await ApiService.getTokenByPassword(Router.state.username,e),console.log("✅ 已取得登入 Token")}catch(e){console.warn("⚠️ 取得 Token 失敗，但不影響綁定流程",e)}Router.state.isLoggedIn=!0,Router.navigate("/success")}else t.innerHTML=`<p class="error-msg">${a.message||"綁定失敗，請稍後再試"}</p>`,d.disabled=!1,d.textContent="送出"}catch(e){t.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>',d.disabled=!1,d.textContent="送出"}}else t.innerHTML='<p class="error-msg">請選擇要綁定的會員卡</p>'})};