from django import forms

from .models import System


class SystemForm(forms.ModelForm):

    class Meta:

        model = System

        fields = [
            'name',
            'org',
        ]
