const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL;

const resend = new Resend(RESEND_API_KEY);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  if (!RESEND_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
    console.error('Variables d\'environnement manquantes (RESEND_API_KEY / TO_EMAIL / FROM_EMAIL)');
    res.status(500).json({ error: 'Configuration serveur incomplète' });
    return;
  }

  try {
    const { warmupAnswers, q1Answers, path, food, music, invitationAnswer, message } = req.body;

    if (!Array.isArray(q1Answers)) {
      res.status(400).json({ error: 'Réponses manquantes' });
      return;
    }

    const warmupHtml = Array.isArray(warmupAnswers)
      ? warmupAnswers.map(a => `<li>${escapeHtml(a.question)} — ${escapeHtml(a.answer)}</li>`).join('')
      : '';
    const q1Html = q1Answers.map(a => `<li>${escapeHtml(a)}</li>`).join('');

    const html = `
      <h2>Nouvelles réponses au quiz</h2>
      ${warmupHtml ? `<p><strong>Warm-up :</strong></p><ul>${warmupHtml}</ul>` : ''}
      <p><strong>Parcours :</strong> ${path === 'fin' ? 'Arrêt rapide (fin)' : 'Parcours complet'}</p>
      <p><strong>Réponses à "j'ai liké tes stories" :</strong></p>
      <ul>${q1Html}</ul>
      ${food ? `<p><strong>Plat :</strong> ${escapeHtml(food)}</p>` : ''}
      ${music ? `<p><strong>Musique :</strong> ${escapeHtml(music)}</p>` : ''}
      ${invitationAnswer ? `<p><strong>Réponse à l'invitation :</strong> ${escapeHtml(invitationAnswer)}</p>` : ''}
      ${message ? `<p><strong>Message laissé :</strong><br>${escapeHtml(message)}</p>` : '<p><em>Aucun message laissé.</em></p>'}
    `;

    const sendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Nouvelles réponses au quiz du site',
      html
    });

    if (sendResult.error) {
      console.error('Erreur Resend:', sendResult.error);
      res.status(500).json({ error: sendResult.error.message || 'Échec de l\'envoi côté Resend' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    res.status(500).json({ error: err.message || 'Échec de l\'envoi' });
  }
};
