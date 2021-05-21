from django.shortcuts import render


def llc_frontend(request):
    context = {
        'ann_name': 'Байгууллагын нэр байна',
    }
    return render(request, 'llc/index.html', context)
