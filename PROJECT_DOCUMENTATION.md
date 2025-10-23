# Al Madina Hypermarket - React Website Documentation

## 📋 Project Overview

**Project Name:** Al Madina Hypermarket Website
**Technology Stack:** React 18 + Vite + Tailwind CSS + Framer Motion
**Domain:** almadinahypermarket.ae
**Project Location:** C:\Almadina\al-madina-react
**Created:** 2025
**Status:** Live in Production

---

## 🎯 Project Description

A modern, fully responsive React-based website for Al Madina Hypermarket - Abu Dhabi's trusted neighbourhood hypermarket since 1971. The website features a clean, professional design with smooth animations, dark mode support, and interactive elements.

---

## 🏗️ Technology Stack

### Core Technologies
- **React 18.3.1** - JavaScript library for building user interfaces
- **Vite 7.1.11** - Next generation frontend build tool
- **React Router DOM 7.1.1** - Client-side routing
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

### Animation & UI Libraries
- **Framer Motion 12.0.2** - Animation library for React
- **React Icons 5.4.0** - Icon library (HeroIcons, Font Awesome)

### Build Configuration
- **CommonJS Tailwind Config** - Required for Tailwind CSS v3.3.0 compatibility
- **Vite Build System** - Fast development and optimized production builds

---

## 📁 Project Structure

```
al-madina-react/
├── public/
│   └── assets/
│       └── img/
│           ├── madina-logo.png
│           ├── favicon.png
│           ├── apple-touch-icon.png
│           ├── slide/
│           │   ├── slide-1.jpg
│           │   ├── slide-2.jpg
│           │   ├── slide-3.jpg
│           │   ├── slide-4.jpg
│           │   └── slide-5.jpg
│           ├── gallery/
│           │   ├── gallery-1.jpg to gallery-19.jpg
│           ├── specials-1.png to specials-6.png
│           ├── anniversary-bonanza-2022.jpg
│           ├── shop-win-2021.jpg
│           ├── winter-drive-2023.jpg
│           └── winter-drive-2025.jpg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── AppDownload.jsx
│   │   │   ├── Gallery.jsx
│   │   │   └── Events.jsx
│   │   └── AppStoreModal.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── BranchesPage.jsx
│   │   ├── OffersPage.jsx
│   │   ├── CareersPage.jsx
│   │   └── ContactPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── dist/ (Production build)
│   ├── index.html
│   ├── web.config
│   └── assets/
├── index.html
├── package.json
├── tailwind.config.cjs
├── postcss.config.js
├── vite.config.js
└── PROJECT_DOCUMENTATION.md (this file)
```

---

## 🎨 Website Features

### 1. **Home Page**
- **Hero Section** with auto-playing image slider (5 slides)
  - Prev/Next navigation buttons
  - Slide indicator dots
  - Dark gradient overlay with white text
  - CTA buttons: "Shop Online Now" and "Find a Branch"
  - Stats display: 50+ Years, 15+ Branches, 1000+ Products

- **Al Madina AUH App Section**
  - Interactive feature buttons (hover to change phone mockup)
  - 6 Features: Convenient store, Loyalty Points, Exclusive Offers, Notifications, Schedule Delivery, Customer Care
  - Phone mockup images from old website
  - Digital Convenient Store information box
  - App Store and Google Play download buttons
  - Links:
    - iOS: https://apps.apple.com/ae/app/al-madina-auh/id1569033091
    - Android: https://play.google.com/store/apps/details?id=com.almadinahypermarket.mobileapp&hl=en

- **Some Memorable Moments Gallery**
  - 19 gallery photos in responsive grid
  - Shows 8 photos initially
  - "View All Photos" button to expand
  - Hover effects with image zoom

- **Events & Promotions Section**
  - 4 event cards with promotional images
  - Latest event featured badge
  - Events: Winter Drive 2025, 10th Anniversary Bonanza 2022, Winter Drive 2023, Shop & Win 2021

### 2. **About Page**
- Hero section with title and description
- **Our Story Section** with 4 stat cards:
  - 40+ Years of Excellence
  - 15+ Branches
  - 1000+ Daily Customers
  - 500+ Team Members
- **Our Values Section** - 4 value cards:
  - Quality Assurance
  - Customer First
  - Best Prices
  - Convenient Locations
- **Why Al Madina Section** - 3 cards:
  - 01 - VISION: One-stop shopping destination
  - 02 - MISSION: Leading retail position
  - 03 - VALUES: Quality, innovation, customer experience
- CTA section with "Find a Branch" and "Contact Us" buttons

### 3. **Branches Page**
- Hero with search bar
- Stats section: 19 Branches, 24/7 Open, 365 Days
- **19 Branch Locations** with:
  - Exact GPS coordinates from Google Maps
  - Operating hours (9 branches are 24/7)
  - Phone numbers
  - Addresses
  - "Get Directions" button with GPS coordinates
  - Featured badges on select branches
- All branch details:
  1. ME10 - 24 Hours (Featured)
  2. Khalifa City - 24 Hours (Featured)
  3. M37 - 24 Hours
  4. Al Raha - 7:00 AM - 12:00 AM
  5. Rayan Village - 7:00 AM - 11:30 PM
  6. Al Naser - 24 Hours
  7. Al Jaber - 24 Hours
  8. Mafraq - 7:00 AM - 11:30 PM
  9. Hameem - 7:00 AM - 12:00 AM
  10. Musaffah (LLC) - 24 Hours (Featured)
  11. Mussafah (SAHAB) - 7:00 AM - 11:30 PM
  12. Village Mall - 24 Hours
  13. ICAD - 7:00 AM - 11:30 PM
  14. TCA - 7:00 AM - 12:00 AM
  15. Corniche - 24 Hours (Featured)
  16. Khalidiya - 7:00 AM - 11:30 PM
  17. Hamdan Street - 7:00 AM - 12:00 AM
  18. Shawamekh - 24 Hours
  19. NMDC - 7:00 AM - 12:00 AM

### 4. **Offers Page**
- Hero with "Search branches or areas" button
- Search modal with:
  - All 19 branches listed
  - Search functionality to filter by branch or area
  - "Offer Expired" badges on all branches
- "New Offers Coming Soon" section
- CTA: "Find a Branch" and "Shop Online" buttons

### 5. **Careers Page**
- Job opportunities section
- Application form or information

### 6. **Contact Page**
- Contact information
- Contact form
- Social media links

### 7. **Navigation & Layout**
- **Navbar**:
  - Logo (madina-logo.png)
  - Navigation links: Home, About, Branches, Offers, Careers, Contact
  - Dark mode toggle button
  - "Order Online" button (opens app store modal)
  - Mobile hamburger menu
  - Social media links (Facebook, Instagram)

- **Footer**:
  - Company information
  - Quick links
  - Social media
  - Copyright

- **App Store Modal**:
  - Opens when clicking "Order Online" or "Shop Online" buttons
  - Choice between iOS App Store and Google Play Store
  - Used throughout the site (Navbar, Hero, BranchesPage, OffersPage)

---

## 🎨 Design Features

### Color Palette
```javascript
Primary: #00B894 (Green)
Secondary: #6C5CE7 (Purple)
Accent: #FDCB6E (Yellow)
```

### Typography
- **Headings:** Montserrat (Google Fonts)
- **Body:** Inter (Google Fonts)

### Key Design Elements
- **Gradient backgrounds** on headers and CTAs
- **Smooth animations** with Framer Motion
- **Hover effects** on cards and buttons
- **Shadow effects** for depth
- **Rounded corners** (rounded-2xl, rounded-full)
- **Responsive grid layouts**
- **Dark mode support** throughout the entire site

---

## 🌙 Dark Mode

- **Implementation:** CSS class-based with localStorage persistence
- **Toggle:** Available in navbar
- **Coverage:** All pages and components support dark mode
- **Classes:**
  - Light: `bg-white text-gray-900`
  - Dark: `dark:bg-gray-900 dark:text-white`

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile:** Default (< 640px)
- **Tablet:** `md:` (≥ 768px)
- **Desktop:** `lg:` (≥ 1024px)
- **Large Desktop:** `xl:` (≥ 1280px)

### Mobile-First Approach
- All components are designed mobile-first
- Progressive enhancement for larger screens
- Hamburger menu for mobile navigation
- Responsive grids (1 col → 2 cols → 3-4 cols)

---

## 🔧 Development Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps
```bash
cd C:\Almadina\al-madina-react
npm install
```

### Development Server
```bash
npm run dev
```
Opens at: http://localhost:5173

### Production Build
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

---

## 🚀 Deployment to IIS

### Build Process
1. Navigate to project folder
2. Run `npm run build`
3. Production files generated in `dist/` folder

### IIS Configuration

#### Prerequisites
- Windows Server with IIS installed
- URL Rewrite Module (optional but recommended)

#### web.config File
Location: `dist/web.config`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <httpErrors errorMode="Detailed" />
  </system.webServer>
</configuration>
```

#### IIS Setup Steps
1. Open IIS Manager
2. Create new website:
   - Site name: Al Madina Hypermarket
   - Physical path: Point to `dist/` folder
   - Binding: Port 80, hostname: almadinahypermarket.ae
3. Application Pool Settings:
   - .NET CLR Version: No Managed Code
4. Set folder permissions for IIS_IUSRS and IUSR
5. Restart IIS: `iisreset`

#### URL Rewrite Module
- Download: https://www.iis.net/downloads/microsoft/url-rewrite
- Required for React Router to work properly
- Install and restart IIS

---

## 🔄 Update Process

### Making Changes
1. Edit files in `src/` folder
2. Test in development mode: `npm run dev`
3. Build for production: `npm run build`
4. Copy `dist/` folder contents to server
5. Ensure `web.config` is present in `dist/`
6. Restart IIS site if needed

### Important Notes
- Always keep the simplified `web.config` file
- Don't overwrite `web.config` with old version
- Test locally before deploying
- Clear browser cache after updates

---

## 🐛 Common Issues & Solutions

### Issue 1: Internal Server Error (500)
**Cause:** web.config file issues
**Solution:** Use the simplified web.config provided

### Issue 2: Routes Return 404
**Cause:** URL Rewrite module not installed
**Solution:** Install URL Rewrite module or use HashRouter

### Issue 3: Images Not Loading
**Cause:** Incorrect file paths
**Solution:** Verify images are in `dist/assets/img/`

### Issue 4: Blank Page
**Cause:** JavaScript errors
**Solution:** Check browser console (F12) for errors

### Issue 5: Styles Not Applied
**Cause:** CSS not loading
**Solution:** Clear browser cache, check CSS file path

### Issue 6: Dark Mode Not Working
**Cause:** LocalStorage issues
**Solution:** Clear browser data and test again

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "framer-motion": "^12.0.2",
  "react-icons": "^5.4.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.3.4",
  "vite": "^7.1.11",
  "tailwindcss": "3.3.0",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20"
}
```

---

## 🔗 Important Links

### Website
- **Live Site:** https://almadinahypermarket.ae

### Social Media
- **Facebook:** https://www.facebook.com/almadinahypermarket
- **Instagram:** https://www.instagram.com/almadinaabudhabi/

### Mobile Apps
- **iOS App:** https://apps.apple.com/ae/app/al-madina-auh/id1569033091
- **Android App:** https://play.google.com/store/apps/details?id=com.almadinahypermarket.mobileapp&hl=en

### Resources
- **Google Maps:** Al Madina branches locations
- **URL Rewrite Module:** https://www.iis.net/downloads/microsoft/url-rewrite

---

## 📊 Website Statistics

- **Total Pages:** 6 main pages
- **Total Branches:** 19 locations
- **Gallery Images:** 19 photos
- **Event Images:** 4 promotional images
- **Hero Slides:** 5 images
- **App Features:** 6 interactive features
- **Branch Stats:** 9 branches open 24/7

---

## ⚡ Performance Optimizations

### Build Optimizations
- **Code Splitting:** Automatic with Vite
- **Tree Shaking:** Removes unused code
- **Minification:** CSS and JavaScript minified
- **Asset Optimization:** Images and fonts optimized

### Runtime Optimizations
- **Lazy Loading:** Images load as needed
- **Framer Motion:** Optimized animations
- **React Router:** Client-side routing (no page reloads)
- **CSS-in-JS:** Tailwind CSS utility classes

---

## 🔒 Security Considerations

- **XSS Protection:** React's built-in protection
- **HTTPS:** Should be enabled on production server
- **Content Security Policy:** Configure in IIS if needed
- **Regular Updates:** Keep dependencies up to date

---

## 📝 Notes & Best Practices

### File Organization
- Components are organized by type (layout, sections, pages)
- Assets are in public folder for Vite optimization
- Separate modal component for reusability

### Code Style
- **Functional Components:** All components use React Hooks
- **Tailwind CSS:** Inline utility classes for styling
- **Framer Motion:** For smooth animations
- **React Router:** For client-side navigation

### Naming Conventions
- **Components:** PascalCase (e.g., `HomePage.jsx`)
- **Files:** kebab-case for assets (e.g., `madina-logo.png`)
- **CSS Classes:** Tailwind utility classes

---

## 🎓 Learning Resources

### React
- React Documentation: https://react.dev
- React Router: https://reactrouter.com

### Tailwind CSS
- Tailwind Documentation: https://tailwindcss.com/docs
- Tailwind UI Components: https://tailwindui.com

### Framer Motion
- Framer Motion Docs: https://www.framer.com/motion

### Vite
- Vite Documentation: https://vitejs.dev

---

## 📞 Support & Maintenance

### For Technical Issues
- Check browser console for errors (F12)
- Verify all files are deployed correctly
- Check IIS logs for server errors
- Ensure web.config is present and correct

### For Content Updates
- Edit source files in `src/` folder
- Rebuild: `npm run build`
- Deploy `dist/` folder to server
- Test thoroughly before going live

---

## 🏆 Project Achievements

✅ Modern React-based architecture
✅ Fully responsive design
✅ Dark mode support
✅ Smooth animations with Framer Motion
✅ Interactive app section with feature showcase
✅ 19 branches with GPS coordinates
✅ Gallery with 19 photos
✅ Events section with promotional content
✅ App store integration
✅ SEO-friendly structure
✅ Fast load times with Vite
✅ Successfully deployed to IIS
✅ Live in production

---

## 📅 Project Timeline

**Development Phase:** October 2025
**Deployment:** October 22, 2025
**Status:** Live and Operational

---

## 🎯 Future Enhancements (Recommendations)

1. **SEO Optimization**
   - Add meta tags for each page
   - Implement structured data (JSON-LD)
   - Create sitemap.xml
   - Add robots.txt

2. **Performance**
   - Implement lazy loading for images
   - Add progressive web app (PWA) support
   - Enable service workers for offline support

3. **Features**
   - Online shopping cart integration
   - Real-time offers and promotions
   - Customer reviews and testimonials
   - Newsletter subscription
   - Live chat support

4. **Analytics**
   - Google Analytics integration
   - User behavior tracking
   - Conversion tracking

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader optimization
   - Color contrast improvements

---

## 📄 License & Copyright

© 2025 Al Madina Hypermarket. All rights reserved.

---

## 👨‍💻 Development Team

**Project:** Al Madina Hypermarket Website
**Technology:** React + Vite + Tailwind CSS
**Deployment:** IIS on Windows Server
**Domain:** almadinahypermarket.ae

---

## 📋 Maintenance Checklist

### Regular Maintenance (Monthly)
- [ ] Update npm dependencies
- [ ] Check for broken links
- [ ] Verify all images loading correctly
- [ ] Test contact forms
- [ ] Check mobile responsiveness
- [ ] Test dark mode functionality
- [ ] Verify app store links working

### Quarterly Review
- [ ] Review and update branch information
- [ ] Update promotional events
- [ ] Add new gallery photos
- [ ] Check website analytics
- [ ] Review and improve SEO
- [ ] Update content as needed

### Annual Tasks
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Content strategy review
- [ ] Design refresh evaluation
- [ ] Technology stack updates

---

## 🎉 Success Metrics

The website successfully:
- ✅ Replaced old Bootstrap website with modern React architecture
- ✅ Improved user experience with smooth animations
- ✅ Added dark mode for better accessibility
- ✅ Integrated mobile app promotion effectively
- ✅ Displayed all 19 branches with accurate information
- ✅ Showcased company history and values
- ✅ Provided easy navigation and search functionality
- ✅ Deployed successfully to production server
- ✅ Performs well on all devices (mobile, tablet, desktop)

---

**Document Version:** 1.0
**Last Updated:** October 22, 2025
**Next Review:** January 2026

---

*This documentation covers the complete Al Madina Hypermarket website project. Keep this file updated as the project evolves.*
