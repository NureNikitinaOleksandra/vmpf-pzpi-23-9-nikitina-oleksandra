# 4. Розробіть алгоритм сортування масиву чисел методом швидкого сортування (QuickSort) та виведіть відсортований масив.

import random

def quick_sort(a):
    if len(a) <= 1:
        return a
    
    x = a[random.randint(0, (len(a) - 1))]
    
    low = []
    equal = []
    high = []

    for y in a:
        if y < x:
            low.append(y)
        elif y == x:
            equal.append(y)
        else:
            high.append(y)

        a = quick_sort(low) + equal + quick_sort(high)

    return a


array = [2, 4, 12, 7, 23, 5, 2, 89]

sorted_array = quick_sort(array)

print(array)
print(sorted_array)
