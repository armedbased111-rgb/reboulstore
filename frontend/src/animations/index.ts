/**
 * Export centralisé de toutes les animations
 * 
 * Usage:
 * import { animateFadeIn, animateSlideUp } from '../../animations';
 */

// Presets réutilisables
export { animateFadeIn, type FadeInOptions } from './presets/fade-in';
export { animateSlideUp, type SlideUpOptions } from './presets/slide-up';
export { animateSlideDown, type SlideDownOptions } from './presets/slide-down';
export { animateStaggerFadeIn, type StaggerFadeInOptions } from './presets/stagger-fade-in';
export { animateScaleHover, type ScaleHoverOptions } from './presets/scale-hover';
export { animateRevealUp, type RevealUpOptions } from './presets/reveal-up';
export { animateFadeScale, type FadeScaleOptions } from './presets/fade-scale';

// Animations spécifiques aux composants
// export { animateProductPage } from './components/ProductPage/product-fade-in';
// export { animateBadgeAppear } from './components/ProductPage/badge-appear';

// Utilitaires
// export { useGSAP } from './utils/gsap-helpers';
export { useScrollAnimation } from './utils/useScrollAnimation';

