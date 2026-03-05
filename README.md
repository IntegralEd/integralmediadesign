# Integral Themes Playground

A demonstration site for rapid prototyping and testing the [integralthemes](https://github.com/IntegralEd/integralthemes) shared design system.

## 🔗 Live Demo

**https://integralthemesplayground.netlify.app/**

This playground site is deployed on Netlify for rapid iteration and stakeholder review.

## What This Is

This repository serves as a **live playground** for:
- Testing updates to the shared integralthemes design system
- Previewing theme components in a real deployment context
- Rapid prototyping before cascading changes to production microsites
- Demonstrating the Integral Ed visual identity and component library

**Current Theme:** Branded as "Integral Media" - a fictional full-service media and communications agency for nonprofits and education organizations.

## Future Plans

Once styles and content are finalized, this repository may be published as a production media microsite. For now, it remains a staging/demo environment with:
- `noindex, nofollow` meta tags on all pages
- `robots.txt` set to disallow all crawlers

## Architecture

This playground **vendors** the shared theme repository:

```
integralthemesplayground/
├── vendor/
│   └── integralthemes/          ← Vendored via git subtree
│       ├── theme/
│       │   ├── theme.css        ← Main shared theme
│       │   ├── tokens.css
│       │   ├── base.css
│       │   ├── layout.css
│       │   └── components.css
│       └── assets/
│           ├── brand/           ← Shared favicons, logo
│           └── icons/           ← UI icons
├── src/
│   ├── *.html                   ← Page content
│   └── css/
│       └── site.css             ← Site-specific overrides
└── dist/                        ← Published to Netlify
```

### How the Theme is Vendored

The shared theme is included via **git subtree**:

```bash
# Theme was added with:
git subtree add --prefix vendor/integralthemes \
  git@github.com:IntegralEd/integralthemes.git main --squash

# To pull theme updates:
git subtree pull --prefix vendor/integralthemes \
  git@github.com:IntegralEd/integralthemes.git main --squash
```

## Development

### Prerequisites

- Node.js (for build script)

### Local Development

**Build the site:**
```bash
node build.js
```

This will:
1. Clear `dist/` directory
2. Copy `src/` content → `dist/`
3. Copy `vendor/integralthemes/` → `dist/vendor/integralthemes/`
4. Output a ready-to-deploy `dist/` folder

**Preview locally:**
```bash
# Use any static server, e.g.:
npx serve dist
# or
python3 -m http.server --directory dist 8000
```

### CSS Import Structure

Pages import CSS in this order:

```html
<!-- 1. Shared theme from vendored integralthemes -->
<link rel="stylesheet" href="/vendor/integralthemes/theme/theme.css">

<!-- 2. Site-specific overrides -->
<link rel="stylesheet" href="css/site.css">
```

Override theme tokens in `src/css/site.css`:
```css
:root {
  /* Example: override primary color */
  /* --primary: #8b0a9e; */
}
```

## Deployment

### Netlify Configuration

**Build command:** `node build.js`
**Publish directory:** `dist`

Netlify automatically rebuilds on push to `main` branch.

### Staging Safety

This playground has search engine protection:
- `<meta name="robots" content="noindex,nofollow">` on all pages
- `robots.txt` set to `Disallow: /`

### Favicons

Favicons are automatically copied from the vendored theme to the root directory during build for proper browser discovery:
- `/favicon.ico` - Legacy browser support
- `/favicon-32x32.png` - Modern browsers
- `/favicon-16x16.png` - Fallback size
- `/apple-touch-icon.png` - iOS devices

Source files remain in `/vendor/integralthemes/assets/brand/` for theme reference.

## Component Showcase

The playground demonstrates all shared theme components:

- ✅ Navigation (responsive mobile menu)
- ✅ Hero sections
- ✅ Button styles (primary, secondary)
- ✅ Card grids (service-cards, process-cards)
- ✅ Lists with custom bullets
- ✅ Forms (working demo request form)
- ✅ Footer
- ✅ Image placeholders
- ✅ Responsive layouts

## Pages

- **Home** (`/`) - Services overview, case studies, process
- **What We Do** (`/approach.html`) - Detailed service descriptions
- **Case Studies** (`/case-studies.html`) - Three example case studies
- **Request a Demo** (`/request-demo.html`) - Working form with Web3Forms

## Relationship to Other Repos

- **[integralthemes](https://github.com/IntegralEd/integralthemes)** - Shared design system (vendored here)
- **Production microsites** (future) - Will vendor integralthemes the same way

## Support

For questions about this playground or the shared theme system:
- **Organization:** [Integral Ed Services, LLC](https://www.integral-ed.com)
- **Email:** info@integral-ed.com

## License

© 2026 Integral Ed Services, LLC. All rights reserved.
