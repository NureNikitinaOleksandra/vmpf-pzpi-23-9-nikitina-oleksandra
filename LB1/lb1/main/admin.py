from django.contrib import admin
from .models import Group, Subject, Student, Grade

admin.site.register(Group)
admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(Grade)

