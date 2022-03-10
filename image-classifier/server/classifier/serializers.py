from rest_framework import serializers
from .models import Classifier

class ClassifierSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(max_length=1000)
    classification = serializers.CharField(max_length=50)
    
    class Meta:
        model = Classifier
        fields = ('__all__')