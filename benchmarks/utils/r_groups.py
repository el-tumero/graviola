from typing import Dict, List
from cls import RarityGroup


# Find where keyword belongs based on absolute index
def find_rarity_group(index: int, rarity_groups: List[RarityGroup]) -> RarityGroup:
    for group in rarity_groups:
        if group.startRange <= index <= group.endRange:
            return group
    raise IndexError(f"idx {index} is out of bounds")


# Generate RarityGroup objects from keywords.json data
def create_rarity_groups(json_data: Dict[str, List[str]]) -> List[RarityGroup]:
    rarity_groups = []
    current_index = 0

    for rarity, keywords in json_data.items():
        end_index = current_index + len(keywords) - 1
        rarity_group = RarityGroup(
            name=rarity, keywords=keywords, start=current_index, end=end_index
        )
        rarity_groups.append(rarity_group)
        current_index = end_index + 1

    return rarity_groups
