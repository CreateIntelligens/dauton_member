/* ============================================
   API Service Module
   讀取 index.html 中定義的全域 API 設定
   ============================================ */

const ApiService = (() => {
  const getConfig = () => window.API_CONFIG;

  // 儲存 token 相關資料
  const tokenStore = {
    accessToken: '',
    ticket: '',
    registerToken: '',
  };

  // 通用 POST 請求
  const post = async (endpointKey, body, needAuth = false) => {
    const config = getConfig();
    const path = config[endpointKey] || endpointKey;
    const headers = { 'Content-Type': 'application/json' };
    if (needAuth && tokenStore.accessToken) {
      headers['Authorization'] = `bearer ${tokenStore.accessToken}`;
    }

    console.log('🔵 API Request:', {
      url: `${config.BASE_URL}${path}`,
      method: 'POST',
      headers,
      body,
    });

    try {
      const res = await fetch(`${config.BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('✅ API Response:', {
        status: res.status,
        statusText: res.statusText,
        data,
      });

      return data;
    } catch (err) {
      console.error('❌ API Error:', {
        message: err.message,
        stack: err.stack,
        url: `${config.BASE_URL}${path}`,
      });
      throw err;
    }
  };

  // 通用 GET 請求
  const get = async (endpointKey) => {
    const config = getConfig();
    const path = config[endpointKey] || endpointKey;
    const headers = {
      Authorization: `bearer ${tokenStore.accessToken}`,
    };
    const res = await fetch(`${config.BASE_URL}${path}`, { headers });
    return res.json();
  };

  // 取得 OAuth Token (使用 refresh_token)
  const getToken = async () => {
    const config = getConfig();

    try {
      // 優先使用 refresh_token
      if (config.REFRESH_TOKEN) {
        const res = await fetch(`${config.BASE_URL}${config.TOKEN_ENDPOINT}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            refresh_token: config.REFRESH_TOKEN,
          }),
        });
        const data = await res.json();
        if (data.access_token) {
          tokenStore.accessToken = data.access_token;
          console.log('✅ Token 取得成功 (refresh_token)');
          return data;
        }
      }

      // 回退到 client_credentials (如果沒有 refresh_token)
      const res = await fetch(`${config.BASE_URL}${config.TOKEN_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.CLIENT_ID,
          client_secret: config.CLIENT_SECRET,
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        tokenStore.accessToken = data.access_token;
        console.log('✅ Token 取得成功 (client_credentials)');
        return data;
      }

      console.warn('⚠️ OAuth Token 取得失敗，但大部分 Account API 不需要 Token，將繼續執行');
      return { error: 'token_failed', message: 'Token unavailable but continuing' };
    } catch (err) {
      console.warn('⚠️ OAuth Token 請求失敗，但大部分 Account API 不需要 Token，將繼續執行');
      return { error: 'token_failed', message: err.message };
    }
  };

  // 取得 OAuth Token (password grant)
  const getTokenByPassword = async (username, password) => {
    const config = getConfig();
    const res = await fetch(`${config.BASE_URL}${config.TOKEN_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        username,
        password,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      tokenStore.accessToken = data.access_token;
    }
    return data;
  };

  // STEP1: 檢查帳號是否已連結
  const checkUsernameUsed = async (username) => {
    const config = getConfig();
    return post('CHECK_USERNAME_USED', {
      username,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
  };

  // STEP2: 取得會員同意書版本
  const getMemberAgreement = async () => {
    return get('/service/member/getagreementv');
  };

  // STEP2: 更新會員同意書版本
  const updateMemberAgreement = async () => {
    const config = getConfig();
    return post('/service/member/updagreementv', {
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    }, true);
  };

  // STEP4a: 發送驗證碼
  const sendConfirmCode = async (username) => {
    const config = getConfig();
    const result = await post('SEND_CONFIRM_CODE', {
      username,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
    if (result.data && result.data.ticket) {
      tokenStore.ticket = result.data.ticket;
    }
    return result;
  };

  // STEP4b: 驗證驗證碼
  const verifyConfirmCode = async (username, confirmCode) => {
    const config = getConfig();
    const result = await post('VERIFY_CONFIRM_CODE', {
      username,
      ticket: tokenStore.ticket,
      confirmCode,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
    if (result.data && result.data.registerToken) {
      tokenStore.registerToken = result.data.registerToken;
    }
    return result;
  };

  // STEP5: 註冊新會員
  const registerAccount = async (formData) => {
    const config = getConfig();
    return post('REGISTER_ACCOUNT', {
      registerToken: tokenStore.registerToken,
      name: formData.name,
      password: formData.password,
      birthday: formData.birthday,
      sex: formData.sex,
      zip: formData.zip || '',
      city: formData.city,
      district: formData.district,
      address: formData.address,
      mobile: formData.mobile,
      email: formData.email || '',
      homePhoneArea: formData.homePhoneArea || '',
      homePhone: formData.homePhone || '',
      homePhoneExtension: formData.homePhoneExtension || '',
      marketSurvey: formData.marketSurvey || '',
      favoriteShop: formData.favoriteShop || '',
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
  };

  // STEP6/7: 綁定會員
  const registerLink = async (linkData) => {
    const config = getConfig();
    return post('REGISTER_LINK', {
      registerToken: tokenStore.registerToken,
      ssoAccountId: linkData.ssoAccountId || 0,
      serialNumber: linkData.serialNumber || '',
      needVerifyUserAccount: linkData.needVerifyUserAccount || false,
      ssoUserAccount: linkData.ssoUserAccount || '',
      password: linkData.password,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
  };

  // 重設密碼
  const resetPassword = async (username) => {
    const config = getConfig();
    return post('RESET_PASSWORD', {
      username,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
    });
  };

  // 取得會員資料
  const getMemberInfo = async () => {
    return get('MEMBER_INFO');
  };

  // 清除所有 Token
  const clearTokens = () => {
    tokenStore.accessToken = '';
    tokenStore.ticket = '';
    tokenStore.registerToken = '';
    console.log('✅ 已清除所有 Token');
  };

  // 強制重新取得 Token
  const refreshToken = async () => {
    clearTokens();
    return await getToken();
  };

  // 發送登入資訊給後端系統 (用於紀錄 LINE 用戶的會員資料)
  const sendLoginToBackend = async (lineUserId, username, password) => {
    const config = getConfig();
    const backendUrl = config.BACKEND_LOGIN_URL || 'https://line.uat.tatung2025.aitago.tw';

    console.log('🔵 發送登入資訊給後端系統:', {
      url: `${backendUrl}/api/gateway/login/${lineUserId}`,
      username,
      accessToken: tokenStore.accessToken ? '有' : '無',
    });

    try {
      const res = await fetch(`${backendUrl}/api/gateway/login/${lineUserId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          accessToken: tokenStore.accessToken,
        }),
      });

      const data = await res.json();
      console.log('✅ 後端系統回應:', data);
      return data;
    } catch (err) {
      console.error('❌ 發送登入資訊失敗:', err);
      throw err;
    }
  };

  return {
    tokenStore,
    getToken,
    getTokenByPassword,
    checkUsernameUsed,
    getMemberAgreement,
    updateMemberAgreement,
    sendConfirmCode,
    verifyConfirmCode,
    registerAccount,
    registerLink,
    resetPassword,
    getMemberInfo,
    clearTokens,
    refreshToken,
    sendLoginToBackend,
  };
})();
