let VerifyPage=e=>{let s=Router.state.username,a=(e.innerHTML=`
    <div class="card">
      <h2 class="page-title">手機號碼驗證</h2>

      <div class="verify-section">
        <div class="form-group">
          <label class="form-label">手機號碼</label>
          <input type="tel" class="form-input disabled" id="verify-phone" value="${s}" disabled>
        </div>
        <button class="btn btn-primary" id="send-code-btn">發送手機驗證碼</button>
      </div>

      <div class="verify-section">
        <div class="form-group">
          <label class="form-label">請輸入收到簡訊驗證碼</label>
          <input type="text" class="form-input" id="verify-code" placeholder="請輸入驗證碼" maxlength="6">
        </div>
        <div id="verify-error"></div>
        <button class="btn btn-primary" id="verify-submit-btn" disabled>送出</button>
      </div>
    </div>
  `,e.querySelector("#send-code-btn")),i=e.querySelector("#verify-code"),n=e.querySelector("#verify-submit-btn"),l=e.querySelector("#verify-error");a.addEventListener("click",async()=>{a.disabled=!0,a.textContent="發送中...";try{var r=await ApiService.sendConfirmCode(s);if(r.data&&r.data.isSuccessful){Router.showToast("驗證碼已發送"),n.disabled=!1,r.data.confirmCode&&(i.value=r.data.confirmCode);let e=60,t=(a.textContent=`重新發送 (${e}s)`,setInterval(()=>{e--,a.textContent=`重新發送 (${e}s)`,e<=0&&(clearInterval(t),a.disabled=!1,a.textContent="發送手機驗證碼")},1e3))}else l.innerHTML=`<p class="error-msg">${r.message||"發送失敗，請稍後再試"}</p>`,a.disabled=!1,a.textContent="發送手機驗證碼"}catch(e){l.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>',a.disabled=!1,a.textContent="發送手機驗證碼"}}),n.addEventListener("click",async()=>{var e=i.value.trim();if(e){l.innerHTML="",n.disabled=!0,n.textContent="驗證中...";try{var t=await ApiService.verifyConfirmCode(s,e);t.data&&t.data.isSuccessful?(Router.showToast("驗證成功"),Router.state.isLinked?Router.navigate("/loginPassword"):Router.navigate("/privacy")):(l.innerHTML=`<p class="error-msg">${t.message||"驗證碼錯誤，請重新輸入"}</p>`,n.disabled=!1,n.textContent="送出")}catch(e){l.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>',n.disabled=!1,n.textContent="送出"}}else l.innerHTML='<p class="error-msg">請輸入驗證碼</p>'})};