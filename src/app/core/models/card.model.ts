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
   * The change value (e.g., percentage or amount) shown on the card.
   */
  change: string;

  /**
   * A label describing the change (e.g., 'Since last week').
   */
  changeLabel: string;

  /**
   * (Optional) The icon name to display on the card.
   */
  icon?: string;

  /**
   * (Optional) Indicates the type of change for the card: 'positive', 'negative', or 'neutral'.
   * Used for determining the visual style of the change indicator.
   */
  changeType?: 'positive' | 'negative' | 'neutral';
}