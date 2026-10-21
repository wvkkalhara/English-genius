/* English Genius — Firebase setup shared by login.html and index.html.
   This web config is meant to be public; the database is protected by the rules in database.rules.json. */
(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyDeZzgfUZMAhAtxmtwgJABUPXVT9sHAtcM",
    authDomain: "english-genius-c5c1f.firebaseapp.com",
    databaseURL: "https://english-genius-c5c1f-default-rtdb.firebaseio.com",
    projectId: "english-genius-c5c1f",
    storageBucket: "english-genius-c5c1f.firebasestorage.app",
    messagingSenderId: "985452564920",
    appId: "1:985452564920:web:ba293900b23b81abec7f4d"
  };
  const ADMIN_EMAIL = 'w.v.k.kalhara@gmail.com';
  // students sign in with a username; Firebase Auth needs an email, so each username maps to one on the project's own domain
  const STUDENT_DOMAIN = 'student.english-genius-c5c1f.firebaseapp.com';

  // App Check (optional but recommended): paste a reCAPTCHA v3 site key here, then turn on enforcement in the Firebase console.
  // After that, only this website can talk to the database: scripts and copied pages are refused.
  const APP_CHECK_SITE_KEY = '';
  const app = firebase.initializeApp(firebaseConfig);
  const appCheck = a => { if(APP_CHECK_SITE_KEY && firebase.appCheck) firebase.appCheck(a).activate(new firebase.appCheck.ReCaptchaV3Provider(APP_CHECK_SITE_KEY), true); };
  appCheck(app);
  const EG = window.EG = {
    app, auth: firebase.auth(), db: firebase.database(), config: firebaseConfig,
    ADMIN_EMAIL, STUDENT_DOMAIN, appCheck,
    cleanUsername: u => String(u||'').trim().toLowerCase().replace(/[^a-z0-9_-]/g,''),
    // "nimal" → nimal@student…;  a full email is used as it is
    toEmail(login){ login=String(login||'').trim(); return login.includes('@') ? login.toLowerCase() : EG.cleanUsername(login)+'@'+STUDENT_DOMAIN; },
    usernameOf(email){ email=String(email||''); return email.endsWith('@'+STUDENT_DOMAIN) ? email.split('@')[0] : email; },
    isAdmin(user){ return !!user && String(user.email||'').toLowerCase()===ADMIN_EMAIL; },
    errText(e){
      const c=(e&&e.code)||'';
      return ({
        'auth/invalid-credential':'Wrong username or password.', 'auth/wrong-password':'Wrong username or password.',
        'auth/user-not-found':'No account with that username.', 'auth/invalid-email':'That username is not valid.',
        'auth/too-many-requests':'Too many tries — wait a minute and try again.', 'auth/network-request-failed':'No internet connection.',
        'auth/email-already-in-use':'That username is already taken.', 'auth/weak-password':'The password must be at least 6 characters.',
        'auth/operation-not-allowed':'Email/Password sign-in is not switched on in the Firebase console yet (see SETUP.md).',
        'PERMISSION_DENIED':'The database refused this. Check the database rules (see SETUP.md).'
      })[c] || (e&&e.message) || String(e);
    }
  };
})();
