from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render


@user_passes_test(lambda u: u.is_superuser)
def index(request):
    user = request.user
    username, email = user.username, user.email
    context = {
        'user': {
            'username': username,
            'email': email,
        }
    }
    return render(request, "backend/webapp.html", context)
