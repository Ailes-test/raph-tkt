# Déploiement sur Vercel

## Structure

- `index.html`, `quiz.html`, `style.css`, `landing.js`, `quiz.js` → servis tels quels par Vercel (fichiers statiques à la racine).
- `api/send-email.js` → fonction serverless qui envoie le mail via Resend, accessible à `/api/send-email` (le `fetch('/api/send-email')` dans `quiz.js` n'a rien à changer).

## Étapes

### 1. Remplacer le contenu de ton repo GitHub

Dans ton repo local :

```bash
# à la racine de ton repo
rm -rf public server        # on n'en a plus besoin avec cette structure
```

Puis copie dedans les fichiers de ce dossier (`index.html`, `quiz.html`, `style.css`,
`landing.js`, `quiz.js`, `api/`, `package.json`).

```bash
git add .
git commit -m "Restructuration pour déploiement Vercel"
git push
```

### 2. Connecter le repo sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Sélectionne ton repo GitHub
3. Framework Preset : **Other** (aucun build nécessaire, c'est du HTML/JS statique + fonctions serverless)
4. Build command / Output directory : laisse vide, ne touche à rien

### 3. Ajouter les variables d'environnement

Dans Vercel : **Project → Settings → Environment Variables**, ajoute :

| Nom | Valeur |
|---|---|
| `RESEND_API_KEY` | ta clé API Resend |
| `TO_EMAIL` | l'adresse qui doit recevoir les réponses (la tienne) |
| `FROM_EMAIL` | adresse expéditrice — `onboarding@resend.dev` en test, ou une adresse sur un domaine que tu as vérifié dans Resend |

Coche les trois environnements (Production, Preview, Development) pour chaque variable.

### 4. Déployer

Clique sur **Deploy**. Vercel build et te donne une URL du type `ton-projet.vercel.app`.

À chaque `git push` sur la branche principale, Vercel redéploie automatiquement.

### 5. Tester

Une fois en ligne, va au bout du quiz sur l'URL et vérifie que le mail arrive bien dans ta boîte.
Si ça échoue, va dans **Vercel → ton projet → Deployments → (dernier déploiement) → Functions**
pour voir les logs de `api/send-email` et l'erreur exacte (souvent une variable d'environnement
mal orthographiée ou une adresse `FROM_EMAIL` non vérifiée sur Resend).

## Domaine personnalisé (optionnel)

Si tu veux un lien plus propre à envoyer, **Project → Settings → Domains** te permet
d'ajouter un domaine que tu possèdes, ou de renommer le sous-domaine `.vercel.app`.
