# AADALA.MA — منصة العدالة والذكاء القانوني المغربي

## Overview

AADALA.MA is an independent Moroccan legal intelligence platform designed to make legal knowledge accessible, understandable, and actionable. The current version is a highly optimized, single-file static application that provides:

- **Legal AI Assistant (Demo UI)** — Structured legal analysis with source references.
- **Legal Library** — 36 embedded articles from the Family Code (Moudawana) and Real Estate Code with real-time search.
- **Mawarith Calculator (مِعيار)** — Deterministic Islamic inheritance calculator using exact fractional math (BigInt).
- **Family Dissolution Tool** — Interactive analysis of marital dissolution procedures, legal basis, and financial rights.
- **Property Partition Lab** — Assessment of real estate divisibility based on Moroccan property laws.
- **Methodology & Error Reporting** — Transparent workflow and a built-in issue reporting form.

## Status

**Current version: 1.0.0 (Single-File Static Release)**

This is a fully functional, zero-dependency frontend prototype. The calculators and tools are fully operational and mathematically accurate. Data is currently hardcoded (static arrays) to ensure blazing-fast performance and easy hosting on any static provider.

## Tech Stack (Current)

- **HTML5** (Semantic, RTL Arabic-first)
- **CSS3** (Custom Design System with CSS Variables, Grid, Flexbox, and Dark Mode support via `prefers-color-scheme` and `localStorage`)
- **Vanilla JavaScript (ES6+)**
  - No external frameworks or libraries.
  - Hash-based routing (SPA behavior).
  - Custom `BigInt`-based fraction engine for inheritance math.
- **Google Fonts** (Reem Kufi, IBM Plex Sans Arabic, Amiri).

## Live URL

🌐 **https://aadala-ma.cheraimmohamed20.workers.dev** *(or your GitHub Pages URL)*

## Getting Started

Simply open `index.html` in a modern web browser. No build step, no npm install, and no server required.

```bash
# To serve locally with a static server (optional):
npx serve .