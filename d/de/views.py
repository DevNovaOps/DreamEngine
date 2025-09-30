from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from .models import User, LearnerProfile
from .forms import SignupForm, LoginForm
import os, json, difflib
language_data = {
    'en': {
        "pageTitle": "Career Navigator - Login & Signup",
        "navBrand": "Dream Engine",
        "loginTitle": "Welcome Back",
        "signupTitle": "Create Account",
        "loginSubtitle": "Sign in to your account to continue",
        "signupSubtitle": "Join us and start your career journey",
        "email": "Email Address",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "fullName": "Full Name",
        "role": "Select Role",
        "learner": "Learner",
        "admin": "Admin",
        "loginBtn": "Login",
        "signupBtn": "Sign Up",
        "switchToSignup": "Don't have an account? Sign up",
        "switchToLogin": "Already have an account? Login",
        "forgotPassword": "Forgot Password?",
        "rememberMe": "Remember Me",
        "loading": "Loading...",
        "successTitle": "Success!",
        "successMessage": "Redirecting...",
        "passwordMismatch": "Passwords do not match",
        "errorOccurred": "An error occurred"
    },
    'hi': {
        "pageTitle": "करियर नेविगेटर - लॉगिन और साइनअप",
        "navBrand": "ड्रीम इंजन",
        "loginTitle": "वापस स्वागत है",
        "signupTitle": "खाता बनाएं",
        "loginSubtitle": "जारी रखने के लिए अपने खाते में साइन इन करें",
        "signupSubtitle": "हमसे जुड़ें और अपनी करियर यात्रा शुरू करें",
        "email": "ईमेल पता",
        "password": "पासवर्ड",
        "confirmPassword": "पासवर्ड की पुष्टि करें",
        "fullName": "पूरा नाम",
        "role": "भूमिका चुनें",
        "learner": "सीखने वाला",
        "admin": "प्रशासक",
        "loginBtn": "लॉगिन",
        "signupBtn": "साइन अप",
        "switchToSignup": "खाता नहीं है? साइन अप करें",
        "switchToLogin": "पहले से खाता है? लॉगिन करें",
        "forgotPassword": "पासवर्ड भूल गए?",
        "rememberMe": "मुझे याद रखें",
        "loading": "लोड हो रहा है...",
        "successTitle": "सफलता!",
        "successMessage": "पुनर्निर्देशित हो रहा है...",
        "passwordMismatch": "पासवर्ड मेल नहीं खाते",
        "errorOccurred": "एक त्रुटि हुई"
    },
    'ta': {
        "pageTitle": "தொழில் வழிகாட்டி - உள்நுழைவு மற்றும் பதிவு",
        "navBrand": "கனவு இயந்திரம்",
        "loginTitle": "மீண்டும் வரவேற்கிறோம்",
        "signupTitle": "கணக்கை உருவாக்கவும்",
        "loginSubtitle": "தொடர்ந்து உங்கள் கணக்கில் உள்நுழையவும்",
        "signupSubtitle": "எங்களுடன் சேர்ந்து உங்கள் தொழில் பயணத்தைத் தொடங்கவும்",
        "email": "மின்னஞ்சல் முகவரி",
        "password": "கடவுச்சொல்",
        "confirmPassword": "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        "fullName": "முழு பெயர்",
        "role": "பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
        "learner": "கற்றவர்",
        "admin": "நிர்வாகி",
        "loginBtn": "உள்நுழைவு",
        "signupBtn": "பதிவு செய்க",
        "switchToSignup": "கணக்கு இல்லையா? பதிவு செய்க",
        "switchToLogin": "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
        "forgotPassword": "கடவுச்சொல் மறந்துவிட்டதா?",
        "rememberMe": "என்னை நினைவில் வைத்திருங்கள்",
        "loading": "ஏற்றுகிறது...",
        "successTitle": "வெற்றி!",
        "successMessage": "திருப்பி அனுப்புகிறது...",
        "passwordMismatch": "கடவுச்சொற்கள் பொருந்தவில்லை",
        "errorOccurred": "பிழை ஏற்பட்டது"
    },
    'bn': {
        "pageTitle": "ক্যারিয়ার নেভিগেটর - লগইন এবং সাইন আপ",
        "navBrand": "স্বপ্ন ইঞ্জিন",
        "loginTitle": "ফিরে স্বাগতম",
        "signupTitle": "অ্যাকাউন্ট তৈরি করুন",
        "loginSubtitle": "চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন",
        "signupSubtitle": "আমাদের সাথে যোগ দিন এবং আপনার ক্যারিয়ার যাত্রা শুরু করুন",
        "email": "ইমেইল ঠিকানা",
        "password": "পাসওয়ার্ড",
        "confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
        "fullName": "পুরো নাম",
        "role": "ভূমিকা নির্বাচন করুন",
        "learner": "শিক্ষার্থী",
        "admin": "অ্যাডমিন",
        "loginBtn": "লগইন",
        "signupBtn": "সাইন আপ",
        "switchToSignup": "অ্যাকাউন্ট নেই? সাইন আপ করুন",
        "switchToLogin": "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন",
        "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
        "rememberMe": "আমাকে মনে রাখুন",
        "loading": "লোড হচ্ছে...",
        "successTitle": "সফল!",
        "successMessage": "পুনঃনির্দেশিত হচ্ছে...",
        "passwordMismatch": "পাসওয়ার্ড মিলছে না",
        "errorOccurred": "একটি ত্রুটি ঘটেছে"
    },
    'gu': {
        "pageTitle": "કારિયર નેવિગેટર - લોગિન અને સાઇનઅપ",
        "navBrand": "ડ્રીમ એન્જિન",
        "loginTitle": "પાછા સ્વાગત છે",
        "signupTitle": "એકાઉન્ટ બનાવો",
        "loginSubtitle": "ચાલુ રાખવા માટે તમારા એકાઉન્ટમાં સાઇન ઇન કરો",
        "signupSubtitle": "અમારી સાથે જોડાઓ અને તમારી કારિયર યાત્રા શરૂ કરો",
        "email": "ઇમેઇલ સરનામું",
        "password": "પાસવર્ડ",
        "confirmPassword": "પાસવર્ડની પુષ્ટિ કરો",
        "fullName": "પૂરું નામ",
        "role": "ભૂમિકા પસંદ કરો",
        "learner": "શીખનાર",
        "admin": "એડમિન",
        "loginBtn": "લોગિન",
        "signupBtn": "સાઇન અપ",
        "switchToSignup": "એકાઉન્ટ નથી? સાઇન અપ કરો",
        "switchToLogin": "પહેલેથી એકાઉન્ટ છે? લોગિન કરો",
        "forgotPassword": "પાસવર્ડ ભૂલી ગયા?",
        "rememberMe": "મને યાદ રાખો",
        "loading": "લોડ થઈ રહ્યું છે...",
        "successTitle": "સફળતા!",
        "successMessage": "રીડાયરેક્ટ થઈ રહ્યું છે...",
        "passwordMismatch": "પાસવર્ડ મેળ ખાતા નથી",
        "errorOccurred": "એક ભૂલ આવી"
    }
}


def login_user(request, user):
    """Helper function to log in a user by setting session variables."""
    request.session['user_id'] = user.id
    request.session['user_name'] = user.name
    request.session['user_role'] = user.role
    # Store user's preferred language if available
    if hasattr(user, 'preferred_language'):
        request.session['preferred_language'] = user.preferred_language


def auth(request):
    """Handles login and signup (AJAX-based) with multilingual support."""
    if request.method == "POST":
        action = request.POST.get("action")
        
        # Get user's preferred language from request (if available)
        user_language = request.POST.get("language", "en")

        if action == "signup":
            form = SignupForm(request.POST)
            if form.is_valid():
                user = form.save()
                login_user(request, user)
                return JsonResponse({
                    'status': 'success',
                    'message': language_data.get(user_language, language_data['en']).get('successMessage', 'Signup successful'),
                    'role': user.role
                })
            
            # Return translated error messages
            errors = form.errors.as_json()
            return JsonResponse({
                'status': 'error',
                'message': language_data.get(user_language, language_data['en']).get('errorOccurred', 'An error occurred'),
                'errors': errors
            }, status=400)

        elif action == "login":
            form = LoginForm(request.POST)
            if form.is_valid():
                try:
                    user = User.objects.get(email=form.cleaned_data['email'])
                    if check_password(form.cleaned_data['password'], user.password):
                        login_user(request, user)
                        return JsonResponse({
                            'status': 'success',
                            'message': language_data.get(user_language, language_data['en']).get('successMessage', 'Login successful'),
                            'role': user.role
                        })
                    
                    # Invalid password
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Invalid password'  # You can add this to language_data for translation
                    }, status=400)
                    
                except User.DoesNotExist:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'User not found'  # You can add this to language_data for translation
                    }, status=404)
                    
            return JsonResponse({
                'status': 'error',
                'message': language_data.get(user_language, language_data['en']).get('errorOccurred', 'An error occurred'),
                'errors': form.errors.as_json()
            }, status=400)

        return JsonResponse({
            'status': 'error',
            'message': 'Invalid action'
        }, status=400)

    # GET request - render the auth page
    return render(request, "de/auth.html", {
        'signup_form': SignupForm(),
        'login_form': LoginForm(),
        'language_data': language_data,
    })

def home(request):
    return render(request, 'de/home.html')

def learner_dashboard(request):
    if request.session.get('user_role') != 'learner':
        return redirect('auth')

    user_name = request.session.get('user_name', '')
    selected_language = request.session.get('language', 'en')
    translations = {
        'en': {
            'pageTitle': 'Career Navigator - Learner Dashboard',
            'pageDescription': 'Your personalized learning dashboard for career development',
            'navBrand': 'CareerNav',
            'selectLanguage': 'Select language',
            'welcome': 'Welcome back',
            'welcomeSubtitle': 'Ready to continue your learning journey?',
            'profileCard': 'Profile Card',
            'learningProgress': 'Learning Progress',
            'quickActions': 'Quick Actions',
            'motivationalQuote': 'Motivational Quote',
            'currentLevel': 'Current Level',
            'skillsLearned': 'Skills Learned',
            'coursesCompleted': 'Courses Completed',
            'hoursSpent': 'Hours Spent',
            'achievements': 'Achievements',
            'profileBuilder': 'Profile Builder',
            'buildProfile': 'Build Your Profile',
            'careerExplorer': 'Career Explorer',
            'exploreCareers': 'Explore Careers',
            'recommendationViewer': 'Recommendation Viewer',
            'viewRecommendations': 'View Recommendations',
            'logout': 'Logout',
            'settings': 'Settings',
            'notifications': 'Notifications',
            'nextMilestone': 'Next Milestone',
            'quote1': 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            'quote2': 'The future belongs to those who believe in the beauty of their dreams.',
            'quote3': 'Education is the most powerful weapon which you can use to change the world.',
            'quote4': 'The only way to do great work is to love what you do.',
            'quote5': 'Innovation distinguishes between a leader and a follower.',
            'aiAssistant': 'AI Career Assistant',
            'typePlaceholder': 'Type your message here...',
            'aiWelcome': "Hello! I'm your AI Career Assistant. How can I help you today?",
        },
        'hi': {
            'pageTitle': 'करियर नेविगेटर - लर्नर डैशबोर्ड',
            'pageDescription': 'करियर विकास के लिए आपका व्यक्तिगत शिक्षण डैशबोर्ड',
            'navBrand': 'करियरनव',
            'selectLanguage': 'भाषा चुनें',
            'welcome': 'वापस स्वागत है',
            'welcomeSubtitle': 'अपनी सीखने की यात्रा जारी रखने के लिए तैयार हैं?',
            'profileCard': 'प्रोफाइल कार्ड',
            'learningProgress': 'सीखने की प्रगति',
            'quickActions': 'त्वरित कार्य',
            'motivationalQuote': 'प्रेरणादायक उद्धरण',
            'currentLevel': 'वर्तमान स्तर',
            'skillsLearned': 'सीखे गए कौशल',
            'coursesCompleted': 'पूर्ण किए गए पाठ्यक्रम',
            'hoursSpent': 'बिताए गए घंटे',
            'achievements': 'उपलब्धियां',
            'profileBuilder': 'प्रोफाइल बिल्डर',
            'buildProfile': 'अपना प्रोफाइल बनाएं',
            'careerExplorer': 'करियर एक्सप्लोरर',
            'exploreCareers': 'करियर का अन्वेषण करें',
            'recommendationViewer': 'सिफारिश व्यूअर',
            'viewRecommendations': 'सिफारिशें देखें',
            'logout': 'लॉगआउट',
            'settings': 'सेटिंग्स',
            'notifications': 'सूचनाएं',
            'nextMilestone': 'अगला माइलस्टोन',
            'quote1': 'सफलता अंतिम नहीं है, असफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।',
            'quote2': 'भविष्य उनका है जो अपने सपनों की सुंदरता में विश्वास करते हैं।',
            'quote3': 'शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।',
            'quote4': 'महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।',
            'quote5': 'नवाचार एक नेता और अनुयायी के बीच अंतर करता है।',
            'aiAssistant': 'एआई करियर सहायक',
            'typePlaceholder': 'अपना संदेश यहां लिखें...',
            'aiWelcome': 'नमस्ते! मैं आपका एआई करियर सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
        },
        'ta': {
            'pageTitle': 'தொழில் வழிகாட்டி - கற்றவர் டாஷ்போர்டு',
            'pageDescription': 'தொழில் வளர்ச்சிக்கான உங்கள் தனிப்பட்ட கற்றல் டாஷ்போர்டு',
            'navBrand': 'தொழில்வழி',
            'selectLanguage': 'மொழியைத் தேர்ந்தெடுக்கவும்',
            'welcome': 'மீண்டும் வரவேற்கிறோம்',
            'welcomeSubtitle': 'உங்கள் கற்றல் பயணத்தைத் தொடர தயாரா?',
            'profileCard': 'சுயவிவர அட்டை',
            'learningProgress': 'கற்றல் முன்னேற்றம்',
            'quickActions': 'விரைவு செயல்கள்',
            'motivationalQuote': 'உத்வேகமளிக்கும் மேற்கோள்',
            'currentLevel': 'தற்போதைய நிலை',
            'skillsLearned': 'கற்ற திறன்கள்',
            'coursesCompleted': 'முடிக்கப்பட்ட படிப்புகள்',
            'hoursSpent': 'செலவழித்த மணிநேரங்கள்',
            'achievements': 'சாதனைகள்',
            'profileBuilder': 'சுயவிவர கட்டுநர்',
            'buildProfile': 'உங்கள் சுயவிவரத்தை உருவாக்குங்கள்',
            'careerExplorer': 'தொழில் ஆராய்ச்சியாளர்',
            'exploreCareers': 'தொழில்களை ஆராயுங்கள்',
            'recommendationViewer': 'பரிந்துரை காட்சியாளர்',
            'viewRecommendations': 'பரிந்துரைகளைப் பாருங்கள்',
            'logout': 'வெளியேறு',
            'settings': 'அமைப்புகள்',
            'notifications': 'அறிவிப்புகள்',
            'nextMilestone': 'அடுத்த மைல்கல்',
            'quote1': 'வெற்றி இறுதியானது அல்ல, தோல்வி மரணமானது அல்ல: தொடர்ந்து செல்லும் தைரியம்தான் முக்கியம்.',
            'quote2': 'எதிர்காலம் தங்கள் கனவுகளின் அழகில் நம்பிக்கை வைத்தவர்களுக்கு சொந்தமானது.',
            'quote3': 'கல்வி என்பது உலகை மாற்ற நீங்கள் பயன்படுத்தக்கூடிய மிகவும் சக்திவாய்ந்த ஆயுதம்.',
            'quote4': 'சிறந்த வேலை செய்ய ஒரே வழி, நீங்கள் செய்வதை நேசிப்பதுதான்.',
            'quote5': 'புதுமை ஒரு தலைவர் மற்றும் பின்பற்றுபவருக்கு இடையே வேறுபாட்டை ஏற்படுத்துகிறது.',
            'aiAssistant': 'AI தொழில் உதவியாளர்',
            'typePlaceholder': 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...',
            'aiWelcome': 'வணக்கம்! நான் உங்கள் AI தொழில் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        },
        'bn': {
            'pageTitle': 'ক্যারিয়ার নেভিগেটর - লার্নার ড্যাশবোর্ড',
            'pageDescription': 'ক্যারিয়ার উন্নয়নের জন্য আপনার ব্যক্তিগত শিক্ষার ড্যাশবোর্ড',
            'navBrand': 'ক্যারিয়ারনেভ',
            'selectLanguage': 'ভাষা নির্বাচন করুন',
            'welcome': 'ফিরে স্বাগতম',
            'welcomeSubtitle': 'আপনার শেখার যাত্রা চালিয়ে যেতে প্রস্তুত?',
            'profileCard': 'প্রোফাইল কার্ড',
            'learningProgress': 'শেখার অগ্রগতি',
            'quickActions': 'দ্রুত কর্ম',
            'motivationalQuote': 'প্রেরণাদায়ক উক্তি',
            'currentLevel': 'বর্তমান স্তর',
            'skillsLearned': 'শেখা দক্ষতা',
            'coursesCompleted': 'সম্পূর্ণ কোর্স',
            'hoursSpent': 'ব্যয়িত ঘন্টা',
            'achievements': 'অর্জন',
            'profileBuilder': 'প্রোফাইল বিল্ডার',
            'buildProfile': 'আপনার প্রোফাইল তৈরি করুন',
            'careerExplorer': 'ক্যারিয়ার এক্সপ্লোরার',
            'exploreCareers': 'ক্যারিয়ার অন্বেষণ করুন',
            'recommendationViewer': 'সুপারিশ দর্শক',
            'viewRecommendations': 'সুপারিশ দেখুন',
            'logout': 'লগআউট',
            'settings': 'সেটিংস',
            'notifications': 'বিজ্ঞপ্তি',
            'nextMilestone': 'পরবর্তী মাইলফলক',
            'quote1': 'সাফল্য চূড়ান্ত নয়, ব্যর্থতা মারাত্মক নয়: এগিয়ে যাওয়ার সাহসই গুরুত্বপূর্ণ।',
            'quote2': 'ভবিষ্যত তাদের যারা তাদের স্বপ্নের সৌন্দর্যে বিশ্বাস করে।',
            'quote3': 'শিক্ষা সবচেয়ে শক্তিশালী অস্ত্র যা আপনি বিশ্বকে পরিবর্তন করতে ব্যবহার করতে পারেন।',
            'quote4': 'মহান কাজ করার একমাত্র উপায় হল আপনি যা করেন তা ভালবাসা।',
            'quote5': 'নবাচার একজন নেতা এবং অনুসরণকারীর মধ্যে পার্থক্য করে।',
            'aiAssistant': 'AI ক্যারিয়ার সহায়ক',
            'typePlaceholder': 'এখানে আপনার বার্তা টাইপ করুন...',
            'aiWelcome': 'হ্যালো! আমি আপনার AI ক্যারিয়ার সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        },
        'gu': {
            'pageTitle': 'કારિયર નેવિગેટર - લર્નર ડેશબોર્ડ',
            'pageDescription': 'કારિયર વિકાસ માટે તમારું વ્યક્તિગત શિક્ષણ ડેશબોર્ડ',
            'navBrand': 'કારિયરનવ',
            'selectLanguage': 'ભાષા પસંદ કરો',
            'welcome': 'પાછા સ્વાગત છે',
            'welcomeSubtitle': 'તમારી શિક્ષણ યાત્રા ચાલુ રાખવા તૈયાર છો?',
            'profileCard': 'પ્રોફાઇલ કાર્ડ',
            'learningProgress': 'શીખવાની પ્રગતિ',
            'quickActions': 'ઝડપી ક્રિયાઓ',
            'motivationalQuote': 'પ્રેરણાદાયક ઉદ્ધરણ',
            'currentLevel': 'વર્તમાન સ્તર',
            'skillsLearned': 'શીખેલ કૌશલ્યો',
            'coursesCompleted': 'પૂર્ણ કરેલા અભ્યાસક્રમો',
            'hoursSpent': 'ખર્ચાયેલા કલાકો',
            'achievements': 'પ્રાપ્તિઓ',
            'profileBuilder': 'પ્રોફાઇલ બિલ્ડર',
            'buildProfile': 'તમારું પ્રોફાઇલ બનાવો',
            'careerExplorer': 'કારિયર એક્સપ્લોરર',
            'exploreCareers': 'કારિયરનું અન્વેષણ કરો',
            'recommendationViewer': 'ભલામણ દર્શક',
            'viewRecommendations': 'ભલામણો જુઓ',
            'logout': 'લોગઆઉટ',
            'settings': 'સેટિંગ્સ',
            'notifications': 'સૂચનાઓ',
            'nextMilestone': 'આગળનું માઇલસ્ટોન',
            'quote1': 'સફળતા અંતિમ નથી, નિષ્ફળતા ઘાતક નથી: ચાલુ રાખવાની હિંમત જ મહત્વની છે।',
            'quote2': 'ભવિષ્ય તેમનું છે જે પોતાના સપનાઓની સુંદરતામાં વિશ્વાસ રાખે છે।',
            'quote3': 'શિક્ષણ સૌથી શક્તિશાળી શસ્ત્ર છે જેનો ઉપયોગ તમે વિશ્વને બદલવા માટે કરી શકો છો।',
            'quote4': 'મહાન કામ કરવાનો એકમાત્ર રસ્તો એ છે કે તમે જે કરો છો તેને પ્રેમ કરો।',
            'quote5': 'નવીનતા એક નેતા અને અનુયાયી વચ્ચે તફાવત કરે છે।',
            'aiAssistant': 'AI કારકિર્દી સહાયક',
            'typePlaceholder': 'તમારો સંદેશ અહીં લખો...',
            'aiWelcome': 'નમસ્તે! હું તમારો AI કારકિર્દી સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
        }
    }
    
    profile_data = {}

    try:
        from .models import LearnerProfile
        profile = LearnerProfile.objects.get(user__id=request.session['user_id'])
        profile_data = {
            "full_name": profile.user.name,
            "first_name": profile.user.name.split(" ")[0] if profile.user.name else "",
            "last_name": profile.user.name.split(" ")[1] if len(profile.user.name.split(" ")) > 1 else "",
            "email": profile.user.email,
            "phone": profile.phone or "",
            "location": profile.location or "",
            "education": profile.education or "",
            "skills": profile.skills or [],
            "experience": profile.experience or "",
            "courses_completed": getattr(profile, 'courses_completed', 0),
            "hours_spent": getattr(profile, 'hours_spent', 0),
            "achievements": getattr(profile, 'achievements', 0),
            "current_level": getattr(profile, 'current_level', 'Beginner'),
        }
    except Exception as e:
        print(f"Profile fetch error: {e}")
        profile_data = {
            "full_name": user_name,
            "first_name": user_name.split(" ")[0] if user_name else "L",
            "last_name": user_name.split(" ")[1] if len(user_name.split(" ")) > 1 else "",
            "email": "",
            "phone": "",
            "location": "",
            "education": "",
            "skills": [],
            "experience": "",
            "courses_completed": 0,
            "hours_spent": 0,
            "achievements": 0,
            "current_level": "Beginner",
        }

    # CRITICAL: Ensure all_translations is properly JSON encoded
    # Using json.dumps with ensure_ascii=False to handle unicode characters
    all_translations_json = json.dumps(translations, ensure_ascii=False)
    
    context = {
        'user_name': user_name,
        'profile': profile_data,
        'translations': translations.get(selected_language, translations['en']),
        'all_translations': all_translations_json,
        'current_language': selected_language,
    }
    
    return render(request, 'de/learner-dashboard.html', context)


def change_language(request):
    """API endpoint to change language and persist in session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            language = data.get('language', 'en')
            
            # Validate language
            valid_languages = ['en', 'hi', 'ta', 'bn', 'gu']
            if language not in valid_languages:
                return JsonResponse({'status': 'error', 'message': 'Invalid language'}, status=400)
            
            # Store in session
            request.session['language'] = language
            
            return JsonResponse({
                'status': 'success',
                'language': language,
                'message': 'Language updated successfully'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)


def career_explorer(request):
    if request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/career-explorer.html', {'user_name': request.session.get('user_name')})


def recommendation_viewer(request):
    if request.session.get('user_role') != 'learner':
        return redirect('auth')
    return render(request, 'de/recommendation-viewer.html', {'user_name': request.session.get('user_name')})


def admin_dashboard(request):
    if request.session.get('user_role') != 'admin':
        return redirect('auth')
    return render(request, 'de/admin-panel.html', {'user_name': request.session.get('user_name')})


def forgot_password(request):
    return render(request, 'de/forgot_password.html')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'de', 'data')

def chatbot_response(request):
    user_message = request.GET.get("message", "").lower().strip()
    lang = request.GET.get("lang", "en")

    dataset_map = {
        "en": "english_dataset.jsonl",
        "hi": "hindi_dataset.jsonl",
        "gu": "gujarati_dataset.jsonl",
        "ta": "tamil_dataset.jsonl",
        "bn": "bengali_dataset.jsonl"
    }
    dataset_file = dataset_map.get(lang, "english_dataset.jsonl")
    file_path = os.path.join(DATA_DIR, dataset_file)

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = [json.loads(line.strip()) for line in f if line.strip()]

        response = "⚠️ Sorry, I don’t have an answer for that yet."

       
        for entry in data:
            if user_message == entry["user"].lower().strip():
                response = entry["assistant"]
                break
        if response.startswith("⚠️"):
            best_match = max(data, key=lambda e: difflib.SequenceMatcher(None, user_message, e["user"].lower()).ratio(), default=None)
            if best_match and difflib.SequenceMatcher(None, user_message, best_match["user"].lower()).ratio() > 0.5:
                response = best_match["assistant"]

        return JsonResponse({"response": response})
    except Exception as e:
        return JsonResponse({"error": str(e)})

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.translation import gettext as _
from django.utils.translation import activate, get_language
import json
from .models import User, LearnerProfile

def profile_builder(request):
    """Render the profile builder page for learners"""
    if request.session.get('user_role') != 'learner':
        return redirect('auth')
    
    # Get user's preferred language from session or default to 'en'
    user_language = request.session.get('user_language', 'en')
    activate(user_language)
    
    context = {
        'user_name': request.session.get('user_name'),
        'user_language': user_language
    }
    return render(request, 'de/profile-builder.html', context)


@csrf_exempt
def save_profile(request):
    """Save or update learner profile with multilingual support"""
    if request.method == "POST":
        if 'user_id' not in request.session:
            user_language = request.session.get('user_language', 'en')
            activate(user_language)
            return JsonResponse({
                'status': 'error',
                'message': _('Not logged in')
            }, status=401)
        
        try:
            user = User.objects.get(id=request.session['user_id'])
            data = json.loads(request.body)
            
            # Get language preference if provided
            user_language = data.get('language', request.session.get('user_language', 'en'))
            request.session['user_language'] = user_language
            activate(user_language)
            
            # Update user's name from firstName and lastName
            first_name = data.get("firstName", "").strip()
            last_name = data.get("lastName", "").strip()
            if first_name or last_name:
                user.name = f"{first_name} {last_name}".strip()
                user.save()
            
            # Ensure skills is always a list
            skills = data.get("skills", [])
            if isinstance(skills, str):
                try:
                    skills = json.loads(skills)
                except json.JSONDecodeError:
                    skills = [s.strip() for s in skills.split(',') if s.strip()]
            
            # Create or update profile
            LearnerProfile.objects.update_or_create(
                user=user,
                defaults={
                    "phone": data.get("phone", ""),
                    "location": data.get("location", ""),
                    "education": data.get("education", ""),
                    "skills": skills,
                    "experience": data.get("experience", ""),
                    "preferences": data.get("preferences", ""),
                }
            )
            
            return JsonResponse({
                "status": "success",
                "message": _("Profile saved successfully")
            })
            
        except User.DoesNotExist:
            activate(request.session.get('user_language', 'en'))
            return JsonResponse({
                'status': 'error',
                'message': _('User not found')
            }, status=404)
        except json.JSONDecodeError:
            activate(request.session.get('user_language', 'en'))
            return JsonResponse({
                'status': 'error',
                'message': _('Invalid data format')
            }, status=400)
        except Exception as e:
            activate(request.session.get('user_language', 'en'))
            return JsonResponse({
                'status': 'error',
                'message': _('An error occurred while saving profile')
            }, status=500)
    
    return JsonResponse({
        "status": "error",
        "message": _("Invalid request method")
    }, status=400)


def load_profile(request):
    """Load learner profile with multilingual support"""
    if 'user_id' not in request.session:
        user_language = request.session.get('user_language', 'en')
        activate(user_language)
        return JsonResponse({
            'status': 'error',
            'message': _('Not logged in')
        }, status=401)
    
    # Activate user's preferred language
    user_language = request.session.get('user_language', 'en')
    activate(user_language)
    
    try:
        profile = LearnerProfile.objects.get(user__id=request.session['user_id'])
        user_name = profile.user.name or ""
        name_parts = user_name.split(" ", 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        # Ensure skills is a list
        skills = profile.skills
        if isinstance(skills, str):
            try:
                skills = json.loads(skills)
            except json.JSONDecodeError:
                skills = [s.strip() for s in skills.split(',') if s.strip()]
        elif not isinstance(skills, list):
            skills = []
        
        return JsonResponse({
            "status": "success",
            "firstName": first_name,
            "lastName": last_name,
            "email": profile.user.email,
            "phone": profile.phone or "",
            "location": profile.location or "",
            "education": profile.education or "",
            "skills": skills,
            "experience": profile.experience or "",
            "preferences": profile.preferences or "",
            "language": user_language
        })
        
    except LearnerProfile.DoesNotExist:
        return JsonResponse({
            "status": "empty",
            "message": _("Profile not created yet"),
            "language": user_language
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': _('An error occurred while loading profile')
        }, status=500)


@csrf_exempt
def set_language(request):
    """Set user's preferred language"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            language = data.get('language', 'en')
            

            supported_languages = ['en', 'hi', 'ta', 'bn', 'gu']
            if language not in supported_languages:
                language = 'en'
            
            # Store in session
            request.session['user_language'] = language
            activate(language)
            
            # If user is logged in, you could also store in database
            if 'user_id' in request.session:
                try:
                    user = User.objects.get(id=request.session['user_id'])
                except User.DoesNotExist:
                    pass
            
            return JsonResponse({
                'status': 'success',
                'message': _('Language updated successfully'),
                'language': language
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid data format'
            }, status=400)
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    }, status=400)


