"""Synthesizes the 90 s soundtrack for video/intro.html. Every cue is timed to the visual timeline.
Usage: python video/soundtrack.py video/soundtrack.wav"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, sawtooth, square, fftconvolve

SR = 44100
DUR = 90.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

def bus():
    return np.zeros((2, N), dtype=np.float64)

drums, bass, arp, pad, fx, sfx = bus(), bus(), bus(), bus(), bus(), bus()

def add(b, at, sig, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(sig) <= 0:
        return
    s = sig[: max(0, N - i)] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    b[0, i:i + len(s)] += s * l * 1.414
    b[1, i:i + len(s)] += s * r * 1.414

def tt(d):
    return np.arange(int(d * SR)) / SR

def lp(x, f, o=2):
    return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)

def hp(x, f, o=2):
    return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)

def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)

def env(d, a=0.005, r=0.1):
    t = tt(d); e = np.ones_like(t)
    na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e

def noise(d):
    return rng.uniform(-1, 1, int(d * SR))

# ---------- instruments ----------
def kick(d=0.45, hard=1.0):
    t = tt(d); f = 46 + 140 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = hp(noise(d), 3000) * np.exp(-t * 300) * 0.3
    return (np.sin(ph) * np.exp(-t * (7 / hard)) + click) * env(d, 0.001, 0.05)

def clap(d=0.25):
    t = tt(d); n = bp(noise(d), 900, 5000)
    e = np.exp(-t * 22) * (1 + 0.6 * (np.sin(2 * np.pi * 90 * t) > 0) * (t < 0.03))
    return n * e

def hat(d=0.07, o=False):
    t = tt(0.22 if o else d)
    return hp(noise(len(t) / SR), 7000) * np.exp(-t * (14 if o else 70))

def pluck(f, d=0.22, bright=1.0):
    t = tt(d)
    s = 0.6 * sawtooth(2 * np.pi * f * t) + 0.4 * square(2 * np.pi * f * 1.003 * t, 0.3)
    return lp(s, 900 + 2600 * bright) * np.exp(-t * 11) * env(d, 0.002, 0.03)

def bassnote(f, d=0.28):
    t = tt(d)
    s = lp(sawtooth(2 * np.pi * f * t) + 0.3 * sawtooth(2 * np.pi * f * 1.01 * t), 420) + 0.8 * np.sin(2 * np.pi * f / 2 * t)
    return s * env(d, 0.004, 0.06) * (0.7 + 0.3 * np.exp(-t * 6))

def padchord(fs, d, cut=1400, a=0.6, r=0.9):
    t = tt(d); s = np.zeros_like(t)
    for f in fs:
        for dt in (-0.006, 0, 0.007):
            s += sawtooth(2 * np.pi * f * (1 + dt) * t + rng.uniform(0, 6))
    return lp(s / (len(fs) * 3), cut, 2) * env(d, a, r)

def sine(f, d, dec=4.0):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * env(d, 0.002, 0.02)

def blip(f, d=0.06):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.3 * square(2 * np.pi * f * 2 * t)) * np.exp(-t * 60)

def chime(f, d=1.2):
    t = tt(d); return sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + k * 2)) / k for k in (1, 2, 3, 4.01)) * env(d, 0.002, 0.1)

def sweep(f0, f1, d, kind='sin', dec=0.0):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) if kind == 'sin' else sawtooth(ph)
    return s * np.exp(-t * dec) * env(d, 0.01, 0.05)

def whoosh(d, up=True, lo=300, hi=6000):
    n = noise(d); t = tt(d); out = np.zeros_like(n); seg = int(0.02 * SR)
    for i in range(0, len(n), seg):
        p = i / len(n); p = p if up else 1 - p
        fc = lo * (hi / lo) ** p
        out[i:i + seg] = bp(n[max(0, i - 2048):i + seg], fc * 0.7, min(fc * 1.4, SR / 2 - 100))[-len(n[i:i + seg]):]
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** (2 if up else 1)
    if up: shape = (t / d) ** 2
    return out * shape

def boom(d=3.0, f0=70, f1=30):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t * 3)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 1.4) + lp(noise(d), 1800) * np.exp(-t * 3) * 0.6

def crush(x, bits=4, hold=8):
    y = np.repeat(x[::hold], hold)[: len(x)]
    q = 2 ** bits
    return np.round(y * q) / q

NOTE = {'A1': 55.0, 'A2': 110.0, 'F2': 87.31, 'C3': 130.81, 'G2': 98.0, 'D2': 73.42, 'E2': 82.41, 'Bb1': 58.27}
CH = {'Am': [220.0, 261.63, 329.63], 'F': [174.61, 220.0, 261.63], 'C': [261.63, 329.63, 392.0], 'G': [196.0, 246.94, 293.66], 'Em': [164.81, 196.0, 246.94]}
BASS = {'Am': 110.0, 'F': 87.31, 'C': 130.81, 'G': 98.0, 'Em': 82.41}
BEAT = 0.6; BAR = 2.4

# ---------- 0–7.5 BOOT ----------
add(fx, 0.0, lp(noise(7.6), 300) * env(7.6, 2.5, 1.5), 0.25)
add(pad, 0.0, (np.sin(2 * np.pi * 55 * tt(7.6)) + 0.5 * np.sin(2 * np.pi * 82.5 * tt(7.6))) * env(7.6, 1.5, 1.2), 0.35)
add(sfx, 0.15, sweep(80, 2400, 0.6) * 0.5, 0.5)
add(sfx, 0.72, hp(noise(0.3), 2000) * np.exp(-tt(0.3) * 20), 0.25)
for a, txt in [(1.0, '> relayworks://night-shift --watch'), (1.7, '> agents online ........ 2,481,904'), (2.4, '> job RW-024 · enrich_customers.csv'), (3.1, '> status ............... RUNNING ▮')]:
    for k in range(len(txt)):
        if txt[k] != ' ':
            add(sfx, a + k / 55, hp(noise(0.02), 3000) * np.exp(-tt(0.02) * 200), 0.12 + 0.05 * rng.random(), rng.uniform(-.3, .3))
for at in (3.7, 5.2):
    add(sfx, at, sine(48, 1.5, 2.5), 0.6)
    add(pad, at, padchord(CH['Am'] if at < 5 else CH['F'], 2.6, 2200, 0.05, 1.5), 0.35)

# ---------- 7.5–20 NIGHT SHIFT groove ----------
prog = ['Am', 'F', 'C', 'G']
t0 = 7.8
for bi in range(5):
    bs = t0 + bi * BAR; ch = prog[bi % 4]
    if bs >= 20.0: break
    d = min(BAR, 20.0 - bs)
    add(pad, bs, padchord(CH[ch], d + 0.3, 1100, 0.3, 0.4), 0.28)
    for b in range(4):
        tb = bs + b * BEAT
        if tb < 20.0:
            add(drums, tb, kick(0.4, 0.8), 0.55)
            add(drums, tb + BEAT / 2, hat(), 0.10, 0.3)
    for k in range(16):
        tk = bs + k * BEAT / 4
        if tk < 19.95:
            f = CH[ch][[0, 1, 2, 1][k % 4]] * (2 if k % 8 >= 4 else 1)
            add(arp, tk, pluck(f, 0.18, 0.35 + 0.5 * bi / 5), 0.16, -0.4 if k % 2 else 0.4)
    for b in range(8):
        tb = bs + b * BEAT / 2
        if tb < 20.0:
            add(bass, tb, bassnote(BASS[ch] / 2, 0.26), 0.3)
# row ticks (same formula as the visuals)
prev = 0
for i in range(int(9.4 * SR / 441), int(19.7 * SR / 441)):
    t = i * 441 / SR; p = (t - 9.4) / (19.7 - 9.4)
    n = min(70, int(70 * (1 - (1 - p) ** 1.5)))
    if n > prev:
        add(sfx, t, blip(1400 + 12 * n), 0.07, rng.uniform(-.5, .5)); prev = n
add(sfx, 12.2, sine(660, 0.3, 10) + sine(990, 0.3, 12), 0.12)  # bubble pop

# ---------- 20–30 ROW 71 ----------
gl = crush(noise(0.9) * np.exp(-tt(0.9) * 3), 3, 30)
add(sfx, 20.0, gl, 0.45)
add(sfx, 20.0, boom(1.6, 120, 40), 0.55)
for k in range(12):
    at = 20.4 + k * 0.25
    add(sfx, at, lp(square(2 * np.pi * (880 if k % 2 == 0 else 660) * tt(0.22)), 3000) * env(0.22, 0.005, 0.03), 0.10, 0.2 if k % 2 else -0.2)
dr = tt(10.0)
add(pad, 20.0, (lp(sawtooth(2 * np.pi * 55 * dr) + sawtooth(2 * np.pi * 58.27 * dr), 260) * env(10.0, 0.8, 1.5)), 0.30)
add(sfx, 21.6, sine(520, 0.25, 12), 0.12)  # brb pop
add(sfx, 23.3, crush(noise(1.0) * np.exp(-tt(1.0) * 2.5), 3, 40), 0.35)
add(sfx, 23.4, sweep(420, 28, 1.1, 'saw') * np.exp(-tt(1.1) * 0.6), 0.25)
add(sfx, 23.95, kick(0.6, 1.4), 0.7)
add(sfx, 24.3, kick(0.4, 1.0), 0.3)
for k in range(8):
    at = 24.6 + k * 0.62
    add(drums, at, kick(0.35, 0.6), 0.22); add(drums, at + 0.17, kick(0.3, 0.5), 0.13)
add(sfx, 26.9, boom(2.2, 90, 32), 0.7); add(sfx, 26.9, hp(noise(0.5), 1500) * np.exp(-tt(0.5) * 9), 0.35)
add(sfx, 29.55, crush(noise(0.6) * np.exp(-tt(0.6) * 4), 3, 30), 0.3)

# ---------- 30–37.6 THE USUAL FIX ----------
d = 7.62
od = tt(d)
dr = lp(sawtooth(2 * np.pi * 73.42 * od) + sawtooth(2 * np.pi * 77.78 * od) + 0.5 * sawtooth(2 * np.pi * 36.71 * od), 200) * env(d, 0.6, 0.02)
dr *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.7 * od)
add(pad, 30.0, dr, 0.36)
add(sfx, 30.2, whoosh(1.1, True, 200, 3000), 0.35)
add(sfx, 31.25, boom(1.5, 80, 35), 0.45)
add(sfx, 31.6, sine(330, 0.3, 10) + sine(495, 0.3, 12), 0.12)
for k in range(70):
    at = 32.6 + k * (3.0 / 70)
    add(sfx, at, blip(1800 - k * 18, 0.05), 0.07, rng.uniform(-.4, .4))
for k in range(int((37.6 - 33.0) / 0.3)):
    add(drums, 33.0 + k * 0.3 * (1 - k * 0.012), kick(0.3, 0.6), 0.18 + k * 0.012)
add(fx, 35.4, whoosh(2.2, True, 200, 9000), 0.55)
add(fx, 35.4, sweep(120, 900, 2.22, 'saw') * (tt(2.22) / 2.22) ** 2, 0.12)

# ---------- 38–46 DON'T PRESS RESTART / BRAND ----------
add(sfx, 38.0, boom(3.5, 65, 28), 0.95)
add(sfx, 38.0, lp(noise(2.0), 4000) * np.exp(-tt(2.0) * 2.2), 0.45)
for i, ch in enumerate("Don't press restart."):
    if ch != ' ':
        add(sfx, 38.1 + i * 0.045, blip(2200 + 40 * i, 0.04), 0.08, rng.uniform(-.5, .5))
add(pad, 38.3, padchord([110.0, 164.81, 220.0, 246.94, 329.63], 2.6, 900, 0.4, 1.2), 0.3)
add(fx, 40.0, whoosh(0.95, True, 400, 8000), 0.45)
add(sfx, 40.95, boom(3.0, 90, 40), 0.7)
add(pad, 40.95, padchord([174.61, 261.63, 329.63, 440.0, 523.25], 5.2, 2600, 0.02, 2.0), 0.36)
for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
    add(sfx, 41.0 + k * 0.08, chime(f, 1.6), 0.07, -0.5 + k * 0.33)
for b in range(int((46.0 - 41.6) / (BEAT / 2))):
    tb = 41.6 + b * BEAT / 2
    add(drums, tb, hat(), 0.05 + 0.1 * b / 15, 0.3)
    if b % 2 == 0: add(bass, tb, bassnote(87.31 / 2 if tb < 44 else 98.0 / 2, 0.28), 0.2 + 0.1 * b / 15)
for k, at in enumerate([43.1, 43.4, 43.7]):
    add(sfx, at, blip(1200 + k * 300, 0.06), 0.1)
add(fx, 44.8, whoosh(1.2, True, 300, 9000), 0.35)

# ---------- 46–76 THE RESCUE: full drive ----------
s0 = 46.0
for bi in range(13):
    bs = s0 + bi * BAR; ch = prog[bi % 4]
    if bs >= 76.0: break
    d = min(BAR, 76.0 - bs)
    add(pad, bs, padchord(CH[ch], d + 0.2, 1600, 0.05, 0.3), 0.2)
    for b in range(4):
        tb = bs + b * BEAT
        if tb >= 76.0: break
        add(drums, tb, kick(0.42, 1.0), 0.8)
        if b % 2 == 1: add(drums, tb, clap(), 0.32, 0.05)
    for k in range(16):
        tk = bs + k * BEAT / 4
        if tk >= 76.0: break
        add(drums, tk, hat(o=(k % 4 == 2)), 0.08 if k % 2 else 0.12, 0.35)
        f = CH[ch][[0, 2, 1, 2][k % 4]] * (4 if k % 8 >= 6 else 2)
        add(arp, tk, pluck(f, 0.16, 0.8), 0.12, -0.45 if k % 2 else 0.45)
        if k % 2 == 0:
            add(bass, tk, bassnote(BASS[ch] / 2 * (2 if k % 8 == 6 else 1), 0.25), 0.36)
for i in range(6):
    at = 46.0 + i * 5
    add(fx, at - 0.45, whoosh(0.5, True, 600, 9000), 0.22)
    add(sfx, at, chime(880 * (1 + i * 0.122), 0.8), 0.08)
# step cues
add(sfx, 49.7, boom(1.0, 120, 50), 0.4); add(sfx, 49.7, chime(1318.5, 1.0), 0.08)
for k in range(70):
    add(sfx, 47.0 + k * (2.6 / 70), blip(2400 + 6 * k, 0.03), 0.04, rng.uniform(-.5, .5))
add(sfx, 51.8, blip(900, 0.08), 0.1); add(sfx, 52.7, chime(1568.0, 1.0) + chime(2093.0, 1.0) * 0.6, 0.1)
add(sfx, 55.7, chime(1760.0, 1.0), 0.1)
for k in range(3): add(sfx, 56.4 + k * 0.25, blip(1000 + k * 250, 0.07), 0.1)
add(sfx, 58.2, chime(1318.5, 1.2) + chime(1975.5, 1.2) * 0.7, 0.13)
add(sfx, 58.6, whoosh(0.5, True, 500, 6000), 0.12)
for k in range(30):
    add(sfx, 61.6 + k * (3.8 / 30), blip(1200 + 30 * k, 0.05), 0.08, rng.uniform(-.4, .4))
for k in range(4):
    add(sfx, 66.9 + k * 0.75, chime([1046.5, 1318.5, 1568.0, 2093.0][k], 0.9), 0.11)
add(sfx, 69.9, boom(1.2, 110, 45), 0.45); add(sfx, 69.9, hp(noise(0.3), 1500) * np.exp(-tt(0.3) * 12), 0.2)
add(sfx, 72.3, hp(noise(0.03), 2000) * np.exp(-tt(0.03) * 150), 0.4); add(sfx, 72.3, sine(1200, 0.08, 40), 0.15)
for i in range(5):
    add(sfx, 72.7 + i * 0.28 + 0.9, chime(2637.0 + i * 120, 0.6), 0.09, 0.4)
add(sfx, 74.1, whoosh(0.5, False, 400, 5000), 0.15); add(sfx, 74.2, chime(1046.5, 1.4) + chime(1568.0, 1.4), 0.09)
add(fx, 74.6, whoosh(1.4, True, 300, 9000), 0.3)

# ---------- 76–83 THE ENDING ----------
prog2 = ['C', 'G', 'Am', 'F']
for bi in range(3):
    bs = 76.0 + bi * BAR; ch = prog2[bi % 4]; d = min(BAR, 83.0 - bs)
    add(pad, bs, padchord([f * 1 for f in CH[ch]] + [CH[ch][0] * 2], d + 0.4, 2400, 0.05, 0.5), 0.26)
    for b in range(4):
        tb = bs + b * BEAT
        if tb >= 83.0: break
        add(drums, tb, kick(0.4, 0.9), 0.55 if b % 2 == 0 else 0.3)
        add(drums, tb + BEAT / 2, hat(), 0.08, 0.3)
    for k in range(8):
        tk = bs + k * BEAT / 2
        if tk >= 82.9: break
        add(arp, tk, pluck(CH[ch][[0, 1, 2, 1][k % 4]] * 2, 0.3, 0.6), 0.11, -0.4 if k % 2 else 0.4)
        add(bass, tk, bassnote(BASS[ch] / 2, 0.26), 0.26)
add(sfx, 76.0, boom(2.0, 80, 40), 0.5)
for i in range(4):
    add(sfx, 76.9 + i * 0.35, blip(900 + i * 220, 0.2) + sine(1800 + i * 440, 0.2, 14) * 0.4, 0.12)
add(sfx, 77.8, sine(660, 0.3, 10) + sine(990, 0.3, 12), 0.12)
add(sfx, 80.3, sine(392, 0.5, 4) * 0.5, 0.1)

# ---------- 83–90 OUTRO ----------
add(sfx, 83.1, boom(4.0, 75, 32), 0.75)
add(pad, 83.1, padchord([87.31, 174.61, 261.63, 329.63, 440.0, 523.25], 6.9, 2200, 0.02, 4.5), 0.42)
for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0, 2637.0]):
    add(sfx, 83.2 + k * 0.1, chime(f, 2.5), 0.06, -0.6 + k * 0.3)
add(sfx, 84.0, blip(1200, 0.08), 0.08); add(sfx, 84.8, blip(1500, 0.08), 0.06)
add(sfx, 86.1, chime(1568.0, 1.5) + chime(2349.3, 1.5) * 0.6, 0.12)
add(sfx, 86.6, chime(2093.0, 1.5), 0.07)

# ---------- mix ----------
arp = np.stack([lp(arp[0], 5000), lp(arp[1], 5000)])
mix = drums * 1.0 + bass * 0.9 + arp * 0.9 + pad * 0.85 + fx * 0.8 + sfx * 1.0
# sidechain-ish duck under kicks in the rescue section
ir_t = tt(2.4)
ir = rng.normal(0, 1, (2, len(ir_t))) * np.exp(-ir_t * 2.6)
ir = np.stack([lp(ir[0], 6000), lp(ir[1], 6000)])
send = arp * 0.5 + pad * 0.4 + sfx * 0.35 + drums * 0.08
rev = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)])
rev /= np.max(np.abs(rev)) + 1e-9
mix = mix + rev * np.max(np.abs(mix)) * 0.18
mix = hp(mix, 25)
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
fade_in = np.clip(np.arange(N) / (0.05 * SR), 0, 1)
fade_out = np.clip((DUR - np.arange(N) / SR) / 0.8, 0, 1)
mix *= fade_in * fade_out * 0.92
pcm = (mix.T * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav')
