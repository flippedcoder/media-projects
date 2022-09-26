import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import {
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from "react-native-image-picker";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({}: RootTabScreenProps<"TabOne">) {
  const [image, setImage] = useState<any>();

  const pickImage = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 1 as PhotoQuality,
    };

    launchImageLibrary(options, (res) => {
      if (res.errorCode) return;

      if (res.assets) {
        const imageData = {
          dataUri: res.assets[0].base64 || "",
          name: res.assets[0].fileName || "image",
        };

        setImage(imageData);
      }
    });
  };

  const uploadImage = async (image: any) => {
    const dataUrl = image?.dataUri || "";

    const uploadApi = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "cwt1qiwn");

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    });
  };

  useEffect(() => {
    uploadImage(image);
  }, [image]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an image here</Text>
      <View style={styles.separator} />
      {image && (
        // @ts-ignore
        <Image source="" style={{ width: 300, height: 300 }} />
      )}
      <Button title="Upload Photo" onPress={pickImage} />
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
});
