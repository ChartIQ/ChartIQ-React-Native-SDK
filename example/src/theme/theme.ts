export interface ColorPallette {
  colorPrimary: string;
  colorPrimaryDark: string;
  colorAccent: string;

  buttonText: string;
  buttonBackground: string;
  background: string;
  backgroundSecondary: string;
  primaryButtonText: string;
  placeholderSecondaryColor: string;

  placeholder: string;
  inputBackground: string;

  cardTitle: string;
  cardSubtitle: string;

  border: string;
  error: string;
  white: string;

  favoriteBackground: string;

  fullViewButtonBackground: string;
  fullViewButtonForeground: string;

  crosshairUpdateValueColor: string;
}

export default interface Theme {
  colors: ColorPallette;
}
