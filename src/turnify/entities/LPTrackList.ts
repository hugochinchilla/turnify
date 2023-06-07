import { Track } from "./Track";

const LP_SIDE_DURATION_MS = 22 * 60 * 1000;

enum LPSideDescriptor {
  A = "A",
  B = "B",
}

class LPSide {
  constructor(readonly number: Number, readonly side: LPSideDescriptor) {}
}

export class LPTrackList {
  private tracks: Track[];

  constructor(tracks: Track[]) {
    this.tracks = tracks;
  }
}
