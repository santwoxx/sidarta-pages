export const sidartaSkills = {
  'premium-site': {
    id: 'premium-site',
    name: 'Site Premium Completo',
    desc: 'Um site corporativo impressionante com dark mode.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    bg: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
    systemPrompt: `Você é um Engenheiro de Front-end Sênior. Crie um site corporativo premium completo.
Regras: Use HTML único, CSS na tag <style>. Design impecável, dark mode suave, animações CSS. NADA de JS externo.`
  },
  'saas-landing': {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    desc: 'Landing page focada em conversão para startups.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    systemPrompt: `Você é especialista em Landing Pages para SaaS.
Foco em conversão, hero section impactante, tabela de preços glassmorphism, depoimentos.
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'portfolio-3d': {
    id: 'portfolio-3d',
    name: 'Portfólio Criativo',
    desc: 'Mostre seu trabalho de forma elegante e artística.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    bg: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
    systemPrompt: `Crie um Portfólio web criativo focado em design impressionante.
Inclua efeitos CSS de perspectiva (transform: perspective), animações fluidas e design clean.
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce Premium',
    desc: 'Design vibrante e focado em vendas rápidas.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    bg: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
    systemPrompt: `Você é um Mestre em UX de E-commerce.
Crie a página inicial de uma loja online vibrante. Vitrine de produtos em grid, botões de 'Comprar' chamativos, barra lateral de carrinho.
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'agency': {
    id: 'agency',
    name: 'Site de Agência',
    desc: 'Estética bold, tipografia gigante e design marcante.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 2 22 12 17 22 22 12 2"/></svg>',
    bg: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    systemPrompt: `Crie um site para Agência de Marketing/Design.
Estética bold, tipografia gigante, seções assimétricas e portfolio integrado.
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard Moderno',
    desc: 'Painel administrativo com mockups de gráficos e dados.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    systemPrompt: `Crie a interface de um Dashboard Web Moderno (Admin Panel).
Barra lateral escura, área principal clara, cartões de estatísticas com sombras suaves (neumorphism) e mockups de gráficos via CSS.
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'blog-premium': {
    id: 'blog-premium',
    name: 'Blog / Linktree',
    desc: 'Centralize artigos ou links num design premium.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    bg: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    systemPrompt: `Crie o layout de um Blog Premium focado em legibilidade.
Layout em coluna central para os artigos, cards modernos para posts relacionados, modo leitura agradável (fonte Serif ou Sans-serif clean).
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'ai-saas': {
    id: 'ai-saas',
    name: 'SaaS de IA',
    desc: 'Estética futurista (roxo escuro) e neon brilhante.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12V2a10 10 0 0 1 10 10H12z"/></svg>',
    bg: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    systemPrompt: `Crie um site para um produto de Inteligência Artificial.
Estética futurista (roxo escuro/preto), grid de features, efeitos brilhantes de neon nos botões, fundo com padrão de pontos (dot pattern CSS).
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'glassmorphism': {
    id: 'glassmorphism',
    name: 'Efeito Glassmorphism',
    desc: 'Vidro fosco em todo o layout.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
    bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    systemPrompt: `Crie um site utilizando EXCLUSIVAMENTE o efeito Glassmorphism (vidro fosco).
Fundo colorido/gradiente vibrante, cards com background: rgba(255,255,255,0.1) e backdrop-filter: blur(10px).
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'neon-effects': {
    id: 'neon-effects',
    name: 'Efeitos Cyberpunk Neon',
    desc: 'Fundo preto e sombras super brilhantes.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    bg: 'linear-gradient(135deg, #111 0%, #333 100%)',
    systemPrompt: `Crie um site focado em Efeitos Cyberpunk / Neon.
Fundo preto absoluto. Textos e bordas com box-shadow e text-shadow brilhantes simulando luz neon (rosa, ciano, verde).
Regras: HTML único, CSS embutido. Sem JS externo.`
  },
  'fluid-cursor': {
    id: 'fluid-cursor',
    name: 'Fluid Cursor',
    desc: 'Rastro de cursor animado simulando movimento fluido com GPU.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>',
    bg: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
    systemPrompt: `Crie um site criativo com um "Fluid Cursor" interativo no background.
Utilize Canvas API e JavaScript no próprio HTML (WebGL ou 2D context) para criar um rastro fluido e colorido que segue o cursor do mouse e simula física de fluidos, inspirando-se em bibliotecas modernas de cursor fluido.
Regras: HTML único, CSS embutido. O script do cursor DEVE vir embutido na tag <script> e rodar sem dependências externas (Vanilla JS).`
  },
  'linkflow-hero': {
    id: 'linkflow-hero',
    name: 'AI Workflow Hero',
    desc: 'SaaS Hero section com Boomerang Video, React e Tailwind.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    bg: 'linear-gradient(135deg, #336443 0%, #85AB8B 100%)',
    systemPrompt: `### Stack
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS 3.4**
- **lucide-react** for icons (\`LogIn\`, \`UserPlus\`, \`Play\`, \`Sparkles\`, \`Menu\`, \`X\`)
- No Framer Motion -- all animations are CSS \`transition-*\` classes

### Fonts (loaded in \`index.html\`)
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://db.onlinewebfonts.com/c/6e47ef470dd19698c911332a9b4d1cf4?family=Neue+Haas+Grotesk+Text+Pro" rel="stylesheet" />
<link href="https://db.onlinewebfonts.com/c/dec0d9b4e22ca588dc20e1e2e09a59b5?family=Neue+Haas+Grotesk+Display+Pro+55+Roman" rel="stylesheet" />

Body/root font stack (in \`index.css\`):
html, body, #root { height: 100%; margin: 0; font-family: 'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }

### Video URL (CloudFront)
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4

### Color Palette
| Token | Hex |
|-------|-----|
| Dark green (text, buttons) | #1f2a1d |
| Medium dark green | #2d3a2a |
| Button hover | #2a3827 |
| Body text green | #4b5b47 |
| Heading primary | #336443 |
| Heading accent | #85AB8B |
| Bottom-left text | #3d5638 |
| Bottom-left button bg | #3d5638, hover #2d4228 |

### Architecture
Two files:
1. **\`BoomerangVideoBg.tsx\`** -- captures video frames into canvas, then plays them forward/backward in a seamless boomerang loop at 30fps (960px max capture width).
2. **\`App.tsx\`** -- the full hero section.

[Implement BoomerangVideoBg.tsx and App.tsx exactly as requested by the user, adhering strictly to the specs and styling.]`
  },
  'aetheris-voyage': {
    id: 'aetheris-voyage',
    name: 'Aetheris Voyage',
    desc: 'Cinematic Space-Travel Landing Page com liquid-glass UI.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    bg: 'linear-gradient(135deg, #111111 0%, #444444 100%)',
    systemPrompt: `Cinematic Space-Travel Landing Page
Build a single-page landing site with two full-height sections (Hero + Capabilities), both using looping background videos with custom JS crossfade, a shared liquid-glass design system, and Framer Motion entrance animations.
Tech stack (pinned, CDN-only): React 18, Babel, Framer Motion, Tailwind.
Fonts: Instrument Serif (heading), Barlow (body).
Liquid glass CSS utilities.
FadingVideo component custom JS crossfade (opacity based on requestAnimationFrame, FADE_MS=500).
Hero Section video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4
Capabilities Section video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4
[Implement exactly as specified by the user with exact markup and animations]`
  },
  'tinytrails-404': {
    id: 'tinytrails-404',
    name: 'Fun 404 Page',
    desc: 'Animated 404 error page for children brand.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    bg: 'linear-gradient(135deg, #FF8233 0%, #FDAC55 100%)',
    systemPrompt: `Build a full-screen animated 404 error page for a children's brand called "TinyTrails" using React, Tailwind CSS, and Lucide React icons. The page must be a single \`App.tsx\` component. Use the Inter font (weights 400–900) loaded from Google Fonts. The page is a single viewport-height screen with no scrolling.

BACKGROUND "404" TEXT EFFECT: Scale dynamically using transform: scale(1.15, \${scaleY * 1.4}). Oval mask overlay.
NAVIGATION BAR: Logo, Desktop nav links, Menu button.
MOBILE MENU OVERLAY: Slide in from right. Staggered animations.
CENTER VIDEO: w-[120vw] h-[85vh] mix-blend-darken autoPlay loop muted. URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_234424_b1332b69-2e69-4302-8dbc-40f86846afbd.mp4
[Implement exactly as requested by the user.]`
  },
  'tech-forward-hero': {
    id: 'tech-forward-hero',
    name: 'Tech-Forward Hero',
    desc: 'Minimal black-and-white hero com React e Framer Motion.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    bg: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    systemPrompt: `Create a full-screen hero section landing page using React, Vite, and Framer Motion (\`motion\` package). Use plain CSS (no Tailwind). The font is Inter (weights 300, 400, 500, 600) from Google Fonts. The design is minimal black-and-white with a full-viewport background video.

**Stack:** React 19, Vite, \`motion\` (framer-motion), \`lucide-react\` (for the Plus icon).

**Layout:**
- Full viewport height (\`min-height: 100vh\`), white background, flex column with \`justify-content: space-between\`
- Fixed navbar at top (z-index 50, pointer-events none on the nav itself, auto on children)
- Absolutely positioned full-screen video behind everything (z-index 0)
- Footer content pinned to bottom (z-index 30) with a white gradient fade-up background

**Navbar (fixed, top):**
- Left side contains:
  1. Logo: custom SVG icon (two rotated rounded rectangles at -35deg, black fill) + brand text "NeuralKinetics" (hidden on mobile, shown on desktop 768px+)
  2. Menu button: black pill with white circle containing a Plus icon (lucide, size 12, strokeWidth 3) + "Menu" text (11px, white)
  3. Tags pill: light gray (#F4F4F6) rounded-full container with two text labels "Advanced Bionics" and "Cognitive AI" (hidden on mobile, shown on desktop)
- Right side contains:
  - A light gray pill with a black circle button (containing a 4-dot grid SVG icon) + label "Adaptive Systems" (hidden on mobile)

**Background Video:**
- URL: \`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4\`
- autoPlay, muted, playsInline, object-fit: cover
- On mobile: video wrapper is 80% width and 80% height (centered)
- On desktop (768px+): video wrapper is 100% width and 100% height

**Footer content (bottom, over gradient):**
- Background: \`linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.8) 50%, transparent 100%)\`
- On mobile: stacks vertically. On desktop: row layout, items aligned to bottom.
- Left block:
  1. Subtitle line: small black dot (8px circle) + "Best digital banking card 2026" (13px, 55% opacity black)
  2. Heading: "One Card, Zero / Limits. Worldwide." on two lines. Font-weight 300, clamp(2rem, 8vw, 4.5rem) on mobile, clamp(2.5rem, 5.5vw, 4.5rem) on desktop, letter-spacing -0.03em, line-height 1
  3. Two buttons: "See Features" (black pill, white text, 13px) and "How It Works" (transparent with dark border rgba(0,0,0,0.35), 13px)
- Right block: Three tag pills "Neuromorphic", "AGI", "Cybernetics" (white bg, light border rgba(0,0,0,0.12), 11px, rounded-full)

**Animations (using \`motion\` from 'motion/react'):**
- Navbar: slides down from y:-16, opacity 0 to visible. Duration 0.8s, ease [0.16, 1, 0.3, 1]
- Video: fades in from opacity 0 + scale 1.05 to opacity 1 + scale 1. Duration 1.8s
- Footer wrapper: slides up from y:20, delay 0.5s, duration 1s
- Subtitle: slides up from y:16, delay 0.6s, duration 0.8s
- Heading: slides up from y:20, delay 0.8s, duration 0.8s
- Buttons: slides up from y:16, delay 1.0s, duration 0.8s
- All use ease: [0.16, 1, 0.3, 1]

**Responsive (mobile-first, breakpoint at 768px):**
- Mobile: navbar padding 16px, smaller buttons (28px circles), brand text hidden, tags hidden, right label hidden, footer stacks vertically, video at 80% size
- Desktop (768px+): navbar padding 24px 32px, larger buttons (32px circles), all text/tags visible, footer is row layout, video fills 100%`
  },
  'vision-reveal': {
    id: 'vision-reveal',
    name: 'Vision Reveal',
    desc: 'Spotlight Canvas Animation com Vanilla JS.',
    icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    bg: 'linear-gradient(135deg, #75C5DE 0%, #E4E4E4 100%)',
    systemPrompt: `Output EXACTLY this HTML code without any markdown formatting:
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Creative Studio Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
* { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }

html, body {
  margin: 0; padding: 0;
  background: #E4E4E4;
  color: #F4F1E8;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* ===== SPLASH ===== */
.splash {
  position: fixed; inset: 0;
  width: 100vw; height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  animation: splashHide 0.3s ease forwards;
  animation-delay: 1.35s;
}
.splash-row { display: flex; width: 100%; height: 50%; }
.splash-box { width: 20%; height: 100%; background: #75C5DE; }
.splash-row-top .splash-box { animation: splashTop 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
.splash-row-bottom .splash-box { animation: splashBottom 1s cubic-bezier(0.96,-0.02,0.38,1.01) forwards; }
.splash-box:nth-child(1) { animation-delay: 0s; }
.splash-box:nth-child(2) { animation-delay: 0.05s; }
.splash-box:nth-child(3) { animation-delay: 0.1s; }
.splash-box:nth-child(4) { animation-delay: 0.15s; }
.splash-box:nth-child(5) { animation-delay: 0.2s; }

@keyframes splashTop { from { transform: translateY(0%); } to { transform: translateY(-100%); } }
@keyframes splashBottom { from { transform: translateY(0%); } to { transform: translateY(100%); } }
@keyframes splashHide { to { opacity: 0; visibility: hidden; } }

/* ===== HERO IMAGE ENTRANCE ===== */
@keyframes heroImageIn {
  from { opacity: 0; transform: scale(1.5) rotate(3deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}
.hero-image-animate {
  animation: heroImageIn 1.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
  animation-delay: 1s;
  opacity: 0;
}

/* ===== WORD REVEAL ===== */
@keyframes wordReveal {
  from { opacity: 0; transform: translateY(10px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.word-reveal {
  opacity: 0;
  display: inline-block;
  margin-right: 0.3em;
  animation: wordReveal 0.4s ease forwards;
}

/* ===== CTA ENTRANCE ===== */
@keyframes slideUpScale {
  from { opacity: 0; transform: translateY(60px) scale(0.4); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cta-animate {
  opacity: 0;
  animation: slideUpScale 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
  animation-delay: 1s;
}

/* ===== CTA BUTTON ===== */
.cta-btn { position: relative; overflow: hidden; display: flex; align-items: center; border: none; background: none; cursor: pointer; border-radius: 9999px; padding: 8px; gap: 12px; }
.cta-btn-bg {
  position: absolute; top: 5px; bottom: 5px; left: 8px;
  width: calc(100% - 8px - 8px - 48px - 12px);
  border-radius: 9999px; background: white; z-index: 0;
  transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
@media (min-width: 768px) { .cta-btn-bg { width: calc(100% - 8px - 8px - 54px - 12px); } }
.cta-btn:hover .cta-btn-bg { width: calc(100% - 16px); }
.cta-btn-text { position: relative; z-index: 1; color: #111111; font-weight: 500; font-size: 16px; padding: 12px 32px; white-space: nowrap; }
@media (min-width: 768px) { .cta-btn-text { font-size: 18px; padding: 16px 40px; } }
.cta-btn-circle {
  position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
  width: 48px; height: 48px; border-radius: 50%; background: #75C5DE; flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
@media (min-width: 768px) { .cta-btn-circle { width: 54px; height: 54px; } }
.cta-btn:hover .cta-btn-circle { transform: translateX(-7px); }

/* ===== MENU CTA (smaller) ===== */
.menu-cta-btn { position: relative; overflow: hidden; display: flex; align-items: center; border: none; background: none; cursor: pointer; border-radius: 9999px; padding: 6px; gap: 8px; }
.menu-cta-bg {
  position: absolute; top: 5px; bottom: 5px; left: 8px;
  width: calc(100% - 8px - 8px - 38px - 8px);
  border-radius: 9999px; background: white; z-index: 0;
  transition: width 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
}
.menu-cta-btn:hover .menu-cta-bg { width: calc(100% - 12px); }
.menu-cta-text { position: relative; z-index: 1; color: #111111; font-weight: 500; font-size: 14px; padding: 8px 40px; white-space: nowrap; }
.menu-cta-circle {
  position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 50%; background: #75C5DE; flex-shrink: 0;
  transition: transform 0.3s ease;
}
.menu-cta-btn:hover .menu-cta-circle { transform: translateX(-4px); }

/* ===== CREATOR TEXT ===== */
@keyframes creatorSlideUp { from { transform: translateY(330px); } to { transform: translateY(0); } }
.creator-text-animate {
  transform: translateY(330px);
  animation: creatorSlideUp 1s cubic-bezier(0.16,1,0.3,1) forwards;
  animation-delay: 1.5s;
}

/* ===== NAVIGATION ===== */
.logo-wrapper {
  position: fixed; top: 30px; left: 0; width: 50%; z-index: 10;
  display: flex; justify-content: flex-start; align-items: center; mix-blend-mode: difference;
}
@media (min-width: 768px) { .logo-wrapper { top: 40px; } }
.logo-wrapper .inner { padding-left: 20px; }
@media (min-width: 768px) { .logo-wrapper .inner { padding-left: 40px; } }
.logo-wrapper img { width: 32px; height: 32px; }

.burger-wrapper {
  position: fixed; top: 16px; right: 0; width: 50%; z-index: 10;
  display: flex; justify-content: flex-end; align-items: center;
}
@media (min-width: 768px) { .burger-wrapper { top: 27px; } }
.burger-wrapper .inner { padding-right: 20px; }
@media (min-width: 768px) { .burger-wrapper .inner { padding-right: 40px; } }

.burger-btn {
  width: 59px; height: 59px; border-radius: 50%; border: none; cursor: pointer;
  display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center;
  background: #F4F1E8; transition: background 0.4s ease;
}
.burger-btn:hover { background: #0B0B0B; }
.burger-btn .bar {
  display: block; width: 24px; height: 2px; background: #111111;
  transition: all 0.3s ease;
}
.burger-btn:hover .bar { background: #F4F1E8; }
.burger-btn.open { background: #0B0B0B; }
.burger-btn.open .bar { background: #F4F1E8; }
.burger-btn.open .bar:first-child { transform: rotate(45deg) translate(2px, 2px); }
.burger-btn.open .bar:last-child { transform: rotate(-45deg) translate(2px, -2px); }

/* ===== MENU PANEL ===== */
.menu-panel {
  position: fixed; z-index: 9;
  left: 8px; right: 8px;
  border-radius: 20px;
  background: rgba(17,17,17,0.95);
  backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
  padding: 90px 32px 32px 32px;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: top 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease;
  top: -600px; opacity: 0; pointer-events: none;
}
@media (min-width: 768px) {
  .menu-panel { left: auto; right: 7px; width: 420px; padding: 60px; }
}
.menu-panel.open { top: 0; opacity: 1; pointer-events: auto; }
@media (min-width: 768px) { .menu-panel.open { top: 7px; } }

.menu-panel nav { display: flex; flex-direction: column; gap: 8px; }
.menu-panel nav a {
  color: #F4F1E8; font-size: 36px; font-weight: 500; text-decoration: none;
  line-height: 130%; transition: opacity 0.3s ease;
}
@media (min-width: 768px) { .menu-panel nav a { font-size: 42px; } }
.menu-panel nav a:hover { opacity: 0.7; }

.menu-contact { display: flex; flex-direction: column; gap: 20px; margin-top: 32px; }
.menu-email { color: #9A9590; font-size: 18px; text-decoration: none; transition: color 0.3s ease; }
@media (min-width: 768px) { .menu-email { font-size: 20px; } }
.menu-email:hover { color: #F4F1E8; }
.menu-socials { display: flex; gap: 24px; }
.menu-socials a {
  color: #9A9590; font-size: 14px; text-decoration: underline;
  text-underline-offset: 2px; transition: color 0.3s ease;
}
.menu-socials a:hover { color: #F4F1E8; }

/* ===== HERO ===== */
.hero {
  position: relative; width: 100%; overflow: hidden;
  background: #E4E4E4; min-height: 100vh;
}
@media (min-width: 768px) { .hero { height: 100vh; min-height: 800px; } }

.hero-big-text {
  position: absolute; bottom: -30px; left: 0; right: 0; z-index: 2;
  pointer-events: none; width: 100%; text-align: center;
}
@media (min-width: 768px) { .hero-big-text { bottom: -40px; } }
.hero-big-text h2 {
  font-weight: 500; color: #F4F1E8; line-height: 80%;
  letter-spacing: -0.04em; white-space: nowrap;
  font-size: clamp(180px, 28vw, 560px);
}

.hero-base-img {
  position: absolute; top: 30vh; left: 0; right: 0; bottom: 0;
  background-size: cover; background-repeat: no-repeat;
  background-position: 60% center; z-index: 5;
}
@media (min-width: 768px) { .hero-base-img { top: 0; background-position: center; } }

.hero-reveal-img {
  position: absolute; top: 30vh; left: 0; right: 0; bottom: 0;
  background-size: cover; background-repeat: no-repeat;
  background-position: 60% center; z-index: 7; pointer-events: none;
}
@media (min-width: 768px) { .hero-reveal-img { top: 0; background-position: center; } }

.hero-content {
  position: relative; z-index: 8;
  display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;
  width: 100%; max-width: 1600px; margin: 0 auto;
  padding: 110px 16px 24px 16px; pointer-events: none;
}
@media (min-width: 768px) {
  .hero-content {
    position: absolute; inset: 0;
    justify-content: space-between;
    padding: 160px 40px 100px 40px;
  }
}
.hero-content-inner { display: flex; flex-direction: column; align-items: flex-start; gap: 30px; width: 100%; pointer-events: auto; }

.hero-headline {
  font-size: 22px; font-weight: 500; line-height: 120%;
  letter-spacing: -0.02em; color: #111111; max-width: 447px;
}
@media (min-width: 768px) { .hero-headline { font-size: 28px; } }

/* ===== CANVAS (hidden) ===== */
#reveal-canvas { display: none; position: absolute; inset: 0; pointer-events: none; }

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .splash { animation: splashHide 0.01s linear forwards; }
  .splash-box { animation: none !important; }
  .hero-image-animate, .word-reveal, .cta-animate, .creator-text-animate {
    animation: none !important; opacity: 1 !important;
    transform: none !important; filter: none !important; visibility: visible !important;
  }
}
</style>
</head>
<body>

<!-- SPLASH -->
<div class="splash" id="splash">
  <div class="splash-row splash-row-top">
    <div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div>
  </div>
  <div class="splash-row splash-row-bottom">
    <div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div><div class="splash-box"></div>
  </div>
</div>

<!-- LOGO -->
<div class="logo-wrapper">
  <div class="inner">
    <a href="/" aria-label="Home">
      <img src="https://framerusercontent.com/images/VMcS7YYTM5PXfXvlHc9u3hSCMM.svg" alt=""/>
    </a>
  </div>
</div>

<!-- BURGER -->
<div class="burger-wrapper">
  <div class="inner">
    <button class="burger-btn" id="burger-btn" aria-label="Open menu">
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </div>
</div>

<!-- MENU PANEL -->
<div class="menu-panel" id="menu-panel">
  <nav>
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#blog">Blog</a>
  </nav>
  <div class="menu-contact">
    <a href="mailto:studio@norakessler.com" class="menu-email">studio@norakessler.com</a>
    <div class="menu-socials">
      <a href="#">Pinterest</a>
      <a href="#">Behance</a>
      <a href="#">Letterboxd</a>
    </div>
  </div>
  <div style="margin-top:32px;">
    <button class="menu-cta-btn">
      <span class="menu-cta-bg"></span>
      <span class="menu-cta-text">Let's talk</span>
      <span class="menu-cta-circle">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </div>
</div>

<!-- HERO -->
<main class="hero">
  <!-- Big text behind image -->
  <div class="hero-big-text creator-text-animate">
    <h2>Visuals</h2>
  </div>

  <!-- Base image -->
  <div class="hero-base-img hero-image-animate"
       style="background-image:url('https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560');">
  </div>

  <!-- Reveal layer -->
  <canvas id="reveal-canvas"></canvas>
  <div class="hero-reveal-img" id="reveal-img"
       style="background-image:url('https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536');">
  </div>

  <!-- Content -->
  <div class="hero-content">
    <div class="hero-content-inner">
      <h1 class="hero-headline" id="headline"></h1>
      <button class="cta-btn cta-animate">
        <span class="cta-btn-bg"></span>
        <span class="cta-btn-text">Start a project now</span>
        <span class="cta-btn-circle">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L13 5M13 5H6M13 5V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  </div>
</main>

<script>
(function() {
  // Word reveal
  const headline = document.getElementById('headline');
  const text = "I build compelling visual stories & motion that make ideas shine.";
  const words = text.split(' ');
  words.forEach(function(word, i) {
    const span = document.createElement('span');
    span.className = 'word-reveal';
    span.textContent = word;
    span.style.animationDelay = (1 + i * 0.05) + 's';
    headline.appendChild(span);
  });

  // Burger menu toggle
  const burgerBtn = document.getElementById('burger-btn');
  const menuPanel = document.getElementById('menu-panel');
  let menuOpen = false;
  burgerBtn.addEventListener('click', function() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      burgerBtn.classList.add('open');
      menuPanel.classList.add('open');
      burgerBtn.setAttribute('aria-label', 'Close menu');
    } else {
      burgerBtn.classList.remove('open');
      menuPanel.classList.remove('open');
      burgerBtn.setAttribute('aria-label', 'Open menu');
    }
  });
  // Close menu on nav link click
  menuPanel.querySelectorAll('nav a').forEach(function(a) {
    a.addEventListener('click', function() {
      menuOpen = false;
      burgerBtn.classList.remove('open');
      menuPanel.classList.remove('open');
    });
  });

  // Spotlight reveal
  const SPOTLIGHT_R = 260;
  const canvas = document.getElementById('reveal-canvas');
  const imgLayer = document.getElementById('reveal-img');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const mouse = { x: -999, y: -999 };
  const smooth = { x: -999, y: -999 };

  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function loop() {
    smooth.x += (mouse.x - smooth.x) * 0.1;
    smooth.y += (mouse.y - smooth.y) * 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var grad = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, SPOTLIGHT_R);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,1)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    var dataUrl = canvas.toDataURL();
    imgLayer.style.webkitMaskImage = 'url(' + dataUrl + ')';
    imgLayer.style.maskImage = 'url(' + dataUrl + ')';
    imgLayer.style.webkitMaskSize = '100% 100%';
    imgLayer.style.maskSize = '100% 100%';

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
</script>
</body>
</html>`
  }
};

export function getSkillPrompt(skillId) {
  const skill = sidartaSkills[skillId];
  if (skill) return skill.systemPrompt;
  return 'Você é um Engenheiro de Front-end Sênior. Crie o site em HTML e CSS embutido.';
}
