declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

type Color = {
  brand: string;
  text1: string;
  text2: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;
  surfaceShadow: string;
  shadowStrength: number;
};

type ThemeType = {
  color: Color;
} & typeof sharedStyles;

const brandColor = {
  hue: 200,
  saturation: 100,
  lightness: 50,
} as const;
const size = {
  medium: "768px",
  small: "320px",
} as const;
const font = {
  primary: "Lato, serif",
  secondary: "Cardo, serif",
} as const;
const device = {
  medium: `(min-width: ${size.medium})`,
  small: `(min-width: ${size.small})`,
} as const;

export const sharedStyles = {
  size,
  font,
  device,
} as const;

export const theme: { light: ThemeType; dark: ThemeType } = {
  light: {
    ...sharedStyles,
    color: {
      brand: `hsl(${brandColor.hue} ${brandColor.saturation}% ${brandColor.lightness}%)`,
      text1: `hsl(${brandColor.hue} ${brandColor.saturation}% 10%)`,
      text2: `hsl(${brandColor.hue} 30% 30%)`,
      surface1: `hsl(${brandColor.hue} 25% 90%)`,
      surface2: `hsl(${brandColor.hue} 20% 99%)`,
      surface3: `hsl(${brandColor.hue} 20% 92%)`,
      surface4: `hsl(${brandColor.hue} 20% 85%)`,
      surfaceShadow: `hsl(${brandColor.hue} 10% 20%)`,
      shadowStrength: 0.02,
    },
  },
  dark: {
    ...sharedStyles,
    color: {
      brand: `hsl(${brandColor.hue} ${brandColor.saturation / 1.25}% ${
        brandColor.lightness / 1.25
      }%)`,
      text1: `hsl(${brandColor.hue} 15% 75%)`,
      text2: `hsl(${brandColor.hue} 10% 61%)`,
      surface1: `hsl(${brandColor.hue} 10% 20%)`,
      surface2: `hsl(${brandColor.hue} 10% 25%)`,
      surface3: `hsl(${brandColor.hue} 5% 30%)`,
      surface4: `hsl(${brandColor.hue} 5% 35%)`,
      surfaceShadow: `hsl(${brandColor.hue} 30% 13%)`,
      shadowStrength: 0.2,
    },
  },
};
