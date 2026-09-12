from __future__ import annotations

import time


class WallClock:
    def now(self) -> float:
        return time.time()


class SimClock:
    def __init__(self, t: float = 0.0) -> None:
        self.t = t

    def now(self) -> float:
        return self.t

    def advance(self, minutes: float) -> None:
        self.t += minutes * 60.0
