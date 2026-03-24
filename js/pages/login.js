/* ============================================
   登入/註冊頁面
   ============================================ */

const LoginPage = (container) => {
  container.innerHTML = `
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
  `;

  const usernameInput = container.querySelector('#login-username');
  const nextBtn = container.querySelector('#login-next-btn');
  const errorDiv = container.querySelector('#login-error');

  nextBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();

    if (!username) {
      errorDiv.innerHTML = '<p class="error-msg">請輸入手機號碼</p>';
      return;
    }

    errorDiv.innerHTML = '';
    nextBtn.disabled = true;
    nextBtn.textContent = '處理中...';

    try {
      // STEP1: 檢查帳號是否已連結 (不需要 OAuth Token)
      const result = await ApiService.checkUsernameUsed(username);

      Router.state.username = username;

      if (result.data) {
        Router.state.isLinked = result.data.isLinked;
        Router.state.usernameType = result.data.usernameType;
        Router.state.existMembers = result.data.existMembers || [];

        if (result.data.isLinked) {
          // 已連結 -> 前往密碼登入頁面
          Router.navigate('/loginPassword');
          return;
        } else {
          // 未連結 -> 前往手機驗證（註冊流程）
          Router.navigate('/verify');
          return;
        }
      } else {
        // 帳號不存在 -> 前往手機驗證（新註冊流程）
        Router.navigate('/verify');
        return;
      }
    } catch (err) {
      errorDiv.innerHTML = '<p class="error-msg">網路錯誤，請稍後再試</p>';
    }

    nextBtn.disabled = false;
    nextBtn.textContent = '下一步';
  });
};
