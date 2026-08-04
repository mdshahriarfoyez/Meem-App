export type ChapterId =
  | 'opening'
  | 'story'
  | 'memory'
  | 'adventure'
  | 'meter'
  | 'question'
  | 'letter'
  | 'finale';

/** Linear order of the journey. Index in this array is the chapter's "stage". */
export const CHAPTER_ORDER: ChapterId[] = [
  'opening',
  'story',
  'memory',
  'adventure',
  'meter',
  'question',
  'letter',
  'finale',
];

export interface Progress {
  /** Highest stage index reached — everything up to it stays unlocked. */
  furthest: number;
  /** Which adventure she picked, kept so a revisit shows her choice. */
  adventure: string | null;
  /** True once she has answered the impossible question. */
  saidYes: boolean;
  /** True once the five-tap easter egg has been found. */
  secretFound: boolean;
  /** True once the final heart has been held for three seconds. */
  hiddenFound: boolean;
}

export const EMPTY_PROGRESS: Progress = {
  furthest: 0,
  adventure: null,
  saidYes: false,
  secretFound: false,
  hiddenFound: false,
};
