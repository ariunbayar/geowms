from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_GET
from geoportal_app.models import User, UserValidationEmail
from backend.org.models import Employee

from .form import LoginForm, ApproveForm
from main import utils


def _make_captcha():
    text = utils.password_generate(4)
    texts = [
        {
            'text': text,
            'xy': [25, 5],
            'rgb': [255, 255, 255],
            'size': 20,
        }
    ]
    img = utils.creat_empty_image(100, 33, bg_color=[3, 78, 162])
    img = utils.set_text_to_image(texts, img)
    image_path = 'test.png'
    img.save(image_path)
    byte_img = utils.image_to_64_byte(image_path)
    utils.remove_file(image_path)
    byte_img = byte_img.decode()
    return text, byte_img


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password')
        zurag = request.POST.get('zurag')
        captcha = request.POST.get('captcha')

        if zurag != captcha and not settings.DEBUG:
            messages.warning(request, 'Captcha буруу байна.')
            return redirect('gov_secure:login')
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
            messages.warning(request, 'И-мэйл эсвэл нууц үг буруу байна!!!')
            return redirect('gov_secure:login')
    form = LoginForm()
    text, byte_img = _make_captcha()
    return render(request, 'govorg/backend/secure/login.html', {'form': form, 'captcha': {"text": text, "byte_img": byte_img}})


@require_GET
@login_required
def logout(request):
    auth.logout(request)

    if request.user_agent.is_mobile:
        return redirect(settings.LOGIN_REDIRECT_URL_MOBILE)
    else:
        return redirect(settings.LOGOUT_GOV_REDIRECT_URL)


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
            messages.warning(request, 'Нууц үг давтан оруулахад алдаа гарлаа.')
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

        return redirect('gov_secure:login')

    return render(request, 'govorg/backend/secure/approve.html', {'form': form})
