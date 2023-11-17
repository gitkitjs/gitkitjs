<script lang="ts">
  import { page } from '$app/stores';
  import { icons } from '$lib/icons';
  import { clsx } from 'clsx';

  // menu
  import ZeroIcon from '$lib/components/icons/Zero.svelte';
  import MenuIcon from '$lib/components/icons/Menu.svelte';
  import XIcon from '$lib/components/icons/X.svelte';
  import { slide } from 'svelte/transition';

  import type { Config } from '$lib/stores/model';
  export let config: Config;

  let path: string;
  $: path = $page.url.pathname;

  let sc: boolean;
  $: sc = config?.theme === 'SiliconCompiler';

  let navlinks: typeof config.navlinks;
  $: navlinks = config?.navlinks?.filter((link) => !link.previewOnly || config?.preview);

  let docslinks: typeof config.docslinks;
  $: docslinks = config?.docslinks?.filter((link) => !link.previewOnly || config?.preview);

  let showNav: boolean = false;
  function toggleNav() {
    showNav = !showNav;
    try {
      scrollTo(0, 0);
    } catch (e) {}
  }
  function hideNav() {
    showNav = false;
  }
</script>

<nav
  class="sticky top-0 z-20 flex flex-row justify-between px-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-black"
>
  <a
    href="/"
    title="Home"
    on:click={hideNav}
    class="order-2 pt-3 pb-2 border-b-2 border-transparent hover:border-orange-400"
  >
    {#if sc}
      <img
        src="/images/siliconcompiler.webp"
        alt="SiliconCompiler"
        class="w-[304px] h-[83px] object-scale-down"
      />
    {:else}
      <ZeroIcon class="h-[24px] w-[100px]" />
    {/if}
  </a>
  {#if navlinks?.length}
    <button
      title="Toggle main menu"
      on:click={toggleNav}
      aria-label="Menu"
      class="md:hidden order-1 mt-2 pb-1 border-b-2 border-transparent hover:border-orange-400"
    >
      {#if showNav}
        <XIcon class="w-8 h-8" />
      {:else}
        <MenuIcon class="w-8 h-8" />
      {/if}
    </button>
    <div class="hidden md:flex order-3 flex-grow justify-end items-end">
      {#each navlinks as link}
        <a
          href={link.href}
          title={link.icon ? link.text : ''}
          class={clsx(
            'mb-2 mr-4 font-display text-sm dark:text-sky-400',
            'border-b-2 border-transparent hover:border-orange-400',
            path.startsWith(link.href) ? 'border-orange-400' : ''
          )}
        >
          {#if link.icon}
            <svelte:component this={icons[link.icon]} class="h-6 w-6 mb-1" />
          {:else}
            {link.text}
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</nav>

{#if showNav && navlinks?.length}
  <nav
    transition:slide
    class="flex flex-col font-display leading-8 bg-slate-50 dark:text-slate-200 dark:bg-slate-900"
  >
    {#each navlinks as link}
      <a
        href={link.href}
        class="block py-[2px] px-3 m-[2px] hover:underline dark:text-sky-400 border-b dark:border-slate-800"
        on:click={toggleNav}
      >
        {link.text}</a
      >
      {#if link.href === '/docs' && docslinks?.length}
        {#each docslinks as link}
          <a
            href={link.href}
            class="block py-[2px] px-10 m-[2px] hover:underline dark:text-sky-400 border-b dark:border-slate-800"
            on:click={toggleNav}
          >
            {link.text}</a
          >
        {/each}
      {/if}
    {/each}
  </nav>
{/if}

{#if path.startsWith('/docs') && docslinks}
  <nav
    class="sticky top-[47px] z-20 hidden md:flex flex-row items-end flex-wrap pl-[14px] pr-2 pt-1 gap-x-3 bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-black"
  >
    <a
      href="/docs"
      title="Chiplets"
      class={clsx(
        'hover:underline pb-1 font-display',
        path === '/docs'
          ? 'font-semibold text-sky-500'
          : 'text-slate-500 hover:text-sky-500 dark:text-slate-400'
      )}
    >
      <svelte:component this={icons['CircuitBoard']} class="h-6 w-6" />
    </a>
    {#each docslinks as link}
      <a
        href={link.href}
        class={clsx(
          'font-display text-sm dark:text-sky-400',
          'border-b-2 border-transparent hover:border-orange-400',
          path.startsWith(link.href) ? 'border-orange-400' : ''
        )}
      >
        {link.text}
     </a>
    {/each}
  </nav>
{/if}
