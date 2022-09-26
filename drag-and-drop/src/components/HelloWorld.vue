<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <draggable
      :list="images"
      item-key="title"
      @start="drag=true"
      @end="drag=false"
    >
      <template #item="{element}">
        <div>
          <img :src="element.url" width="150" height="150" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
      draggable,
  },
  data() {
    return {
      drag: false,
      images: []
    }
  },
  methods: {
    async getImages() {
      await fetch("http://localhost:3004/images").then(async (data) => {
        const imageData = (await data.json()).images;
        this.images = imageData;
      });
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    this.getImages()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
