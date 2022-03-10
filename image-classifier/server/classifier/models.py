from django.db import models

class Classifier(models.Model):
    image_url = models.CharField(max_length=1000)
    classification = models.CharField(max_length=50)