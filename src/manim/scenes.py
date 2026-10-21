"""슬라이드용 manim 개념 영상 (모든 수치는 이해를 돕기 위한 예시/가상 데이터).

렌더:
  python -m manim -qh --format=mp4 -o premium_formula src/manim/scenes.py PremiumFormula
  python -m manim -qh --format=mp4 -o regression_fit  src/manim/scenes.py RegressionFit
  python -m manim -qh --format=mp4 -o confounder      src/manim/scenes.py Confounder
결과는 media/ 아래 생성 → tools/render_manim.ps1 이 site/assets/media 로 복사
"""
import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP, UR, Arrow, Axes, Brace, Create, DashedLine, Dot, FadeIn, GrowArrow,
    GrowFromEdge, LaggedStart, Line, Rectangle, ReplacementTransform, Scene, SurroundingRectangle,
    Text, VGroup, ValueTracker, Write, always_redraw, config,
)

FONT = "Malgun Gothic"
INK, MINT, MUTED = "#111111", "#00f0a0", "#5b6470"


def kt(s, size=36, color=INK, weight="BOLD"):
    return Text(s, font=FONT, font_size=size, color=color, weight=weight)


class PremiumFormula(Scene):
    """정가 30,000 → 중고가 90,000 → 프리미엄율 +200% 조립."""

    def construct(self):
        self.camera.background_color = "#ffffff"
        unit = 1.3  # 30,000원당 높이
        base_y = -2.6

        def bar(x, h, color):
            r = Rectangle(width=1.6, height=h, fill_color=color, fill_opacity=1, stroke_width=0)
            r.move_to([x, base_y + h / 2, 0])
            return r

        ground = Line([-6.8, base_y, 0], [-2.4, base_y, 0], color=INK, stroke_width=3)
        b1 = bar(-5.9, unit, "#d6dadf")
        b2 = bar(-3.6, unit * 3, INK)
        l1 = kt("정가", 32).next_to(b1, DOWN, buff=0.25)
        l2 = kt("중고가", 32).next_to(b2, DOWN, buff=0.25)
        v1 = kt("30,000원", 30, MUTED).next_to(b1, UP, buff=0.2)
        v2 = kt("90,000원", 30).next_to(b2, UP, buff=0.2)

        self.play(Create(ground), run_time=0.5)
        self.play(GrowFromEdge(b1, DOWN), FadeIn(l1), run_time=0.8)
        self.play(FadeIn(v1), run_time=0.3)
        self.play(GrowFromEdge(b2, DOWN), FadeIn(l2), run_time=1.0)
        self.play(FadeIn(v2), run_time=0.3)

        # 정가 높이까지 점선 → 초과분을 민트로
        ref = DashedLine([-6.7, base_y + unit, 0], [-2.6, base_y + unit, 0], color=MUTED)
        extra = Rectangle(width=1.6, height=unit * 2, fill_color=MINT, fill_opacity=1, stroke_width=0)
        extra.move_to([-3.6, base_y + unit + unit, 0])
        brace = Brace(extra, RIGHT, color=INK)
        diff = kt("+60,000원", 30).next_to(brace, RIGHT, buff=0.15)
        self.play(Create(ref), run_time=0.5)
        self.play(FadeIn(extra), run_time=0.6)
        self.play(FadeIn(brace), Write(diff), run_time=0.7)

        # 오른쪽: 공식 조립
        s1 = kt("① 빼기   90,000 − 30,000 = 60,000", 28)
        s2 = kt("② 나누기   60,000 ÷ 30,000 = 2", 28)
        s3 = kt("③ 백분율   2 × 100", 28)
        steps = VGroup(s1, s2, s3).arrange(DOWN, aligned_edge=LEFT, buff=0.45)
        steps.move_to([3.6, 1.4, 0])
        for s in steps:
            self.play(FadeIn(s, shift=RIGHT * 0.3), run_time=0.6)
            self.wait(0.2)

        result = kt("= +200%", 96).move_to([3.6, -1.6, 0])
        box = SurroundingRectangle(result, color=MINT, fill_color=MINT, fill_opacity=1,
                                   corner_radius=0.25, buff=0.3)
        self.play(FadeIn(box), Write(result), run_time=0.9)
        self.wait(2.0)


class RegressionFit(Scene):
    """흩어진 점들 위에서 회귀선이 맞춰지는 과정 (가상 데이터)."""

    def construct(self):
        self.camera.background_color = "#1c1c1c"
        axes = Axes(x_range=[0, 10, 2], y_range=[0, 10, 2], x_length=10.5, y_length=5.6,
                    axis_config={"color": "#5b6470", "include_ticks": False, "stroke_width": 3})
        axes.shift(DOWN * 0.35)
        xl = kt("캐릭터 인기 →", 28, "#c9ced6").next_to(axes.x_axis, DOWN, buff=0.25).align_to(axes.x_axis, RIGHT)
        yl = kt("프리미엄율 ↑", 28, "#c9ced6").next_to(axes.y_axis, UP, buff=0.2).align_to(axes.y_axis, LEFT)

        rng = np.random.default_rng(3)
        xs = rng.uniform(0.6, 9.4, 26)
        ys = np.clip(0.75 * xs + 1.2 + rng.normal(0, 1.1, xs.size), 0.3, 9.7)
        dots = VGroup(*[Dot(axes.c2p(x, y), radius=0.08, color="#ffffff") for x, y in zip(xs, ys)])

        slope_fit, icpt_fit = np.polyfit(xs, ys, 1)
        mean_y = ys.mean()
        t = ValueTracker(0)  # 0 = 평균 수평선, 1 = 최적 회귀선

        def params():
            a = t.get_value()
            return a * slope_fit, (1 - a) * mean_y + a * icpt_fit

        def fit_line():
            m, b = params()
            return Line(axes.c2p(0, b), axes.c2p(10, m * 10 + b), color=MINT, stroke_width=6)

        def residuals():
            m, b = params()
            return VGroup(*[Line(axes.c2p(x, y), axes.c2p(x, m * x + b), color=MINT,
                                 stroke_width=2, stroke_opacity=0.45) for x, y in zip(xs, ys)])

        self.play(Create(axes), FadeIn(xl), FadeIn(yl), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(d, scale=0.4) for d in dots], lag_ratio=0.06), run_time=1.6)
        line, res = always_redraw(fit_line), always_redraw(residuals)
        self.play(FadeIn(res), Create(line), run_time=0.7)
        self.play(t.animate.set_value(1), run_time=2.4)

        label = kt("기울기 = 영향력", 30, "#111111")
        pill = SurroundingRectangle(label, color=MINT, fill_color=MINT, fill_opacity=1,
                                    corner_radius=0.3, buff=0.22)
        g = VGroup(pill, label).to_corner(UR, buff=0.55)
        self.play(FadeIn(g, shift=DOWN * 0.2), run_time=0.6)
        self.wait(2.0)


class Confounder(Scene):
    """상관 ≠ 인과: '한정판이라 비싸다'처럼 보여도 숨은 변수(캐릭터 인기)가 둘 다 만들 수 있음."""

    def construct(self):
        self.camera.background_color = "#1c1c1c"

        def node(s, fill, color, pos):
            label = kt(s, 40, color)
            box = SurroundingRectangle(label, color=fill, fill_color=fill, fill_opacity=1,
                                       corner_radius=0.35, buff=0.38)
            return VGroup(box, label).move_to(pos)

        limited = node("한정판 출시", "#2e2e2e", "#ffffff", [-4.0, -1.9, 0])
        premium = node("높은 프리미엄", "#2e2e2e", "#ffffff", [4.0, -1.9, 0])
        hidden = node("캐릭터 인기", MINT, INK, [0, 2.1, 0])

        naive = Arrow(limited.get_right(), premium.get_left(), buff=0.25, color="#c9ced6",
                      stroke_width=6, max_tip_length_to_length_ratio=0.08)
        q = kt("한정판이라 비싸다?", 34, "#c9ced6").next_to(naive, UP, buff=0.3)

        self.play(FadeIn(limited, shift=UP * 0.3), FadeIn(premium, shift=UP * 0.3), run_time=0.8)
        self.play(GrowArrow(naive), Write(q), run_time=1.0)
        self.wait(0.8)

        # 숨은 변수 등장 → 진짜 화살표 두 개, 처음 화살표는 점선으로 약해짐
        a1 = Arrow(hidden.get_bottom(), limited.get_top(), buff=0.25, color=MINT, stroke_width=7)
        a2 = Arrow(hidden.get_bottom(), premium.get_top(), buff=0.25, color=MINT, stroke_width=7)
        weak = DashedLine(naive.get_start(), naive.get_end(), color=MUTED, stroke_width=4, dash_length=0.2)
        q2 = kt("?", 48, MUTED).next_to(weak, UP, buff=0.2)
        self.play(FadeIn(hidden, scale=0.7), run_time=0.7)
        self.play(GrowArrow(a1), GrowArrow(a2), run_time=1.0)
        self.play(ReplacementTransform(naive, weak), ReplacementTransform(q, q2), run_time=0.8)

        tag = kt("숨은 변수(교란 변수)", 30, MINT).next_to(hidden, RIGHT, buff=0.4)
        self.play(FadeIn(tag, shift=LEFT * 0.2), run_time=0.6)
        self.wait(2.5)


config.background_color = "#ffffff"
