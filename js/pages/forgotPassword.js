/* ============================================
   忘記密碼頁面
   ============================================ */

const ForgotPasswordPage = (container) => {
  const username = Router.state.username || '';

  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">忘記密碼</h2>

      <p class="page-desc">請輸入您的手機號碼，系統將自動產生新密碼並以簡訊發送給您。</p>

      <div class="form-group">
        <label class="form-label">手機號碼</label>
        <input type="tel" class="form-input" id="forgot-phone" value="${username}" placeholder="請輸入手機號碼" maxlength="10">
      </div>

      <div id="reset-error"></div>

      <button class="btn btn-primary" id="reset-password-btn">重設密碼</button>

      <div style="margin-top: 20px; text-align: center;">
        <a href="#/login" style="color: #5a5a5a; text-decoration: underline; font-size: 14px;">返回登入</a>
      </div>
    </div>
  `;

  const phoneInput = container.querySelector('#forgot-phone');
  const resetPasswordBtn = container.querySelector('#reset-password-btn');
  const resetError = container.querySelector('#reset-error');

  // 重設密碼
  resetPasswordBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();

    if (!phone) {
      resetError.innerHTML = '<p class="error-msg">請輸入手機號碼</p>';
      return;
    }

    if (!/^09\d{8}$/.test(phone)) {
      resetError.innerHTML = '<p class="error-msg">請輸入正確的手機號碼格式</p>';
      return;
    }

    resetPasswordBtn.disabled = true;
    resetPasswordBtn.textContent = '處理中...';
    resetError.innerHTML = '';

    try {
      // 呼叫 resetPassword API（此 API 會自動產生新密碼並以簡訊發送）
      const result = await ApiService.resetPassword(phone);

      if (result.success || result.data || result.code === '0') {
        Router.showToast('密碼重設成功！新密碼已發送至您的手機，請查收簡訊。');

        // 延遲後導回登入頁
        setTimeout(() => {
          Router.state.username = phone;
          Router.navigate('/loginPassword');
        }, 2000);
      } else {
        resetError.innerHTML = `<p class="error-msg">${result.message || '密碼重設失敗，請檢查手機號碼是否正確'}</p>`;
        resetPasswordBtn.disabled = false;
        resetPasswordBtn.textContent = '重設密碼';
      }
    } catch (err) {
      resetError.innerHTML = '<p class="error-msg">網路錯誤，請稍後再試</p>';
      resetPasswordBtn.disabled = false;
      resetPasswordBtn.textContent = '重設密碼';
    }
  });

  // Enter 鍵送出
  phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      resetPasswordBtn.click();
    }
  });
};
