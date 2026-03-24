let AgreementPage=e=>{e.innerHTML=`
    <div class="terms-box">
      <div class="terms-text">
        <p><strong>大同會員約定條款 / 隱私權保護政策</strong></p>
        <p class="section-gap">本服務為升級大同會員使用，透過大同TATUNG同樂會官方帳號完成升級步驟後，即視同實體會員卡，能透過LINE隨時查詢/使用點數、獲得獨家優惠資訊、快速線上報修…等，使用更多會員專屬服務。</p>
        <p class="section-gap">為保障您的權益，請先詳閱以下注意事項，勾選同意後即可繼續升級個人化服務。</p>
        <p class="section-gap">1.在您接受且同意以下服務條款並首次使用大同會員個人化服務升級時，根據您提供的個人資訊與LINE帳號進行連結驗證，以確保您的使用安全。</p>
        <p class="section-gap">2.本服務僅供個人使用，不得將帳號轉讓、出借或以任何方式提供予第三方使用。</p>
        <p class="section-gap">3.您同意大同公司得依據隱私權政策蒐集、處理及利用您的個人資料，以提供本服務及相關會員權益。</p>
        <p class="section-gap">4.大同公司保留隨時修改本服務條款之權利，修改後之條款將公告於本平台，繼續使用本服務即視為同意修改後之條款。</p>
        <p class="section-gap">5.如有任何違反本條款之行為，大同公司有權暫停或終止您的服務使用權限。</p>
      </div>
    </div>

    <div class="terms-agreement">
      <div class="checkbox-group">
        <input type="checkbox" id="agree-terms-update">
        <label for="agree-terms-update">我已閱讀並同意以上條款</label>
      </div>

      <div id="agreement-error"></div>

      <button class="btn btn-primary" id="agreement-confirm-btn" disabled>同意</button>
    </div>
  `;let t=e.querySelector("#agree-terms-update"),s=e.querySelector("#agreement-confirm-btn"),r=e.querySelector("#agreement-error");t.addEventListener("change",()=>{s.disabled=!t.checked}),s.addEventListener("click",async()=>{if(t.checked){s.disabled=!0,s.textContent="處理中...",r.innerHTML="";try{var e=await ApiService.updateMemberAgreement();200===e.code||e.data?(Router.showToast("條款同意成功"),Router.navigate("/success")):(r.innerHTML=`<p class="error-msg">${e.message||"更新失敗，請稍後再試"}</p>`,s.disabled=!1,s.textContent="同意")}catch(e){r.innerHTML='<p class="error-msg">網路錯誤，請稍後再試</p>',s.disabled=!1,s.textContent="同意"}}else r.innerHTML='<p class="error-msg">請先同意條款</p>'})};