# DeFlow Labs — Sanity Studio

> Content management system for the DeFlow Labs marketing website. Built on [Sanity v5](https://www.sanity.io/) with a custom desk structure, typed schemas, and a GROQ Vision plugin for data exploration.

[![Sanity](https://img.shields.io/badge/Sanity-v5-F03E2F?logo=sanity&logoColor=white)](https://www.sanity.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Overview

This studio provides a visual editing interface for all content that powers [deflowlabs.io](https://deflowlabs.io). It is deployed independently and accessed by the editorial team to manage blog posts, author profiles, labs projects, and more.

## Content Schemas

| Schema | Description |
|:-------|:------------|
| `post` | Blog articles with rich text, code blocks, categories, and SEO metadata |
| `author` | Author profiles with bios and avatars |
| `category` | Blog post taxonomy and tagging |
| `labsProject` | Research and development project showcases |
| `announcement` | Platform announcements and updates |
| `partner` | Partner organization profiles |
| `testimonial` | User and partner testimonials |

## Desk Structure

The studio organizes content into logical sections:

```
DeFlow Labs Content
├── 📝 Editorial
│   ├── Blog Posts
│   ├── Authors
│   └── Categories
├── 🔬 Labs
│   └── Research Projects
├── 📢 Marketing
│   ├── Announcements
│   ├── Partners
│   └── Testimonials
└── ⚙️ All Documents
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Sanity account with access to the `deflow-labs` project

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in SANITY_STUDIO_PROJECT_ID

# Start dev server (http://localhost:3333)
npm run dev
```

### Deployment

The studio is deployed via Sanity's hosting infrastructure:

```bash
# Build the studio
npm run build

# Deploy to Sanity hosting
npm run deploy
```

## Environment Variables

| Variable | Description |
|:---------|:------------|
| `SANITY_STUDIO_PROJECT_ID` | Sanity project identifier |
| `SANITY_STUDIO_DATASET` | Dataset name (default: `production`) |

## Integration with Website

The marketing website (`@deflow/website`) consumes content from this studio via the Sanity client. Content updates are reflected on the website in real-time through Sanity's CDN.

```
Studio (edit) → Sanity API → Website (fetch via @nuxt/sanity)
```

## License

Proprietary © DeFlow Labs
