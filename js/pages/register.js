/* ============================================
   新會員註冊頁面
   ============================================ */

const RegisterPage = (container) => {
  const username = Router.state.username;

  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">新會員註冊</h2>

      <p class="page-desc">請詳細填寫以下欄位，並提供真實且正確無誤的完整資料，以免影響您未來參與活動之權益，謝謝。</p>

      <form class="register-form" id="register-form">
        <div class="form-group">
          <label class="form-label"><span class="required">* </span>請設定新密碼</label>
          <input type="password" class="form-input" id="reg-password" placeholder="新密碼" required>
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>請再次輸入新密碼作為確認</label>
          <input type="password" class="form-input" id="reg-password-confirm" placeholder="請輸入驗證碼" required>
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>姓名</label>
          <input type="text" class="form-input" id="reg-name" placeholder="姓名" required>
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>生日</label>
          <input type="date" class="form-input" id="reg-birthday" required>
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>性別</label>
          <div class="form-row">
            <select class="form-select" id="reg-sex" required>
              <option value="">性別</option>
              <option value="M">男</option>
              <option value="F">女</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>地址</label>
          <div class="form-row">
            <select class="form-select" id="reg-city" required>
              <option value="">縣市</option>
              <option value="臺北市">臺北市</option>
              <option value="新北市">新北市</option>
              <option value="桃園市">桃園市</option>
              <option value="臺中市">臺中市</option>
              <option value="臺南市">臺南市</option>
              <option value="高雄市">高雄市</option>
            </select>
            <select class="form-select" id="reg-district" required>
              <option value="">鄉鎮市區</option>
            </select>
          </div>
          <input type="text" class="form-input" id="reg-address" placeholder="地址" required style="margin-top: 12px;">
        </div>

        <div class="form-group">
          <label class="form-label"><span class="required">* </span>Email</label>
          <input type="email" class="form-input" id="reg-email" placeholder="Email">
        </div>

        <div class="form-group">
          <label class="form-label">市話</label>
          <div class="form-row-3">
            <input type="text" class="form-input" id="reg-phone-area" placeholder="區域碼" maxlength="3">
            <input type="text" class="form-input" id="reg-phone" placeholder="市話" maxlength="8">
            <input type="text" class="form-input" id="reg-phone-ext" placeholder="分機" maxlength="6">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">同意行銷方式</label>
          <div class="checkbox-inline">
            <div class="checkbox-group">
              <input type="checkbox" id="market-sms" value="簡訊">
              <label for="market-sms">簡訊</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="market-phone" value="電訪">
              <label for="market-phone">電訪</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="market-email" value="Email">
              <label for="market-email">Email</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="market-mail" value="郵寄">
              <label for="market-mail">郵寄</label>
            </div>
          </div>
        </div>

        <div class="agreement-links">
          <div class="checkbox-group">
            <input type="checkbox" id="agree-terms" required>
            <label for="agree-terms">我已閱讀且同意大同會員約定條款</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="agree-privacy" required>
            <label for="agree-privacy">我已閱讀且同意大同會員隱私權聲明</label>
          </div>
        </div>

        <div id="register-error"></div>

        <button type="submit" class="btn btn-primary">送出</button>
      </form>
    </div>
  `;

  const form = container.querySelector('#register-form');
  const errorDiv = container.querySelector('#register-error');
  const citySelect = container.querySelector('#reg-city');
  const districtSelect = container.querySelector('#reg-district');

  // 縣市區域對應
  const districts = {
    '臺北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
    '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'],
    '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區', '復興區'],
    '臺中市': ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區', '大甲區', '清水區', '沙鹿區', '梧棲區', '后里區', '神岡區', '潭子區', '大雅區', '新社區', '石岡區', '外埔區', '大安區', '烏日區', '大肚區', '龍井區', '霧峰區', '太平區', '大里區', '和平區'],
    '臺南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'],
    '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區', '大社區', '東沙群島', '南沙群島', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '茄萣區']
  };

  // 縣市變更時更新區域選項
  citySelect.addEventListener('change', () => {
    const city = citySelect.value;
    districtSelect.innerHTML = '<option value="">鄉鎮市區</option>';
    if (city && districts[city]) {
      districts[city].forEach(d => {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d;
        districtSelect.appendChild(option);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = container.querySelector('#reg-password').value;
    const passwordConfirm = container.querySelector('#reg-password-confirm').value;
    const name = container.querySelector('#reg-name').value;
    const birthday = container.querySelector('#reg-birthday').value;
    const sex = container.querySelector('#reg-sex').value;
    const city = container.querySelector('#reg-city').value;
    const district = container.querySelector('#reg-district').value;
    const address = container.querySelector('#reg-address').value;
    const email = container.querySelector('#reg-email').value;
    const phoneArea = container.querySelector('#reg-phone-area').value;
    const phone = container.querySelector('#reg-phone').value;
    const phoneExt = container.querySelector('#reg-phone-ext').value;
    const agreeTerms = container.querySelector('#agree-terms').checked;
    const agreePrivacy = container.querySelector('#agree-privacy').checked;

    // 驗證
    if (password !== passwordConfirm) {
      errorDiv.innerHTML = '<p class="error-msg">密碼與確認密碼不一致</p>';
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      errorDiv.innerHTML = '<p class="error-msg">請同意會員條款及隱私權聲明</p>';
      return;
    }

    // 收集行銷方式
    const marketSurvey = [];
    if (container.querySelector('#market-sms').checked) marketSurvey.push('簡訊');
    if (container.querySelector('#market-phone').checked) marketSurvey.push('電訪');
    if (container.querySelector('#market-email').checked) marketSurvey.push('Email');
    if (container.querySelector('#market-mail').checked) marketSurvey.push('郵寄');

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '註冊中...';
    errorDiv.innerHTML = '';

    try {
      const result = await ApiService.registerAccount({
        name,
        password,
        birthday: birthday + 'T00:00:00',
        sex,
        zip: '',
        city,
        district,
        address,
        mobile: username,
        email,
        homePhoneArea: phoneArea,
        homePhone: phone,
        homePhoneExtension: phoneExt,
        marketSurvey: marketSurvey.join(','),
        favoriteShop: '',
      });

      if (result.data) {
        Router.showToast('註冊成功');

        // 儲存密碼到 state
        Router.state.password = password;

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
            console.warn('⚠️ 發送登入資訊失敗，但不影響註冊流程', err);
          }
        }

        // 取得登入 Token (使用註冊時設定的密碼)
        try {
          await ApiService.getTokenByPassword(username, password);
          console.log('✅ 已取得登入 Token');
        } catch (err) {
          console.warn('⚠️ 取得 Token 失敗，但不影響註冊流程', err);
        }

        // 註冊完成視為已登入
        Router.state.isLoggedIn = true;
        Router.navigate('/success');
      } else {
        errorDiv.innerHTML = `<p class="error-msg">${result.message || '註冊失敗，請稍後再試'}</p>`;
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
