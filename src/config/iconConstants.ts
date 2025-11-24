/**
 * Icon Size and Weight Constants
 *
 * Standardized icon sizing and styling for consistent UI across the application.
 * Use these constants instead of hardcoded values to maintain visual consistency.
 */

export const ICON_SIZES = {
  /** Small icons for inline text, badges, status indicators (12-14px) */
  XS: 12,

  /** Standard size for inline content, buttons, form inputs (16px) */
  SM: 16,

  /** Navigation items, list items, tabs (18-20px) */
  MD: 20,

  /** Section headers, card headers, feature icons (24px) */
  LG: 24,

  /** Hero sections, large feature cards (32px) */
  XL: 32,

  /** Special large displays, dashboard highlights (48px) */
  XXL: 48,
} as const;

export const ICON_WEIGHTS = {
  /** Standard icons, body content */
  REGULAR: 'regular',

  /** Hero icons, feature cards, emphasis */
  DUOTONE: 'duotone',

  /** Important actions, primary buttons */
  BOLD: 'bold',

  /** Status indicators, active states */
  FILL: 'fill',

  /** Subtle icons, secondary content */
  LIGHT: 'light',

  /** Outlined style icons */
  THIN: 'thin',
} as const;

/**
 * Icon usage guidelines by context
 */
export const ICON_CONTEXTS = {
  // Dashboard and hero sections
  HERO: { size: ICON_SIZES.XL, weight: ICON_WEIGHTS.DUOTONE },
  FEATURE_CARD: { size: ICON_SIZES.LG, weight: ICON_WEIGHTS.DUOTONE },

  // Navigation
  SIDEBAR_NAV: { size: ICON_SIZES.MD, weight: ICON_WEIGHTS.REGULAR },
  TAB_NAV: { size: ICON_SIZES.MD, weight: ICON_WEIGHTS.REGULAR },

  // Content
  SECTION_HEADER: { size: ICON_SIZES.LG, weight: ICON_WEIGHTS.DUOTONE },
  CARD_HEADER: { size: ICON_SIZES.MD, weight: ICON_WEIGHTS.DUOTONE },
  INLINE_TEXT: { size: ICON_SIZES.SM, weight: ICON_WEIGHTS.REGULAR },
  LIST_ITEM: { size: ICON_SIZES.MD, weight: ICON_WEIGHTS.REGULAR },

  // Interactive elements
  BUTTON: { size: ICON_SIZES.SM, weight: ICON_WEIGHTS.REGULAR },
  BUTTON_PRIMARY: { size: ICON_SIZES.SM, weight: ICON_WEIGHTS.BOLD },
  INPUT_ICON: { size: ICON_SIZES.SM, weight: ICON_WEIGHTS.REGULAR },

  // Status and indicators
  STATUS_BADGE: { size: ICON_SIZES.XS, weight: ICON_WEIGHTS.FILL },
  ALERT: { size: ICON_SIZES.MD, weight: ICON_WEIGHTS.BOLD },
  NOTIFICATION: { size: ICON_SIZES.SM, weight: ICON_WEIGHTS.FILL },
} as const;

/**
 * Helper type for icon props
 */
export type IconSize = typeof ICON_SIZES[keyof typeof ICON_SIZES];
export type IconWeight = typeof ICON_WEIGHTS[keyof typeof ICON_WEIGHTS];

/**
 * Common icon props interface
 */
export interface IconProps {
  size?: IconSize;
  weight?: IconWeight;
  color?: string;
  className?: string;
}

/**
 * Utility to get icon props for a specific context
 *
 * @example
 * ```tsx
 * import { getIconProps, ICON_CONTEXTS } from '@/config/iconConstants';
 *
 * <GraduationCap {...getIconProps(ICON_CONTEXTS.HERO)} />
 * <Calendar {...getIconProps(ICON_CONTEXTS.BUTTON)} />
 * ```
 */
export const getIconProps = (context: { size: IconSize; weight: IconWeight }) => ({
  size: context.size,
  weight: context.weight,
});
