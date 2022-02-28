from django import forms

class somForm(forms.Form):
    freq = forms.IntegerField(min_value=0, max_value=10000,initial=0,required=True)