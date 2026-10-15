"""Turn raw job photos into Instagram-ready media for posts that don't have any yet.

Drop 1 to 3 photos per post into instagram/photos/ named by post number, for example
post31_1.jpg, post31_2.jpg, post31_3.jpg (in the order they should appear), then push.
The "Instagram media" workflow runs this script and commits the results.

Carousel: 1080x1350 JPEGs, hook text on slide 1.
Photo:    one 1080x1350 JPEG with the hook text.
Reel:     1080x1920 H.264 MP4 with a slow push-in on each photo, the hook on screen for the
          first shot, and an SBC end card. Needs ffmpeg on the PATH.

Usage: python3 instagram/tools/build_media.py            (build every post that has photos but no media)
       python3 instagram/tools/build_media.py --force 31 (rebuild one post)
"""
import json, os, subprocess, sys, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONTS = os.path.join(ROOT, "fonts")
MANIFEST = os.path.join(ROOT, "posts.json")
PHOTOS = os.path.join(ROOT, "photos")
MEDIA = os.path.join(ROOT, "media")

INK = (15, 35, 28)
BRASS = (200, 150, 62)
BRASS_LT = (227, 194, 131)
WHITE = (255, 255, 255)


def font(weight, size):
    name = {"cond900": "barlow-condensed-latin-900-normal.ttf", "cond700": "barlow-condensed-latin-700-normal.ttf",
            "body600": "barlow-latin-600-normal.ttf"}[weight]
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def cover(img, w, h):
    img = ImageOps.exif_transpose(img).convert("RGB")
    return ImageOps.fit(img, (w, h), Image.LANCZOS, centering=(0.5, 0.5))


def wrap_to_width(draw, text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=f) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_hook(draw, text, max_w, max_lines, start=118, floor=60):
    size = start
    while size >= floor:
        f = font("cond900", size)
        lines = wrap_to_width(draw, text.upper(), f, max_w)
        if len(lines) <= max_lines:
            return f, lines
        size -= 4
    f = font("cond900", floor)
    return f, wrap_to_width(draw, text.upper(), f, max_w)


def gradient(w, h, top_alpha=0, bottom_alpha=230, start_frac=0.35):
    g = Image.new("L", (1, h), 0)
    for y in range(h):
        t = (y / h - start_frac) / (1 - start_frac)
        t = max(0.0, min(1.0, t))
        g.putpixel((0, y), int(top_alpha + (bottom_alpha - top_alpha) * (t ** 1.4)))
    return g.resize((w, h))


def wordmark(draw, x, y, scale=1.0, align="left", w_canvas=1080):
    f1 = font("cond900", int(34 * scale))
    f2 = font("body600", int(15 * scale))
    s1 = "STANDARD"
    s2 = "BUILDING COMPANY"
    w1 = draw.textlength(s1, font=f1)
    track = 3.2 * scale
    w2 = sum(draw.textlength(c, font=f2) for c in s2) + track * (len(s2) - 1)
    gap = 12 * scale
    total = w1 + gap + 2 * scale + gap + w2
    if align == "center":
        x = (w_canvas - total) / 2
    b = draw.textbbox((0, 0), s1, font=f1)
    cap = b[3] - b[1]
    draw.text((x, y - b[1]), s1, font=f1, fill=WHITE)
    rx = x + w1 + gap
    draw.rectangle([rx, y - 2 * scale, rx + 2 * scale, y + cap + 2 * scale], fill=BRASS)
    cx = rx + 2 * scale + gap
    b2 = draw.textbbox((0, 0), "B", font=f2)
    ty = y + (cap - (b2[3] - b2[1])) / 2 - b2[1]
    for c in s2:
        draw.text((cx, ty), c, font=f2, fill=BRASS_LT)
        cx += draw.textlength(c, font=f2) + track


def hook_slide(photo, hook, w=1080, h=1350, max_lines=4):
    base = cover(photo, w, h)
    shade = Image.new("RGB", (w, h), INK)
    base = Image.composite(shade, base, gradient(w, h, 0, 235, 0.30))
    d = ImageDraw.Draw(base)
    pad = 72
    f, lines = fit_hook(d, hook, w - 2 * pad, max_lines)
    lh = int(f.size * 0.98)
    block = lh * len(lines)
    bottom = h - 150
    y0 = bottom - block
    d.rectangle([pad, y0 - 34, pad + 120, y0 - 26], fill=BRASS)
    for i, ln in enumerate(lines):
        b = d.textbbox((0, 0), ln, font=f)
        d.text((pad, y0 + i * lh - b[1]), ln, font=f, fill=WHITE)
    wordmark(d, pad, h - 92, 0.9)
    return base


def plain_slide(photo, w=1080, h=1350):
    return cover(photo, w, h)


def end_card(w=1080, h=1920):
    img = Image.new("RGB", (w, h), INK)
    d = ImageDraw.Draw(img)
    f = font("cond900", 190)
    for i, (s, col) in enumerate((("STANDARD", WHITE), ("BUILDING", BRASS_LT))):
        tw = d.textlength(s, font=f)
        b = d.textbbox((0, 0), s, font=f)
        y = 700 + i * 230
        d.text(((w - tw) / 2, y - b[1]), s, font=f, fill=col)
    tw = d.textlength("STANDARD", font=f)
    d.rectangle([(w - tw) / 2, 905, (w + tw) / 2, 917], fill=BRASS)
    f2 = font("cond700", 64)
    for i, s in enumerate(("DESIGN. PRICE. BUILD.", "(970) 430-5884")):
        tw = d.textlength(s, font=f2)
        d.text(((w - tw) / 2, 1230 + i * 95), s, font=f2, fill=WHITE if i else BRASS_LT)
    f3 = font("body600", 36)
    s = "standardbuildingcompany.net"
    tw = d.textlength(s, font=f3)
    d.text(((w - tw) / 2, 1440), s, font=f3, fill=(200, 205, 200))
    return img


def reel_frames(photos, hook, tmp):
    """Write per-shot stills at 1.15x size for a zoompan push-in; shot 1 carries the hook."""
    W, H = 1080, 1920
    paths = []
    for i, ph in enumerate(photos):
        im = cover(ph, W, H)
        if i == 0:
            shade = Image.new("RGB", (W, H), INK)
            im = Image.composite(shade, im, gradient(W, H, 0, 225, 0.30))
            d = ImageDraw.Draw(im)
            pad = 80
            f, lines = fit_hook(d, hook, W - 2 * pad, 5, start=124)
            lh = int(f.size * 0.98)
            y0 = 1360 - lh * len(lines)
            d.rectangle([pad, y0 - 36, pad + 130, y0 - 27], fill=BRASS)
            for j, ln in enumerate(lines):
                b = d.textbbox((0, 0), ln, font=f)
                d.text((pad, y0 + j * lh - b[1]), ln, font=f, fill=WHITE)
            wordmark(d, pad, 1430, 1.0)
        p = os.path.join(tmp, f"s{i}.png")
        im.save(p)
        paths.append(p)
    p = os.path.join(tmp, "end.png")
    end_card().save(p)
    paths.append(p)
    return paths


def make_reel(photos, hook, out_path):
    fps = 30
    with tempfile.TemporaryDirectory() as tmp:
        stills = reel_frames(photos, hook, tmp)
        durs = [4.0] + [3.0] * (len(stills) - 2) + [2.5]
        clips = []
        for i, (s, dur) in enumerate(zip(stills, durs)):
            n = int(dur * fps)
            c = os.path.join(tmp, f"c{i}.mp4")
            if i == len(stills) - 1:
                vf = "scale=1080:1920,format=yuv420p"
            else:
                # gentle push-in from 1.0 to 1.08
                vf = (f"scale=2160:3840,zoompan=z='1+0.08*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                      f":d={n}:s=1080x1920:fps={fps},format=yuv420p")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", s, "-t", str(dur), "-vf", vf,
                            "-r", str(fps), "-c:v", "libx264", "-preset", "medium", "-crf", "20", c], check=True)
            clips.append(c)
        lst = os.path.join(tmp, "list.txt")
        open(lst, "w").write("".join(f"file '{c}'\n" for c in clips))
        total = sum(durs)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst,
                        "-f", "lavfi", "-t", str(total), "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                        "-profile:v", "high", "-level", "4.1", "-c:a", "aac", "-b:a", "128k", "-shortest",
                        "-movflags", "+faststart", out_path], check=True)


def build_post(p, photo_paths, outdir):
    photos = [Image.open(f) for f in photo_paths]
    tag = f"{p['n']:02d}"
    if p["type"] == "REELS":
        out = os.path.join(outdir, f"post{tag}_reel.mp4")
        make_reel(photos, p["hook"], out)
        return [out]
    if p["type"] == "IMAGE":
        out = os.path.join(outdir, f"post{tag}_1.jpg")
        hook_slide(photos[0], p["hook"]).save(out, quality=92)
        return [out]
    outs = []
    for i, ph in enumerate(photos):
        out = os.path.join(outdir, f"post{tag}_{i + 1}.jpg")
        (hook_slide(ph, p["hook"]) if i == 0 else plain_slide(ph)).save(out, quality=92)
        outs.append(out)
    return outs


def photos_for(n):
    if not os.path.isdir(PHOTOS):
        return []
    names = sorted(f for f in os.listdir(PHOTOS)
                   if f.lower().startswith(f"post{n:02d}_") and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    return [os.path.join(PHOTOS, f) for f in names][:10]


def main(argv):
    force = {int(a) for a in argv[argv.index("--force") + 1:]} if "--force" in argv else set()
    manifest = json.load(open(MANIFEST))
    os.makedirs(MEDIA, exist_ok=True)
    changed = 0
    for p in manifest["posts"]:
        if p["media"] and p["n"] not in force:
            continue
        src = photos_for(p["n"])
        if not src:
            continue
        outs = build_post(p, src, MEDIA)
        p["media"] = [os.path.basename(o) for o in outs]
        changed += 1
        print(f"post {p['n']}: built {p['media']} from {len(src)} photo(s)")
    if changed:
        with open(MANIFEST, "w") as fh:
            json.dump(manifest, fh, indent=1, ensure_ascii=False)
            fh.write("\n")
    print(f"{changed} post(s) built")


if __name__ == "__main__":
    main(sys.argv[1:])
