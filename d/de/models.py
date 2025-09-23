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

