"""슬라이드 5 '둘러보기(EDA)' 미리보기 차트.

실제 데이터가 아닌 시뮬레이션 데이터(가상)로 그린 개념 예시.
실행: python src/charts/eda_preview.py  →  site/assets/img/eda_preview.svg
"""
from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

matplotlib.use("Agg")
plt.rcParams["font.family"] = "Malgun Gothic"
plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["svg.fonttype"] = "path"

OUT = Path(__file__).resolve().parents[2] / "site" / "assets" / "img" / "eda_preview.svg"

INK, MUTED, HAIR = "#111111", "#5b6470", "#e5e7eb"
PALETTE = {"스케일": "#00b377", "넨도로이드": "#111111", "경품": "#86909c"}

rng = np.random.default_rng(7)
frames = []
for kind, (mu, sigma, n) in {
    "스케일": (0.55, 0.45, 120),
    "넨도로이드": (0.35, 0.40, 120),
    "경품": (0.05, 0.50, 120),
}.items():
    premium = np.exp(rng.normal(mu, sigma, n)) - 1  # 프리미엄율(배수)
    frames.append(pd.DataFrame({"유형": kind, "프리미엄율": premium * 100}))
df = pd.concat(frames)

sns.set_theme(style="white", font="Malgun Gothic", rc={"axes.unicode_minus": False, "svg.fonttype": "path"})
fig, ax = plt.subplots(figsize=(8.4, 3.6), dpi=100)
fig.patch.set_facecolor("#ffffff")

sns.boxplot(data=df, x="프리미엄율", y="유형", hue="유형", palette=PALETTE,
            width=0.5, fliersize=0, linewidth=1.4, boxprops={"alpha": 0.25}, ax=ax, legend=False)
sns.stripplot(data=df, x="프리미엄율", y="유형", hue="유형", palette=PALETTE,
              size=3.2, alpha=0.75, jitter=0.18, ax=ax, legend=False)

ax.axvline(0, color=INK, lw=1, ls="--")
ax.set_xticks([0, 100, 200, 300, 400], ["0\n(정가)", "100", "200", "300", "400"])
ax.set_xlabel("프리미엄율 (%)", fontsize=15, color=MUTED)
ax.set_ylabel("")
ax.tick_params(labelsize=15, colors=INK)
ax.set_xlim(-80, 400)
sns.despine(left=True)
ax.grid(axis="x", color=HAIR)

fig.tight_layout()
OUT.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(OUT, format="svg", facecolor=fig.get_facecolor())
print("saved", OUT)
