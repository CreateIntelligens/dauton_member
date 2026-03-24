/* ============================================
   綁定會員卡頁面
   ============================================ */

const BindCardPage = (container) => {
  const existMembers = Router.state.existMembers || [];

  container.innerHTML = `
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
  `;

  const cardList = container.querySelector('#card-list');
  const submitBtn = container.querySelector('#bind-submit-btn');
  const errorDiv = container.querySelector('#bind-error');
  const passwordSection = container.querySelector('#password-section');
  const passwordDesc = container.querySelector('#password-desc');
  const newPasswordFields = container.querySelector('#new-password-fields');
  const existingPasswordField = container.querySelector('#existing-password-field');
  const newPasswordInput = container.querySelector('#bind-new-password');
  const newPasswordConfirmInput = container.querySelector('#bind-new-password-confirm');
  const passwordInput = container.querySelector('#bind-password');
  let selectedMember = null;

  // 渲染會員卡列表
  existMembers.forEach((member, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'member-card';
    cardEl.innerHTML = `
      <input type="radio" name="member-card" class="member-card-radio" id="card-${index}" value="${index}">
      <div class="member-card-info">
        <div class="member-card-number">會員卡號：${member.serialNumber || 'N/A'}</div>
        <div class="member-card-name">會員姓名：${member.name || 'N/A'}</div>
        <div class="member-card-points">點數餘額：${member.point || 0}</div>
      </div>
      <hr class="member-card-divider">
      <div class="member-card-detail">入會方式：${member.joinMethod || '門市'}</div>
      <div class="member-card-detail sub">入會日：${member.joinDate || 'N/A'}</div>
      <div class="member-card-detail sub">最近一消費日：${member.lastBuyDate || 'N/A'}</div>
    `;

    const radio = cardEl.querySelector('input[type="radio"]');
    radio.addEventListener('change', () => {
      document.querySelectorAll('.member-card').forEach(c => c.classList.remove('selected'));
      if (radio.checked) {
        cardEl.classList.add('selected');
        selectedMember = member;
        submitBtn.disabled = false;

        // 顯示密碼輸入區塊
        passwordSection.style.display = 'block';

        if (member.hasECAccount) {
          // 有 EC 帳號：要求輸入原密碼
          passwordDesc.textContent = '此會員卡需要密碼驗證，請輸入原會員密碼。';
          newPasswordFields.style.display = 'none';
          existingPasswordField.style.display = 'block';
          newPasswordInput.value = '';
          newPasswordConfirmInput.value = '';
        } else {
          // 無 EC 帳號：要求設定新密碼
          passwordDesc.textContent = '請為此會員卡設定登入密碼。';
          newPasswordFields.style.display = 'block';
          existingPasswordField.style.display = 'none';
          passwordInput.value = '';
        }
      }
    });

    cardEl.addEventListener('click', () => {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    });

    cardList.appendChild(cardEl);
  });

  submitBtn.addEventListener('click', async () => {
    if (!selectedMember) {
      errorDiv.innerHTML = '<p class="error-msg">請選擇要綁定的會員卡</p>';
      return;
    }

    let bindPassword = '';

    if (selectedMember.hasECAccount) {
      // 有 EC 帳號：驗證原密碼
      bindPassword = passwordInput.value.trim();
      if (!bindPassword) {
        errorDiv.innerHTML = '<p class="error-msg">請輸入會員密碼</p>';
        return;
      }
    } else {
      // 無 EC 帳號：驗證新密碼
      const newPassword = newPasswordInput.value.trim();
      const newPasswordConfirm = newPasswordConfirmInput.value.trim();

      if (!newPassword || !newPasswordConfirm) {
        errorDiv.innerHTML = '<p class="error-msg">請輸入新密碼及確認密碼</p>';
        return;
      }

      if (newPassword !== newPasswordConfirm) {
        errorDiv.innerHTML = '<p class="error-msg">密碼與確認密碼不一致</p>';
        return;
      }

      // 密碼規則：長度 6-20，至少一個數字，至少一個英文字母
      if (newPassword.length < 6 || newPassword.length > 20) {
        errorDiv.innerHTML = '<p class="error-msg">密碼長度需介於 6-20 字元</p>';
        return;
      }

      if (!/\d/.test(newPassword)) {
        errorDiv.innerHTML = '<p class="error-msg">密碼需包含至少一個數字</p>';
        return;
      }

      if (!/[a-zA-Z]/.test(newPassword)) {
        errorDiv.innerHTML = '<p class="error-msg">密碼需包含至少一個英文字母</p>';
        return;
      }

      bindPassword = newPassword;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '綁定中...';
    errorDiv.innerHTML = '';

    try {
      const result = await ApiService.registerLink({
        ssoAccountId: selectedMember.ssoAccountId || 0,
        serialNumber: selectedMember.serialNumber || '',
        needVerifyUserAccount: selectedMember.hasECAccount || false,
        ssoUserAccount: selectedMember.hasECAccount ? Router.state.username : '',
        password: bindPassword,
      });

      if (result.data) {
        Router.showToast('綁定成功');

        // 儲存密碼到 state (用於後續登入)
        Router.state.password = bindPassword;

        // 發送登入資訊給後端系統
        if (Router.state.lineUserId) {
          try {
            await ApiService.sendLoginToBackend(
              Router.state.lineUserId,
              Router.state.username,
              bindPassword
            );
            console.log('✅ 已發送登入資訊給後端系統');
          } catch (err) {
            console.warn('⚠️ 發送登入資訊失敗，但不影響綁定流程', err);
          }
        }

        // 取得登入 Token (使用新設定的密碼)
        try {
          await ApiService.getTokenByPassword(Router.state.username, bindPassword);
          console.log('✅ 已取得登入 Token');
        } catch (err) {
          console.warn('⚠️ 取得 Token 失敗，但不影響綁定流程', err);
        }

        // 綁定完成視為已登入
        Router.state.isLoggedIn = true;
        Router.navigate('/success');
      } else {
        errorDiv.innerHTML = `<p class="error-msg">${result.message || '綁定失敗，請稍後再試'}</p>`;
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
