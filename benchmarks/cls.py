from typing import List


class RarityGroup:
    def __init__(self, name: str, keywords: List[str], start: int, end: int):
        self.name = name
        self.keywords = keywords
        self.startRange = start
        self.endRange = end

    def __str__(self):
        return f"RarityGroup(name='{self.name}', startRange={self.startRange}, endRange={self.endRange}, keywords={self.keywords})"


class RaritySetting:
    def __init__(self, omega: int, groupSizes: List[int]):
        self.omega = omega
        self.groupSizes = groupSizes

    def __str__(self):
        return f"RaritySetting(omega='{self.omega}', groupSizes=${self.groupSizes})"


class RolledWord:
    def __init__(self, group: RarityGroup, abs_idx: int):
        self.group = group
        self.abs_idx = abs_idx

    def __str__(self):
        return f"RolledWord group={self.group}, absoluteIdx={self.abs_idx}"

    def get_rel_idx(self):
        return self.abs_idx - self.group.endRange

    def get_keyword(self):
        return self.group.keywords[self.get_rel_idx()]
