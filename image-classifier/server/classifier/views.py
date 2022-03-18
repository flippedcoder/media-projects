from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from keras.applications.vgg16 import VGG16, preprocess_input,decode_predictions
from keras.preprocessing import image
import numpy as np
import wget
import os
from .serializers import ClassifierSerializer

class ClassifierViews(APIView):
    def post(self, request):
        serializer = ClassifierSerializer(data=request.data)
        
        if serializer.is_valid():
            model = VGG16(weights='imagenet')
            
            # Need to download the image file for the classifier to work
            image_filename = wget.download(serializer.validated_data['image_url'])
            
            #image loaded in PIL (Python Imaging Library)
            img = image.load_img(image_filename,color_mode='rgb', target_size=(224, 224))
            
            # Converts a PIL Image to 3D Numy Array
            x = image.img_to_array(img)
            
            # Adding the fouth dimension, for number of images
            x = np.expand_dims(x, axis=0)
            
            x = preprocess_input(x)
            
            features = model.predict(x)
            
            predictions = decode_predictions(features)[0]
            predictions.sort(key = lambda x: x[2])
            
            predicted_classification = predictions[-1][1]
            
            serializer.validated_data['classification'] = predicted_classification
            
            serializer.save()
            
            # Delete the image file so we don't crowd the project directory
            os.remove(image_filename)
            
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'data': serializer.errors}, status.HTTP_BAD_REQUEST)