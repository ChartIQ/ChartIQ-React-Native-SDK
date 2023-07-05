import { DrawingTool } from '../drawingtools';

export interface DrawingManager {
  /**
   * Checks if a drawing tool supports `fill color` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingFillColor(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `line color` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingLineColor(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `line type` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingLineType(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `settings` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingSettings(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `font` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingFont(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `axis label` setting
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingAxisLabel(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `deviations` parameters
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingDeviations(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `Fibonacci` parameters
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingFibonacci(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `VolumeProfile` settings
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingElliottWave(drawingTool: DrawingTool): boolean;

  /**
   * Checks if a drawing tool supports `Elliot wave` parameters
   * @param drawingTool A [DrawingTool] to be checked for the support
   * @return true if the drawing tool supports the setting, false if not
   */
  isSupportingVolumeProfile(drawingTool: DrawingTool): boolean;
}
