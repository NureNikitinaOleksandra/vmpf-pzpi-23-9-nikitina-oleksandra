# 4. Напишіть функцію, яка приймає рядок та повертає його обернений варіант. Наприклад, "hello" повинно повернути "olleh".

def reverse_string(string):
    reversed_string = ""
    i = len(string) - 1

    while i >= 0:
        reversed_string += string[i]
        i -= 1

    return reversed_string


text = input("Введіть щось: ")
result = reverse_string(text)


print(result)