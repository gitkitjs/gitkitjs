---
title: Menus
---

# Menu configuration

Links and icons in the main menu are configured in the frontmatter of `index.md`. E.g.

![sub-menu screenshot](images/menu.png)

```yaml
icon:
  image: 💥
  text: gitkitjs

navlinks:
  - text: Guide
    href: /guide/quickstart
  - text: Blog
    href: /blog
  - text: GitHub
    href: https://github.com/gitkitjs/gitkitjs
    icon: GitHub
```

### Icons

An `icon` can be an emoji (like 💥), or the name of an Icon component (like `GitHub`), or the name of an image file. Instead of a string, an `icon` can also be a map (object) with an `image` string value as above, or a literal `text` value, or both. Literal text is rendered using the `logo` font.

The map may also have a Tailwind `class` string value, e.g. to specify width and height of an image:
```yaml
icon:
  image: images/siliconcompiler.webp
  class: w-[304px] h-[83px] object-scale-down
```

## Small screens

Navlinks will be collapsed behind a "hamburger" menu on small screens. To turn this off, set `mobilemenu: false`.

![mobile menu collapsed screenshot](images/mobile.png)

## Sub-menus

Nested `submenu` links will be expanded horizontally under the main menu bar. E.g.

![sub-menu mobile screenshot](images/za-sub-menu.png)

```yaml
  - href: /chiplets
    text: Chiplets
    submenu:
      icon: CircuitBoard
      links:
        - text: EFABRIC
          href: /chiplets/efabric
          icon: Grid
          image: /chiplets/images/efabric-diagram.svg
        - text: CPU
          href: /chiplets/cpu
          icon: Cpu
          image: /chiplets/images/cpu-diagram.svg
        - text: FPGA
          href: /chiplets/fpga
          icon: CircuitBoard
          image: /chiplets/images/fpga-diagram.svg
        - text: AI
          href: /chiplets/ai
          icon: BrainCircuit
          image: /chiplets/images/ai-diagram.svg
```


