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
