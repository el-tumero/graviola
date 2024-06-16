from typing import List
from utils.r_groups import RarityGroup
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


def plot_group_distribution(bench_res_groups: List[RarityGroup], kw_per_roll: int):
    group_names = [group.name for group in bench_res_groups]
    group_counts = pd.Series(group_names).value_counts()
    total_samples = group_counts.sum()
    df = group_counts.reset_index().rename(
        columns={"index": "Group", "0": "Count", "count": "Count"}
    )
    df["Group"] = df["Group"].astype(str)
    df["Count"] = df["Count"].astype(int)
    df["Percentage"] = (df["Count"] / total_samples) * 100

    plt.figure(figsize=(10, 6))
    bars = plt.bar(df["Group"], df["Percentage"], color="skyblue")
    plt.xlabel("Group Name")
    plt.ylabel("Occurrence Percentage (%)")
    plt.title(
        f"Distribution of Rolled Groups (Kw per roll={kw_per_roll}) (Samples={total_samples})"
    )
    plt.xticks(rotation=45)
    plt.grid(axis="y")
    plt.ylim(0, df["Percentage"].max() * 1.1)

    for bar in bars:
        yval = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.0,
            yval,
            f"{yval:.2f}%",
            va="bottom",
            ha="center",
        )

    plt.tight_layout()
    plt.savefig("group_distribution.png")
    plt.show()


def plot_index_distribution(bench_res_indices: List[int]):
    indices = np.array(bench_res_indices)
    num_bins = min(20, len(np.unique(indices)))
    np.histogram(indices, bins=num_bins, range=(indices.min(), indices.max() + 1))
    expected_count = len(indices) / num_bins

    plt.figure(figsize=(12, 6))
    plt.hist(indices, bins=num_bins, color="lightcoral", edgecolor="black", alpha=0.7)
    plt.axhline(
        expected_count,
        color="blue",
        linestyle="--",
        label="Expected Uniform Distribution",
    )
    mean_idx = np.mean(indices)
    median_idx = np.median(indices)
    std_dev_idx = np.std(indices)
    textstr = (
        f"Mean: {mean_idx:.2f}\n"
        f"Median: {median_idx:.2f}\n"
        f"Std Dev: {std_dev_idx:.2f}\n"
        f"Expected per bin: {expected_count:.2f}"
    )
    props = dict(boxstyle="round", facecolor="white", alpha=0.5)
    plt.gca().text(
        0.95,
        0.9,
        textstr,
        transform=plt.gca().transAxes,
        fontsize=10,
        verticalalignment="top",
        horizontalalignment="right",
        bbox=props,
    )

    plt.xlabel("Index Number")
    plt.ylabel("Occurrence Count")
    plt.title(f"Distribution of Rolled Indices (Samples={len(indices)})")
    plt.xticks(
        np.arange(
            indices.min(),
            indices.max() + 1,
            step=max(1, (indices.max() - indices.min()) // 20),
        )
    )

    plt.grid(axis="y")
    plt.legend()
    plt.tight_layout()
    plt.savefig("index_distribution.png")
    plt.show()
