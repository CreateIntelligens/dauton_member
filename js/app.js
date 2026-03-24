/* ============================================
   SPA 應用程式入口
   ============================================ */

// 註冊所有路由
Router.register('/terms', TermsPage);
Router.register('/login', LoginPage);
Router.register('/verify', VerifyPage);
Router.register('/loginPassword', LoginPasswordPage);
Router.register('/privacy', PrivacyPage);
Router.register('/register', RegisterPage);
Router.register('/success', SuccessPage);
Router.register('/bindCard', BindCardPage);
Router.register('/agreement', AgreementPage);
Router.register('/forgotPassword', ForgotPasswordPage);

// 啟動應用程式
Router.init();
