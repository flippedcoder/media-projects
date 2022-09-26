import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [images, setImages] = useState<any>([]);

  const fetchImages = async () => {
    await fetch("http://localhost:3003/images").then(async (data) => {
      const imageData = (await data.json()).images;
      setImages(imageData);
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {images.length !== 0 ? (
        images.map((image: any) => (
          <Image
            source={{ uri: image.url }}
            key={image.title}
            style={styles.logo}
          />
        ))
      ) : (
        <div></div>
      )}
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logo: {
    width: 150,
    height: 150,
    margin: "12px",
  },
});
