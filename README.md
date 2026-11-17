# 🍥Fuwari-ng  
![Node.js >= 22.12](https://img.shields.io/badge/node.js-%3E%3D22.12-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
![Vue version](https://img.shields.io/npm/v/vue?logo=vuedotjs&label=Vue)
![Astro version](https://img.shields.io/npm/v/astro?logo=astro&label=Astro)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-nochilli%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/nochilli/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

## Added Features

- **Repository cards** for GitHub, Codeberg, GitLab, Bitbucket, and Gitea. Other HTTPS repository links render a basic card. GitHub cards can show funding links from `.github/FUNDING.yml`, with service-specific icons.
- **Repository API caching** in the browser: metadata and funding data are cached for 24 hours. Cached data can be used for up to 30 days when an API is rate-limited or temporarily unavailable.
- **YouTube embeds** with lazy-loaded, privacy-enhanced playback.
- **Recent changes** can display filtered Conventional Commit entries and breaking-change badges when a `public/changelog.json` file is available.
- **Date handling:** switched to post frontmatter dates in `DD-MM-YYYY` format. Dates display as `Mon D` in the archive and `Mon D YYYY` on posts.
- **UI refinements:** include button-style post tags, show profile only in about page, footer formatting etc..
- **Renamed `/archive/`** to `/posts/`
- **Maple mono** monospace font
  
## Embedding components in posts

Posts that import Astro components should use the `.mdx` format.

### Git repository

```mdx
import GitRepo from "../../components/GitRepo.astro"

<GitRepo url="https://github.com/owner/repository" />
```

GitHub funding links are read from the repository's `.github/FUNDING.yml`. Supported entries include: GitHub Sponsors, LFX/Community Bridge, IssueHunt, Ko-fi, Liberapay, Open Collective, Patreon, Tidelift, Polar, Buy Me a Coffee, thanks.dev, and custom links.

### YouTube video

Use either a video ID or a YouTube URL:

```mdx
import YoutubePlayer from "../../components/YoutubePlayer.astro"

<YoutubePlayer videoId="abcdefghijk" />
<YoutubePlayer videoURL="https://youtu.be/abcdefghijk" title="Video title" />
```

### Post dates

New posts can be created with `pnpm new-post <filename>`. The generated `published` date uses `DD-MM-YYYY`:

```yaml
published: 15-11-2026
```

## 📄 License

This project is licensed under the MIT License. Contains MIT licensed Astro components from [Dylancyclone](https://github.com/Dylancyclone/ansible-homelab-orchestration/tree/main/docs/src/components) 

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)
