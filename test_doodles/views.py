from django.shortcuts import render

def overflow_grid(request):
    return render(request, 'test_doodles/overflow_grid.html')
