from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('auth/', views.auth, name='auth'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('learner-dashboard/', views.learner_dashboard, name='learner_dashboard'),
    path('learner-dashboard/profile-builder/', views.profile_builder, name='profile_builder'),
    path('recommendation-viewer/', views.recommendation_viewer, name='recommendation_viewer'),
    path('career-explorer/', views.career_explorer, name='career_explorer'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
]
