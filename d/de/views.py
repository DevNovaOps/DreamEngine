from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from .models import User
from .forms import SignupForm, LoginForm

language_data = {
        'en': {"pageTitle": "Career Navigator - Login & Signup", "navBrand": "CareerNav", "loginTitle": "Welcome Back", "signupTitle": "Create Account", "loginSubtitle": "Sign in to your account to continue", "signupSubtitle": "Join us and start your career journey", "email": "Email Address", "password": "Password", "confirmPassword": "Confirm Password", "fullName": "Full Name", "role": "Select Role", "learner": "Learner", "admin": "Admin", "loginBtn": "Login", "signupBtn": "Sign Up", "switchToSignup": "Don't have an account? Sign up", "switchToLogin": "Already have an account? Login", "forgotPassword": "Forgot Password?", "rememberMe": "Remember Me"},
        'hi': {"pageTitle": "करियर नेविगेटर - लॉगिन और साइनअप", "navBrand": "करियरनव", "loginTitle": "वापस स्वागत है", "signupTitle": "खाता बनाएं", "loginSubtitle": "जारी रखने के लिए अपने खाते में साइन इन करें", "signupSubtitle": "हमसे जुड़ें और अपनी करियर यात्रा शुरू करें", "email": "ईमेल पता", "password": "पासवर्ड", "confirmPassword": "पासवर्ड की पुष्टि करें", "fullName": "पूरा नाम", "role": "भूमिका चुनें", "learner": "सीखने वाला", "admin": "प्रशासक", "loginBtn": "लॉगिन", "signupBtn": "साइन अप", "switchToSignup": "खाता नहीं है? साइन अप करें", "switchToLogin": "पहले से खाता है? लॉगिन करें", "forgotPassword": "पासवर्ड भूल गए?", "rememberMe": "मुझे याद रखें"},
        'ta': {
        "pageTitle": "தொழில் வழிகாட்டி - உள்நுழைவு மற்றும் பதிவு", "navBrand": "தொழில்வழி", 
        "loginTitle": "மீண்டும் வரவேற்கிறோம்", "signupTitle": "கணக்கை உருவாக்கவும்", 
        "loginSubtitle": "தொடர்ந்து உங்கள் கணக்கில் உள்நுழையவும்", "signupSubtitle": "எங்களுடன் சேர்ந்து உங்கள் தொழில் பயணத்தைத் தொடங்கவும்", 
        "email": "மின்னஞ்சல் முகவரி", "password": "கடவுச்சொல்", "confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்தவும்", 
        "fullName": "முழு பெயர்", "role": "பாத்திரத்தைத் தேர்ந்தெடுக்கவும்", "learner": "கற்றவர்", "admin": "நிர்வாகி", 
        "loginBtn": "உள்நுழைவு", "signupBtn": "பதிவு செய்க", "switchToSignup": "கணக்கு இல்லையா? பதிவு செய்க", 
        "switchToLogin": "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்", "forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?", 
        "rememberMe": "என்னை நினைவில் வைத்திருங்கள்"
    },
    
    'bn': {
        "pageTitle": "ক্যারিয়ার নেভিগেটর - লগইন এবং সাইন আপ", "navBrand": "ক্যারিয়ারনেভ", 
        "loginTitle": "ফিরে স্বাগতম", "signupTitle": "অ্যাকাউন্ট তৈরি করুন", 
        "loginSubtitle": "চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন", "signupSubtitle": "আমাদের সাথে যোগ দিন এবং আপনার ক্যারিয়ার যাত্রা শুরু করুন", 
        "email": "ইমেইল ঠিকানা", "password": "পাসওয়ার্ড", "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন", 
        "fullName": "পুরো নাম", "role": "ভূমিকা নির্বাচন করুন", "learner": "শিক্ষার্থী", "admin": "অ্যাডমিন", 
        "loginBtn": "লগইন", "signupBtn": "সাইন আপ", "switchToSignup": "অ্যাকাউন্ট নেই? সাইন আপ করুন", 
        "switchToLogin": "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন", "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?", 
        "rememberMe": "আমাকে মনে রাখুন"
    },
    'gu': {
        "pageTitle": "કારિયર નેવિગેટર - લોગિન અને સાઇનઅપ", "navBrand": "કારિયરનવ", 
        "loginTitle": "પાછા સ્વાગત છે", "signupTitle": "એકાઉન્ટ બનાવો", 
        "loginSubtitle": "ચાલુ રાખવા માટે તમારા એકાઉન્ટમાં સાઇન ઇન કરો", "signupSubtitle": "અમારી સાથે જોડાઓ અને તમારી કારિયર યાત્રા શરૂ કરો", 
        "email": "ઇમેઇલ સરનામું", "password": "પાસવર્ડ", "confirmPassword": "પાસવર્ડની પુષ્ટિ કરો", 
        "fullName": "પૂરું નામ", "role": "ભૂમિકા પસંદ કરો", "learner": "શીખનાર", "admin": "એડમિન", 
        "loginBtn": "લોગિન", "signupBtn": "સાઇન અપ", "switchToSignup": "એકાઉન્ટ નથી? સાઇન અપ કરો", 
        "switchToLogin": "પહેલેથી એકાઉન્ટ છે? લોગિન કરો", "forgotPassword": "પાસવર્ડ ભૂલી ગયા?", 
        "rememberMe": "મને યાદ રાખો"
    }    
    }

def login_user(request, user):
    request.session['user_id'] = user.id
    request.session['user_name'] = user.name
    request.session['user_role'] = user.role

def auth(request):
    if request.method == "POST":
        action = request.POST.get("action")

        if action == "signup":
            form = SignupForm(request.POST)
            if form.is_valid():
                user = form.save()
                login_user(request, user)
                return JsonResponse({'status': 'success', 'message': 'Signup successful', 'role': user.role})
            return JsonResponse({'status': 'error', 'message': form.errors.as_json()}, status=400)

        elif action == "login":
            form = LoginForm(request.POST)
            if form.is_valid():
                try:
                    user = User.objects.get(email=form.cleaned_data['email'])
                    if check_password(form.cleaned_data['password'], user.password):
                        login_user(request, user)
                        return JsonResponse({'status': 'success', 'message': 'Login successful', 'role': user.role})
                
    
                    return JsonResponse({'status': 'error', 'message': 'Invalid password'}, status=400)
                except User.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
            return JsonResponse({'status': 'error', 'message': form.errors.as_json()}, status=400)

        return JsonResponse({'status': 'error', 'message': 'Invalid action'}, status=400)

    return render(request, "de/auth.html", {
        'signup_form': SignupForm(),
        'login_form': LoginForm(),
        'language_data': language_data,
    })

def home(request):
    return render(request, 'de/home.html')

def learner_dashboard(request):
    if 'user_id' not in request.session or request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/learner-dashboard.html', {
        'user_name': request.session.get('user_name')
    })

def profile_builder(request):
    if 'user_id' not in request.session or request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/profile-builder.html', {
        'user_name': request.session.get('user_name')
    })

def career_explorer(request):
    if 'user_id' not in request.session or request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/career-explorer.html', {
        'user_name': request.session.get('user_name')
    })

def recommendation_viewer(request):
    if 'user_id' not in request.session or request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/recommendation-viewer.html', {
        'user_name': request.session.get('user_name')
    })


def admin_dashboard(request):
    # Only allow admin users
    if 'user_id' not in request.session or request.session.get('user_role') != 'admin':
        return redirect('auth')
    
    return render(request, 'de/admin-panel.html', {
        'user_name': request.session.get('user_name')
    })

def forgot_password(request):
    return render(request, 'de/forgot_password.html')
