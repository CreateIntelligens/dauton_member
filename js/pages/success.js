/* ============================================
   註冊成功頁面
   ============================================ */

const SuccessPage = (container) => {
  // 判斷是否為登入完成 (註冊或綁定後)
  const isLoggedIn = Router.state.isLoggedIn || false;
  const title = isLoggedIn ? '登入完成' : '註冊成功';
  const buttonText = isLoggedIn ? '關閉視窗' : '確定';

  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">${title}</h2>

      <div class="success-message">
        <p>親愛的會員您好！</p>
        <p class="highlight">恭喜您升級完成！<br>取得會員點數2000點！</p>
        <p>即日起，回到對話框即可開始體驗更快速的個人化服務，最新獨享優惠不漏接！ ✨</p>
      </div>

      <button class="btn btn-primary" id="success-confirm-btn">${buttonText}</button>
    </div>
  `;

  const confirmBtn = container.querySelector('#success-confirm-btn');
  confirmBtn.addEventListener('click', () => {
    // 關閉視窗或導回首頁
    if (window.liff && window.liff.isInClient()) {
      window.liff.closeWindow();
    } else {
      // 一般瀏覽器環境，嘗試關閉視窗
      window.close();
      // 如果無法關閉，顯示提示
      setTimeout(() => {
        alert('請手動關閉此視窗');
      }, 100);
    }
  });
};
