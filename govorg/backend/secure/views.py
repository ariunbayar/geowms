import uuid
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_GET
from geoportal_app.models import User, UserValidationEmail
from backend.org.models import Employee

from .form import RegisterForm, LoginForm, ApproveForm


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password')
        try:
            b_user = User.objects.get(email=email)
            username = b_user.username

            user = auth.authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    org = Employee.objects.filter(user=user)
                    if org:
                        auth.login(request, user)
                        return redirect(settings.LOGIN_REDIRECT_ORG_URL)
                    else:
                        auth.login(request, user)
                        return redirect(settings.LOGIN_REDIRECT_URL)
                    auth.login(request, user)
                    return redirect(settings.LOGIN_REDIRECT_URL)
                else:
                    messages.warning(request, 'Таны хаяг идэвхгүй байна.')
                    return redirect('gov_secure:login')
            else:
                messages.warning(request, 'Нэвтрэх оролдлого амжилтгүй боллоо.')
                return redirect('gov_secure:login')
        except Exception:
            messages.warning(request, 'Буруу и-мэйл оруулсан байна!!!')
            return redirect('gov_secure:login')
    form = LoginForm()
    return render(request, 'govorg/backend/secure/login.html', {'form': form})


@require_GET
@login_required
def logout(request):
    auth.logout(request)

    if request.user_agent.is_mobile:
        return redirect(settings.LOGIN_REDIRECT_URL_MOBILE)
    else:
        return redirect(settings.LOGOUT_GOV_REDIRECT_URL)


def _generate_user_token():
    return uuid.uuid4().hex[:32]


def _get_approve_user(user_valid, user, password):

    user.set_password(password)
    user.save()

    user_valid.is_approve = True
    user_valid.save()


def approve(request, token):

    user_valid = get_object_or_404(UserValidationEmail, token=token)
    form = ApproveForm()

    if user_valid.is_active and user_valid.is_approve:
        return redirect('gov_secure:login')

    if request.method == 'POST':

        password = request.POST.get('password')
        re_password = request.POST.get('re_password')

        if password != re_password:
            messages.warning(request, 'Нууц үг давтана оруулхад алдаа гарлаа.')
            return redirect('gov_secure:approve')

        if user_valid.is_active and not user_valid.is_approve:

            _get_approve_user(user_valid, user_valid.user, password)
            return redirect('gov_secure:login')

        user_valid_list = UserValidationEmail.objects.filter(user=user_valid.user)

        for user_valid in user_valid_list:
            if user_valid.is_active and user_valid.is_approve:
                return redirect('gov_secure:login')

            if user_valid.is_active and not user_valid.is_approve:

                _get_approve_user(user_valid, user_valid.user, password)
                return redirect('gov_secure:login')

        user = user_valid.user
        user.set_password(password)
        user.save()

        UserValidationEmail.objects.create(
            user=user,
            token=_generate_user_token(),
            valid_before=timezone.now() + timedelta(days=90),
            is_approve=True,
        )

        return redirect('gov_secure:login')

    return render(request, 'govorg/backend/secure/approve.html', {'form': form})
