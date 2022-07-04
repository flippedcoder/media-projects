<script lang="ts">
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  let images = [];

  onMount(async () => {
    const results = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.CLOUDINARY_API_KEY +
              ":" +
              process.env.CLOUDINARY_API_SECRET
          ).toString("base64")}`,
        },
      }
    ).then((r) => r.json());

    const { resources } = results;

    images = resources.map((resource) => ({
      url: resource.secure_url,
      description: resource.public_id,
    }));
  });

  let currentSlideItem = 0;

  const nextImage = () => {
    currentSlideItem = (currentSlideItem + 1) % images.length;
  };

  const prevImage = () => {
    if (currentSlideItem != 0) {
      currentSlideItem = (currentSlideItem - 1) % images.length;
    } else {
      currentSlideItem = images.length - 1;
    }
  };
</script>

{#if images.length === 0}
  <div>No images to show</div>
{:else}
  <div class="carousel-buttons">
    <button on:click={() => prevImage()}>Previous</button>
    <button on:click={() => nextImage()}>Next</button>
  </div>
  {#each [images[currentSlideItem]] as item (currentSlideItem)}
    <img
      transition:slide
      src={item.url}
      alt={item.description}
      width={400}
      height={300}
    />
  {/each}
{/if}
