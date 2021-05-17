from django.shortcuts import render

def index(request):
    return render(request, 'Frontend/index.html')
