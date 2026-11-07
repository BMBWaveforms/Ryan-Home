# About content sources

## 2026-11-05 — resume v1.2 and portrait

Source supplied by the user: https://my.feishu.cn/wiki/UX04wFyzMi8Y87kKsspcp4k0nMc . Read the personal-strengths and work-experience sections through Feishu; document revision 25 at the time of reading. No private contact details are copied into the site.

- `src/data/ryan-content.json`: headline and three introductory paragraphs summarize user insight / prioritization, AI product delivery with Agent, Prompt, context, RAG and evaluation, and design / frontend prototyping. They replace the broader statement of AI interests.
- NovaMind experience now identifies CFB's sales-training project, its three training modes and the initial-version handoff to the customer's team. The pharmaceutical solution's Agent foundation / scenario packages and delivery evaluation are summarized without new outcome metrics.
- Viatris experience reflects the resume's ownership of evaluation, data preparation and modular Prompts. The Nezha role includes UI responsibility. Dates remain those supplied in the resume.
- `about/index.html` retains the same headline and introductory paragraphs as the JSON fallback; its metadata describes the same positioning.
- Portrait: user-supplied `/Users/bmb/Downloads/沉静的黑白男士肖像.png`, encoded as `public/ryan/ryan-portrait.jpg` (1254 × 1254). No retouch, generated content or crop. CSS preserves the square image at desktop and phone sizes.

Existing Work slogan, article links, project content and navigation are outside this copy update. This version is a local preview; no Git push is part of the request.

Validation: syntax checks, production build and `git diff --check` passed. Desktop and phone renders were inspected; the final heading geometry was checked at 320 / 390 / 768 / 1024 / 1440 / 1920px. Each headline span stays on one line, the page has no horizontal overflow, the square portrait loads at its original dimensions, and no runtime errors were recorded. The mechanical design scan reports existing small secondary labels, section numbering and contrast / spacing advisories in the retained About design; these were not introduced by the portrait or copy update.
