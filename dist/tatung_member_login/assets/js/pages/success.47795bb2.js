let SuccessPage=s=>{var e=Router.state.isLoggedIn||!1;s.innerHTML=`
    <div class="card">
      <h2 class="page-title">${e?"登入完成":"註冊成功"}</h2>

      <div class="success-message">
        <p>親愛的會員您好！</p>
        <p class="highlight">恭喜您升級完成！<br>取得會員點數2000點！</p>
        <p>即日起，回到對話框即可開始體驗更快速的個人化服務，最新獨享優惠不漏接！ ✨</p>
      </div>

      <button class="btn btn-primary" id="success-confirm-btn">${e?"關閉視窗":"確定"}</button>
    </div>
  `,s.querySelector("#success-confirm-btn").addEventListener("click",()=>{window.liff&&window.liff.isInClient()?window.liff.closeWindow():(window.close(),setTimeout(()=>{alert("請手動關閉此視窗")},100))})};