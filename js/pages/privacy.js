/* ============================================
   隱私及會員保護政策頁面 (isLinked = false 時顯示)
   ============================================ */

const PrivacyPage = (container) => {
  container.innerHTML = `
    <div class="card">
      <h2 class="page-title">隱私及會員保護政策</h2>

      <div class="terms-box">
        <div class="terms-text">
          <p><strong>大同會員約定條款</strong></p>
          <p class="section-gap">歡迎您加入大同會員！在您使用大同會員服務前，請您詳細閱讀以下條款：</p>

          <p class="section-gap"><strong>一、會員資格</strong></p>
          <p>1.在您接受會員同意以下服務條款並且完成申請程序後，提請您提供供應的個人資訊與LINE帳號進行連結驗證，以確保您的使用安全。</p>

          <p class="section-gap"><strong>二、會員權益</strong></p>
          <p>2.本服務僅供個人使用，不得將帳號轉讓、出售或以任何方式提供予第三方使用。</p>

          <p class="section-gap"><strong>三、隱私權保護</strong></p>
          <p>3.您同意大同公司得依據隱私權政策蒐集、處理及利用您所提供之個人資料，以提供會員服務。</p>

          <p class="section-gap"><strong>四、服務異動</strong></p>
          <p>4.大同公司保留隨時修改、暫停或終止會員服務之權利，並將於網站或APP公告。</p>

          <p class="section-gap"><strong>五、免責聲明</strong></p>
          <p>5.本服務所提供之資訊僅供參考，大同公司不對其完整性、正確性或即時性負責。</p>

          <p class="section-gap"><strong>六、個資保護政策</strong></p>
          <p>6.為保護您的個人資料，大同公司遵循個人資料保護法相關規定，確保您的隱私權益。您所提供的個人資料將僅用於會員服務相關用途，不會擅自轉讓或公開。</p>

          <p class="section-gap"><strong>七、聯絡方式</strong></p>
          <p>7.如您對本條款或隱私權政策有任何疑問，歡迎透過客服專線或官方網站與我們聯繫。</p>

          <p class="section-gap">感謝您的支持與信任，祝您使用愉快！</p>
        </div>
      </div>

      <div class="terms-agreement">
        <div class="checkbox-group">
          <input type="checkbox" id="privacy-agree">
          <label for="privacy-agree">我已閱讀並同意以上條款</label>
        </div>
        <button class="btn btn-primary" id="privacy-next-btn" disabled>下一步</button>
      </div>
    </div>
  `;

  const agreeCheckbox = container.querySelector('#privacy-agree');
  const nextBtn = container.querySelector('#privacy-next-btn');

  // 勾選同意才能按下一步
  agreeCheckbox.addEventListener('change', () => {
    nextBtn.disabled = !agreeCheckbox.checked;
  });

  // 下一步：判斷是否有既有會員卡
  nextBtn.addEventListener('click', () => {
    const hasValidMembers = Router.state.existMembers &&
      Router.state.existMembers.length > 0 &&
      Router.state.existMembers.some(m => m.serialNumber);

    if (hasValidMembers) {
      // STEP3: 有既有會員卡 -> 選卡頁面
      Router.navigate('/bindCard');
    } else {
      // STEP5: 新會員註冊
      Router.navigate('/register');
    }
  });
};
