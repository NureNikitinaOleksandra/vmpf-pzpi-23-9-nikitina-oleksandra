from django.db import models
from django.core.validators import MaxValueValidator

# Create your models here.

class Group(models.Model):
    name = models.CharField('Група', max_length=10, unique=True)

    def __str__(self):
        return self.name

class Subject(models.Model):
    title = models.CharField('Предмет', max_length=50, unique=True)

    def __str__(self):
        return self.title

class Student(models.Model):
    full_name = models.CharField('ПІБ', max_length=50)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name='Група')
    photo = models.ImageField('Фото', upload_to='students_photos/', blank=True, null=True)
    phone = models.CharField('Номер телефону', max_length=20, blank=True)
    email = models.EmailField('Електронна пошта', blank=True)
    address = models.TextField('Адреса', blank=True)

    def __str__(self):
        return self.full_name

class Grade(models.Model):
    value = models.PositiveIntegerField('Оцінка', validators=[MaxValueValidator(100)])
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name='Студент')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name='Предмет')

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.value}"