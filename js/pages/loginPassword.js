/* ============================================
   已連結帳號 - 輸入密碼頁面
   ============================================ */

const LoginPasswordPage = (container) => {
  const username = Router.state.username;

  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">登入帳號</h2>

      <div class="login-info">
        <p>請輸入您的密碼以完成登入</p>
      </div>

      <div class="form-group">
        <label class="form-label">帳號</label>
        <input type="tel" class="form-input disabled" id="login-username" value="${username}" disabled>
      </div>

      <div class="form-group">
        <label class="form-label">密碼</label>
        <input type="password" class="form-input" id="login-password" placeholder="請輸入密碼">
      </div>

      <div id="login-error"></div>

      <button class="btn btn-primary" id="login-submit-btn">登入</button>

      <a href="#/forgotPassword" class="forgot-password-link">忘記密碼？</a>
    </div>
  `;

  const passwordInput = container.querySelector('#login-password');
  const submitBtn = container.querySelector('#login-submit-btn');
  const errorDiv = container.querySelector('#login-error');

  submitBtn.addEventListener('click', async () => {
    const password = passwordInput.value.trim();

    if (!password) {
      errorDiv.innerHTML = '<p class="error-msg">請輸入密碼</p>';
      return;
    }

    errorDiv.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.textContent = '登入中...';

    try {
      // 使用 password grant 取得 access token
      const tokenResult = await ApiService.getTokenByPassword(username, password);

      if (tokenResult.access_token) {
        Router.state.password = password;
        Router.showToast('登入成功');

        // 發送登入資訊給後端系統
        if (Router.state.lineUserId) {
          try {
            await ApiService.sendLoginToBackend(
              Router.state.lineUserId,
              username,
              password
            );
            console.log('✅ 已發送登入資訊給後端系統');
          } catch (err) {
            console.warn('⚠️ 發送登入資訊失敗，但不影響登入流程', err);
          }
        }

        // 檢查會員條款版本
        try {
          const agreementResult = await ApiService.getMemberAgreement();
          const agreementVersion = agreementResult.data || agreementResult;

          if (agreementVersion === 'NEWPUBLISHV') {
            Router.navigate('/agreement');
            return;
          }
        } catch (err) {
          console.warn('無法取得會員條款版本，繼續登入流程');
        }

        // 設定登入完成狀態
        Router.state.isLoggedIn = true;
        Router.navigate('/success');
      } else {
        errorDiv.innerHTML = '<p class="error-msg">登入失敗，請檢查密碼是否正確</p>';
        submitBtn.disabled = false;
        submitBtn.textContent = '登入';
      }
    } catch (err) {
      errorDiv.innerHTML = '<p class="error-msg">密碼錯誤或網路異常，請稍後再試</p>';
      submitBtn.disabled = false;
      submitBtn.textContent = '登入';
    }
  });

  // Enter 鍵登入
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });
};
