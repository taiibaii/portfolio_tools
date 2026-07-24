module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, details, audience, voice, styleImage } = req.body || {};

  if (!details || !details.trim()) {
    return res.status(400).json({ error: 'Missing event/business details.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing its API key. Check Vercel environment variables.' });
  }

  const promptText = `You are a scrappy, resourceful marketing assistant for people with NO budget — student clubs, small local businesses, one-person event teams. No paid ads, no agencies, no budget for anything. Just free/cheap tactics and sharp copy.

Type: ${type || 'event'}
Details: """${details}"""
Target audience: ${audience || 'general local audience'}
Voice: ${voice || 'upbeat'}

${styleImage ? `An image has also been provided purely for GENERAL style inspiration. Look only at its broad mood, color palette, and typography feeling (e.g. bold/neon, minimal/clean, warm/retro). Do NOT identify, describe in detail, or attempt to reproduce any specific design, logo, brand, or template shown in the image — only extract the general aesthetic direction and one representative accent color.` : 'No style image was provided — use the default bold style.'}

Respond ONLY with a JSON object (no markdown fences, no preamble):
{
  "captions": ["3 short social captions (Instagram/TikTok style, under 220 chars each, in the requested voice, no generic hashtag spam)"],
  "flyerHeadline": "one punchy flyer headline, under 8 words, ALL CAPS not required but should feel poster-worthy",
  "flyerBody": "2-3 sentence flyer body copy, scannable, under 50 words",
  "partnerMessage": "a short, warm outreach message (under 100 words) to ask a local business or community partner for support (cross-promotion, a small donation, or space) — specific and easy to say yes to, not generic",
  "checklist": ["4 concrete, free or near-free promo tactics specific to this event/business and audience — not generic advice like 'post on social media', but specific actions"],
  "style": "${styleImage ? 'one of exactly: bold, minimal, or retro — whichever best matches the general mood of the uploaded image' : 'bold'}",
  "accentColor": "${styleImage ? 'a representative hex color (e.g. #FF2E7A) capturing the general mood of the uploaded image' : '#FF2E7A'}"
}`;

  const userContent = [];

  if (styleImage && typeof styleImage === 'string' && styleImage.startsWith('data:')) {
    const match = styleImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
    if (match) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: match[1], data: match[2] }
      });
    }
  }

  userContent.push({ type: 'text', text: promptText });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Anthropic API error (${response.status}): ${errText}` });
    }

    const data = await response.json();
    const text = data.content.map((b) => b.text || '').join('\n');
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
