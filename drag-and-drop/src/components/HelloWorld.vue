<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { Buffer } from 'buffer';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      images: []
    }
  },
  methods: {
    async getImages() {
      const results = await fetch(
      `https://api.cloudinary.com/v1_1/milecia/resources/image`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(
            "655265275423931" +
              ":" +
              "_8Gz0JXpM1OpirsIRuaA4bWqDvI"
          ).toString("base64")}`,
        },
        mode: 'no-cors'
      }
      ).then((r) => r.json());

      const { resources } = results;

      this.images = resources.map((resource) => ({
        url: resource.secure_url,
        description: resource.public_id,
      }));

      console.log(this.images)
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
