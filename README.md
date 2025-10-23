# Aslam Muhammed - Portfolio

> A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS

![Portfolio Preview](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.1-purple) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite for blazing-fast performance
- **Smooth Animations**: Framer Motion for fluid, professional animations
- **Dark Mode**: Toggle between light and dark themes with smooth transitions
- **Glassmorphism UI**: Modern design with glass-like effects and blur
- **Scroll Animations**: Interactive elements that animate on scroll
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Performance Optimized**: Lighthouse score 95+
- **Type-Safe**: Full TypeScript coverage for better developer experience

## Tech Stack

### Core
- **React 18.3** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.1** - Build tool & dev server

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion 11** - Animation library
- **React Icons 5** - Icon library

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/aslammhdms/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The portfolio will be available at `http://localhost:3000`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/      # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── ParticlesBackground.tsx
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
│   ├── images/          # Images
│   └── doc/             # Documents (resume, etc.)
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Features Breakdown

### Dark Mode
- System preference detection
- Smooth theme transitions
- Persistent theme selection (localStorage)
- Custom theme toggle button with animation

### Animations
- **Framer Motion**: Page transitions, scroll animations, hover effects
- **Intersection Observer**: Scroll-triggered animations
- **Custom CSS**: Gradient animations, floating elements, glow effects

### Design Highlights
- **Glassmorphism**: Frosted glass effects on cards and modals
- **Gradient Text**: Eye-catching gradient text for headings
- **Particle Background**: Animated particle network background
- **Smooth Scrolling**: Seamless navigation between sections
- **Hover Effects**: Interactive hover states on all clickable elements

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ }
    }
  }
}
```

### Content
Update the content in respective component files:
- Personal info: `src/components/Hero.tsx`
- Experience: `src/components/About.tsx`
- Projects: `src/components/Projects.tsx`
- Skills: `src/components/Skills.tsx`
- Contact: `src/components/Contact.tsx`

## Building for Production

1. Build the project
```bash
npm run build
```

2. The output will be in the `dist/` folder, ready for deployment

## Deployment

This portfolio can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder
```

### GitHub Pages
```bash
npm run build
# Use GitHub Actions or manual deployment
```

## Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: Optimized with code splitting
- **SEO**: Fully optimized with meta tags

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Contact

**Aslam Muhammed**
- Email: aslammhdms@gmail.com
- LinkedIn: [linkedin.com/in/aslammhdms](https://www.linkedin.com/in/aslammhdms)
- Location: Kollam, India

---

Built with love using React, TypeScript, and Tailwind CSS
