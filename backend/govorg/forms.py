from django import forms

from .models import GovOrg as System


class SystemForm(forms.ModelForm):

    class Meta:

        model = System

        fields = [
            'name',
            'org',
        ]
