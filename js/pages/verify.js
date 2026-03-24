/* ============================================
   手機驗證頁面
   ============================================ */

const VerifyPage = (container) => {
  const username = Router.state.username;

  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">手機號碼驗證</h2>

      <div class="verify-section">
        <div class="form-group">
          <label class="form-label">手機號碼</label>
          <input type="tel" class="form-input disabled" id="verify-phone" value="${username}" disabled>
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
  `;

  const sendBtn = container.querySelector('#send-code-btn');
  const codeInput = container.querySelector('#verify-code');
  const submitBtn = container.querySelector('#verify-submit-btn');
  const errorDiv = container.querySelector('#verify-error');

  // 發送驗證碼
  sendBtn.addEventListener('click', async () => {
    sendBtn.disabled = true;
    sendBtn.textContent = '發送中...';

    try {
      // 發送驗證碼 (不需要 OAuth Token)
      const result = await ApiService.sendConfirmCode(username);
      if (result.data && result.data.isSuccessful) {
        Router.showToast('驗證碼已發送');
        submitBtn.disabled = false;

        // 測試環境可能直接回傳驗證碼
        if (result.data.confirmCode) {
          codeInput.value = result.data.confirmCode;
        }

        // 倒數計時 60 秒
        let countdown = 60;
        sendBtn.textContent = `重新發送 (${countdown}s)`;
        const timer = setInterval(() => {
          countdown--;
          sendBtn.textContent = `重新發送 (${countdown}s)`;
          if (countdown <= 0) {
            clearInterval(timer);
            sendBtn.disabled = false;
            sendBtn.textContent = '發送手機驗證碼';
          }
        }, 1000);
      } else {
        errorDiv.innerHTML = `<p class="error-msg">${result.message || '發送失敗，請稍後再試'}</p>`;
        sendBtn.disabled = false;
        sendBtn.textContent = '發送手機驗證碼';
      }
    } catch (err) {
      errorDiv.innerHTML = '<p class="error-msg">網路錯誤，請稍後再試</p>';
      sendBtn.disabled = false;
      sendBtn.textContent = '發送手機驗證碼';
    }
  });

  // 驗證碼送出
  submitBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    if (!code) {
      errorDiv.innerHTML = '<p class="error-msg">請輸入驗證碼</p>';
      return;
    }

    errorDiv.innerHTML = '';
    submitBtn.disabled = true;
    submitBtn.textContent = '驗證中...';

    try {
      const result = await ApiService.verifyConfirmCode(username, code);
      if (result.data && result.data.isSuccessful) {
        Router.showToast('驗證成功');

        // 判斷流程：已連結 vs 新會員 vs 綁卡
        if (Router.state.isLinked) {
          // 已連結帳號 -> 導向登入密碼頁面
          Router.navigate('/loginPassword');
          return;
        }

        // 未連結流程(isLinked = false)：先導向隱私及會員保護政策頁面
        // 流程圖：驗證成功 -> 隱私政策頁面 -> 勾選同意 -> 判斷 existMembers
        Router.navigate('/privacy');
      } else {
        errorDiv.innerHTML = `<p class="error-msg">${result.message || '驗證碼錯誤，請重新輸入'}</p>`;
        submitBtn.disabled = false;
        submitBtn.textContent = '送出';
      }
    } catch (err) {
      errorDiv.innerHTML = '<p class="error-msg">網路錯誤，請稍後再試</p>';
      submitBtn.disabled = false;
      submitBtn.textContent = '送出';
    }
  });
};
