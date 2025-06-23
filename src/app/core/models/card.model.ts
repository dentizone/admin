/**
 * Represents the details of a card displayed in the UI.
 */
export interface CardDetails {
  /**
   * The title or label of the card.
   */
  title: string;

  /**
   * The main value displayed on the card. Can be a string or a number.
   */
  value: string | number;



  /**
   * (Optional) The icon name to display on the card.
   */
  icon?: string;


}