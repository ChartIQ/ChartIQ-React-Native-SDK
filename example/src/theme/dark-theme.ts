import { Colors } from './colors';
import { ColorPallette } from './theme';

const DarkTheme: ColorPallette = {
  colorPrimary: Colors.mountainMeadow,
  colorPrimaryDark: Colors.ghostWhite,
  colorAccent: Colors.mountainMeadow,

  background: Colors.chineseBlack,
  backgroundSecondary: Colors.darkGunmetal,
  buttonBackground: Colors.yankeesBlue,
  buttonText: Colors.white,
  primaryButtonText: Colors.white,
  placeholderSecondaryColor: Colors.chineseBlack,

  placeholder: Colors.cadetBlue,
  inputBackground: Colors.battleshipGrey24,

  cardTitle: Colors.white,
  cardSubtitle: Colors.cadetBlue,

  border: Colors.outerSpace,
  error: Colors.coralRed,
  errorBackground: Colors.veryLightPink,
  white: Colors.white,

  favoriteBackground: Colors.brillianteAzure,

  fullViewButtonBackground: Colors.white,
  fullViewButtonForeground: Colors.darkElectricBlue,

  measureBackground: Colors.elevationDark48,
  selectedColorBackground: Colors.battleshipGrey24,
  crosshairValue: Colors.mayaBlue,
  crosshairItemTitle: Colors.cadetBlue,
} as const;

export default DarkTheme;
