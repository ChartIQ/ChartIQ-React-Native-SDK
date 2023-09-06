/**
 * OHLCParams
 * @alias OHLCParams
 * @memberof module:ChartIQ
 
 */
export interface OHLCParams {
  /**
   * Date and time in ISO format
   * @example "2018-01-02T16:00:00.000Z"
   */
  DT?: string;
  /**
   * Open price
   * @example 170.16
   */
  Open?: number;
  /** */
  High?: number;
  /** */
  Low?: number;
  /** */
  Close?: number;
  /** */
  Volume?: number;
  /** */
  Adj_Close?: number;
}
