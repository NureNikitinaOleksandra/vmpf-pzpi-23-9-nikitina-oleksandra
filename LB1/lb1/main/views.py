import csv
import json
from django.shortcuts import get_object_or_404, redirect, render
from django.db.models import Avg
from .models import Group, Student

def students_list(request):
    students = Student.objects.all()
    return render(request, 'main/students_list.html', {'students': students})

def student_detail(request, student_id):
    student = get_object_or_404(Student, id=student_id)
    return render(request, 'main/detail.html', {'student': student})

def import_csv(request):
    if request.method == 'POST':
        file = request.FILES.get('csv_file')
        
        if not file:
            return render(request, 'main/import.html', {'error': 'Будь ласка, оберіть файл'})
        
        if not file.name.endswith('.csv'):
            return render(request, 'main/import.html', {'error': 'Це не CSV файл!'})

        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.reader(decoded_file)
        
        next(reader, None)
        
        for row in reader:
            if len(row) >= 2:
                full_name = row[0].strip()
                group_name = row[1].strip()
                phone = row[2].strip() if len(row) > 2 else ''
                email = row[3].strip() if len(row) > 3 else ''
                address = row[4].strip() if len(row) > 4 else ''
                
                if full_name and group_name:
                    group, _ = Group.objects.get_or_create(name=group_name)
                    
                    Student.objects.update_or_create(
                        full_name=full_name,
                        group=group,
                        defaults={
                            'phone': phone,
                            'email': email,
                            'address': address
                        }
                    )
            
        return redirect('students_list')

    return render(request, 'main/import.html')

def student_report(request):
    students = Student.objects.annotate(avg_grade=Avg('grade__value'))
    
    names = []
    averages = []
    
    for s in students:
        names.append(s.full_name)
        avg = round(s.avg_grade, 1) if s.avg_grade is not None else None
        averages.append(avg)

    context = {
        'students': students,
        'names': json.dumps(names),
        'averages': json.dumps(averages),
    }
    
    return render(request, 'main/report.html', context)