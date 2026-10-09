import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../../../firebase';
import { AlertCircle, Lock, Mail, Copy, Check, ExternalLink, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

export default function LoginScreen({ error: initialError }: { error?: string }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) {
          setError("Veuillez saisir votre adresse email.");
          setLoading(false);
          return;
        }
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.");
        setLoading(false);
        return;
      }

      if (isRegisterMode) {
        if (password.length < 6) {
          setError("Le mot de passe doit comporter au moins 6 caractères.");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        // Will auto-trigger onAuthStateChanged in App.tsx
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError("Aucun compte trouvé avec cet email. Voulez-vous créer votre compte ?");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Mot de passe ou identifiant incorrect.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Cet email est déjà enregistré. Veuillez vous connecter avec votre mot de passe.");
      } else if (err.code === 'auth/weak-password') {
        setError("Le mot de passe est trop faible (6 caractères minimum).");
      } else {
        setError(err.message || "Erreur de connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    setUnauthorizedDomain(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        setUnauthorizedDomain(currentHost);
        setError(`Ce domaine n'est pas encore autorisé pour l'authentification Google dans Firebase Console.`);
      } else if (err.code === 'auth/internal-error') {
        setError("Erreur de configuration Google OAuth. Vérifiez l'email d'assistance et les domaines autorisés dans la console Firebase.");
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || `Échec de connexion Google (${err.code})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyHostToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentHost);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0A0A0A] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/80 dark:bg-[#12151C]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] p-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8">
           <div className="mx-auto w-16 h-16 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md">
               H
             </div>
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
             {isForgotPassword 
               ? 'Réinitialiser le mot de passe' 
               : isRegisterMode 
                 ? 'Créer un compte Admin' 
                 : 'Portail Administration'}
           </h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
             Plateforme citoyenne Hafra.DZ
           </p>
        </div>

        {/* Mode Selector Tabs (only if not forgot password) */}
        {!isForgotPassword && (
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-6 border border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isRegisterMode 
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Connexion
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isRegisterMode 
                  ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Créer un compte
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-start space-x-3 text-emerald-700 dark:text-emerald-400">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Unauthorized Domain Guide Box */}
        {unauthorizedDomain && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 text-xs text-amber-900 dark:text-amber-200 space-y-3">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <span>Configuration Firebase requise pour Google Sign-In</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Pour activer la connexion Google avec ce nom de domaine, ajoutez-le dans votre console Firebase :
            </p>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-black/40 rounded-lg border border-amber-300/60 dark:border-amber-700/50 font-mono text-slate-800 dark:text-slate-200 break-all">
              <span className="flex-1 text-[11px] select-all">{currentHost}</span>
              <button
                type="button"
                onClick={copyHostToClipboard}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-sans font-medium flex items-center gap-1 shrink-0 transition"
              >
                {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedDomain ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              👉 Allez dans <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</strong> et collez l&apos;adresse ci-dessus.
            </p>
            <div className="pt-1 text-[11px] text-orange-600 dark:text-orange-400 font-medium">
              💡 Vous pouvez vous connecter immédiatement sans attendre grâce au formulaire Email / Mot de passe ci-dessous !
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
             <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5" htmlFor="email">
               Adresse Email
             </label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                   <Mail className="h-4 w-4" />
                </div>
                <input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 px-3.5 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                  placeholder="spaelfath16@gmail.com"
                />
             </div>
          </div>
          
          {!isForgotPassword && (
            <div>
               <div className="flex justify-between items-center mb-1.5">
                 <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider" htmlFor="password">
                   Mot de passe
                 </label>
                 {!isRegisterMode && (
                   <button
                     type="button"
                     onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMsg(''); }}
                     className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                   >
                     Mot de passe oublié ?
                   </button>
                 )}
               </div>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                     <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    id="password" 
                    type="password" 
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-10 px-3.5 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-sm"
                    placeholder="••••••••"
                  />
               </div>
               {isRegisterMode && (
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                   Minimum 6 caractères. Si vous utilisez <strong>spaelfath16@gmail.com</strong>, vos privilèges admin s&apos;activeront automatiquement.
                 </p>
               )}
            </div>
          )}

          <button 
             type="submit" 
             disabled={loading}
             className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
          >
             {loading 
               ? 'Chargement en cours...' 
               : isForgotPassword 
                 ? 'Envoyer le lien de réinitialisation' 
                 : isRegisterMode 
                   ? 'Créer mon compte Admin' 
                   : 'Se connecter'}
          </button>

          {isForgotPassword && (
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMsg(''); }}
              className="w-full text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour à la page de connexion
            </button>
          )}
        </form>

        {/* Google OAuth Section */}
        {!isForgotPassword && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-[#12151C] text-slate-400 uppercase tracking-wider font-medium">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition text-sm disabled:opacity-50 shadow-sm"
              >
                <svg className="h-4 w-4 mr-2.5" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853" />
                </svg>
                Connexion avec Google
              </button>
            </div>
          </div>
        )}

        {/* Back to main map app link */}
        <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-white/5 text-center">
          <a 
            href="/" 
            className="text-xs text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition inline-flex items-center gap-1"
          >
            ← Retour à la carte citoyenne
          </a>
        </div>

      </div>
    </div>
  );
}
