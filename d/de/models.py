from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('learner', 'Learner'),
        ('admin', 'Admin'),
    ]
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='learner')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class LearnerProfile(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=200, blank=True)
    education = models.TextField(blank=True)
    skills = models.JSONField(default=list,blank=True)  
    experience = models.TextField(blank=True)
    preferences = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.name} ({self.user.email})"

