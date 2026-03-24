let LoginPage=e=>{e.innerHTML=`
    <div class="card">
      <h2 class="page-title">登入/註冊會員</h2>
      <div class="login-info">
        <p>親愛的會員您好！</p>
        <p>即日起，大同會員將全面改以 手機號碼 做為帳號登入，登入完成後，您將可使用同一組帳號和密碼，登入大同其它數位服務（如：大同同樂會APP或回購），免除重複註冊會員之不便。</p>
      </div>

      <div class="form-group">
        <label class="form-label">帳號</label>
        <input type="tel" class="form-input" id="login-username" placeholder="請輸入手機號碼" maxlength="10">
      </div>

      <div id="login-error"></div>

      <button class="btn btn-primary" id="login-next-btn">下一步</button>
    </div>
  `;let r=e.querySelector("#login-username"),a=e.querySelector("#login-next-btn"),i=e.querySelector("#login-error");a.addEventListener("click",async()=>{var e=r.value.trim();if(e){i.innerHTML="",a.disabled=!0,a.textContent="處理中...";try{var t=await ApiService.checkUsernameUsed(e);return Router.state.username=e,t.data&&(Router.state.isLinked=t.data.isLinked,Router.state.usernameType=t.data.usernameType,Router.state.existMembers=t.data.existMembers||[],t.data.isLinked)?void Router.navigate("/loginPassword"):void Router.navigate("/verify")}catch(e){i.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>'}a.disabled=!1,a.textContent="下一步"}else i.innerHTML='<p class="error-msg">請輸入手機號碼</p>'})};