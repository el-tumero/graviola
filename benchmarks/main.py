from utils import fs, bytes, r_groups
from cls import RarityGroup, RaritySetting, RolledWord
from plot import plot_group_distribution, plot_index_distribution
from typing import List
import random
from eth_hash.auto import keccak

# CONFIGURATION
KEYWORDS_PER_TOKEN = 3
ROLL_WORDS_ITER = 20000  # Total samples = KEYWORDS_PER_TOKEN * ROLL_WORDS_ITER
SEED_BITS = 32

path = fs.get_abs_path("keywords.json")
json_content = fs.read_json(path)


# IMPLEMENTATION
def rollWords(seed: int, rSetting: RaritySetting, rGroups: List[RarityGroup]):
    used: List[int] = []
    res: List[RolledWord] = []
    rollNum: int = 0

    while len(used) != KEYWORDS_PER_TOKEN:
        # Equal to "abi.encode(_seed, i, j)" in Contract implementation
        hash_input: bytes = f"{seed}{len(used)}{rollNum}".encode()
        rand: bytes = keccak(hash_input)
        res_idx = bytes.int_from_bytes(rand) % rSetting.omega
        rollNum += 1

        if res_idx in used:
            # print("duplicate, re-rolling")
            continue

        try:
            target_group = r_groups.find_rarity_group(res_idx, rGroups)
            if target_group:
                word = RolledWord(target_group, res_idx)
                res.append(word)
                # print(f"rolled word: '{word.get_keyword()}'")
            else:
                print("target group not found")
        except:
            print(f"err")

        used.append(res_idx)

    return res


# BENCHMARK
bench_res_groups = []
bench_res_indices = []

for i in range(ROLL_WORDS_ITER):
    rarity_groups: List[RarityGroup] = r_groups.create_rarity_groups(json_content)
    omega: int = rarity_groups[-1].endRange + 1
    group_sizes: List[int] = [len(group.keywords) for group in rarity_groups]
    rollWordsSetting = RaritySetting(omega, group_sizes)
    seed = random.getrandbits(SEED_BITS)
    word_res = rollWords(seed=seed, rSetting=rollWordsSetting, rGroups=rarity_groups)
    for word in word_res:
        bench_res_indices.append(word.abs_idx)
        bench_res_groups.append(word.group)

# print(f"bench_res_groups ", bench_res_groups)
# print(f"bench_res_indices ", bench_res_indices)
plot_group_distribution(bench_res_groups, KEYWORDS_PER_TOKEN)
plot_index_distribution(bench_res_indices)
