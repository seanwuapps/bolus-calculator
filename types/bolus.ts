export interface TimeBasedValue {
  start: string;
  end: string;
  value: string;
}

export interface BolusParams {
  targetBGs: TimeBasedValue[];
  icrs: TimeBasedValue[];
  isfs: TimeBasedValue[];
}

export interface CurrentBolusParams {
  targetBG?: TimeBasedValue;
  icr?: TimeBasedValue;
  isf?: TimeBasedValue;
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
