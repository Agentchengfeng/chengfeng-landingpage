# chengfeng-landingpage

> An Agent skill for building original video-led homepage heroes.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

`chengfeng-landingpage` turns product material, a personal profile, or a supplied reference into an original full-screen homepage hero: a first frame, a restrained video treatment, and editable HTML UI above the footage. It is for people who want a homepage with a visual world, not a default SaaS layout.

It does not copy a reference site's branding, artwork, prompts, or footage. It also does not silently turn a video-led direction into a static image when a video API is unavailable.

## Quick Start

Requires Node.js 18+ and either Claude Code or Codex.

```sh
npx -y github:Agentchengfeng/chengfeng-landingpage install
```

Restart Claude Code or Codex, then say:

```text
Use chengfeng-landingpage to turn my existing materials into a full-screen homepage hero.
```

Compatibility command:

```sh
npx -y github:Agentchengfeng/chengfeng-landingpage cpm install
```

Check or remove an installation:

```sh
npx -y github:Agentchengfeng/chengfeng-landingpage doctor
npx -y github:Agentchengfeng/chengfeng-landingpage uninstall
```

## How it works

```text
Your profile / product material / reference
                  |
                  v
      Agent extracts the central relationship
                  |
                  v
   Original first frame + locked-camera motion brief
                  |
          +-------+-------+
          |               |
          v               v
  Authorized video API   Any image-to-video service
          |               |
          +-------+-------+
                  |
                  v
     MP4 loop + editable full-screen HTML hero
```

When a configured video API is available and authorized, the Agent can create the loop directly. Otherwise it gives the user the first-frame PNG, a copy-ready image-to-video prompt, and the export specification. The user imports the MP4 after generating it through a service they can access; the Agent then completes the homepage hero.

## What the skill enforces

- A full-viewport video world, not a contained video card.
- A real first-frame asset before motion generation.
- One restrained, semantic movement; locked framing and stable layout.
- Navigation, copy, actions, and accessibility controls as editable DOM.
- A poster and reduced-motion fallback.
- Chinese/CJK typography rules, including embedded font, size, line-height, measure, and browser audit requirements.
- No static-only downgrade when the intended page needs video.

## What gets installed

```text
~/.claude/skills/chengfeng-landingpage/
~/.codex/skills/chengfeng-landingpage -> Claude skill directory
```

Existing copies are backed up before replacement. The package contains instructions and verification tools only; it intentionally excludes API keys, local projects, generated pages, videos, screenshots, fonts, and private logs.

## Repository structure

```text
chengfeng-landingpage/
├── SKILL.md
├── LICENSE
├── NOTICE.md
├── CITATION.cff
├── package.json
├── bin/install.js
└── skills/chengfeng-landingpage/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── references/
    └── assets/tools/
```

## 官方来源 / Community & Support

Created and maintained by **成峰 / AI产品自由**.

- GitHub: [Agentchengfeng](https://github.com/Agentchengfeng) — use Issues for reproducible bugs and installation problems.
- X: [@chengfeng240928](https://x.com/chengfeng240928) — updates and experiments.
- 小红书 / 公众号 / B站 / 抖音 / 视频号：AI产品自由。

## License & attribution

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md). When using, translating, redistributing, or adapting this project, retain the attribution and notice.
