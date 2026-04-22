from django.urls import path
from . import views

urlpatterns = [
    path('', views.students_list, name='students_list'),
    path('student/<int:student_id>/', views.student_detail, name='student_detail'),
    path('import-csv/', views.import_csv, name='import_csv'),
    path('report/', views.student_report, name='student_report'),
]
