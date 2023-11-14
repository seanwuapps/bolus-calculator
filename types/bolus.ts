export interface TimeBasedValue {
  start: string;
  end: string;
  value: string;
}

export interface Time {
  hour: string;
  minute: string;
  ampm: string;
}

export interface BolusParams {
  targetBGs: TimeBasedValue[];
  icrs: TimeBasedValue[];
  isfs: TimeBasedValue[];
}

export interface BolusRecord {
  ts: Date;
  targetBG: number;
  icr: number;
  isf: number;
  bg: number;
  carbs: number;
  suggestedBolus: number;
  actualBolus: number;
}
