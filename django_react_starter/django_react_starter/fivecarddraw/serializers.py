from rest_framework import serializers
from .models import fivecarddraw

class fivecarddrawSerializer(serializers.ModelSerializer):
    class Meta:
        model = fivecarddraw
        fields = ('id', 'title', 'description', 'completed')