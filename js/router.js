/* ============================================
   SPA Router - Hash-based routing
   ============================================ */

const Router = (() => {
  const routes = {};
  let currentPage = null;

  // 從 URL 取得 LINE User ID
  const getLineUserId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('line_user_id') || '';
  };

  // 共享狀態（頁面間傳遞資料）
  const state = {
    username: '',
    password: '',
    isLinked: false,
    existMembers: [],
    usernameType: '',
    lineUserId: getLineUserId(),
  };

  const register = (path, renderFn) => {
    routes[path] = renderFn;
  };

  const navigate = (path) => {
    window.location.hash = path;
  };

  const render = () => {
    const hash = window.location.hash.slice(1) || '/terms';
    const container = document.getElementById('page-container');
    const renderFn = routes[hash];

    if (renderFn) {
      container.innerHTML = '';
      currentPage = hash;
      renderFn(container);
    } else {
      container.innerHTML = '<div class="card"><p>頁面不存在</p></div>';
    }
  };

  const init = () => {
    window.addEventListener('hashchange', render);
    render();
  };

  // Toast 通知
  const showToast = (message, duration = 2500) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  return { register, navigate, render, init, state, showToast };
})();
