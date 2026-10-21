"""슬라이드 8 '예상 이슈' 차트: 올려둔 가격(호가) vs 실제로 팔린 가격의 프리미엄율 분포.

실제 데이터가 아닌 시뮬레이션 데이터(가상)로 그린 개념 예시.
실행: python src/charts/ask_vs_sold.py  →  site/assets/img/ask_vs_sold.svg
"""
from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.patches import Patch

matplotlib.use("Agg")

OUT = Path(__file__).resolve().parents[2] / "site" / "assets" / "img" / "ask_vs_sold.svg"

INK, MUTED, HAIR = "#111111", "#5b6470", "#e5e7eb"
PALETTE = {"올려둔 가격(호가)": "#86909c", "실제로 팔린 가격": "#00b377"}

rng = np.random.default_rng(11)
sold = np.exp(rng.normal(0.45, 0.42, 400)) - 1
ask = np.exp(rng.normal(0.80, 0.50, 400)) - 1  # 호가는 팔린 가격보다 높게 형성
df = pd.concat([
    pd.DataFrame({"구분": "올려둔 가격(호가)", "프리미엄율": ask * 100}),
    pd.DataFrame({"구분": "실제로 팔린 가격", "프리미엄율": sold * 100}),
])

sns.set_theme(style="white", font="Malgun Gothic", rc={"axes.unicode_minus": False, "svg.fonttype": "path"})
fig, ax = plt.subplots(figsize=(7.4, 4.9), dpi=100)
fig.patch.set_facecolor("#ffffff")

sns.kdeplot(data=df, x="프리미엄율", hue="구분", palette=PALETTE, fill=True, alpha=0.3,
            linewidth=2.4, common_norm=False, clip=(-80, 450), ax=ax, legend=False)
handles = []
for label, color in reversed(PALETTE.items()):
    med = df.loc[df["구분"] == label, "프리미엄율"].median()
    ax.axvline(med, color=color, lw=1.6, ls="--")
    handles.append(Patch(facecolor=color, alpha=0.6, edgecolor=color, label=f"{label} · 중앙값 +{med:.0f}%"))
ax.legend(handles=handles, loc="upper right", frameon=False, fontsize=14, handlelength=1.2)

ax.axvline(0, color=INK, lw=1)
ax.set_xticks([0, 100, 200, 300, 400], ["0\n(정가)", "100", "200", "300", "400"])
ax.set_xlabel("프리미엄율 (%)", fontsize=15, color=MUTED)
ax.set_ylabel("")
ax.set_yticks([])
ax.tick_params(labelsize=15, colors=INK)
ax.set_xlim(-80, 420)
sns.despine(left=True)
ax.grid(axis="x", color=HAIR)

fig.tight_layout()
OUT.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(OUT, format="svg", facecolor=fig.get_facecolor())
print("saved", OUT)
