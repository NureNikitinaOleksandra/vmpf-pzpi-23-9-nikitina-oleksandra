# 4. Напишіть функцію, яка приймає три параметри (a, b, c) і виводить на екран найменше з них.

def reading():
    parameters = input("Введіть три числа через пробіл і натисніть Enter: ")
    parameters = parameters.split()
    return parameters


def checking(parameters):
    if len(parameters) != 3:
        print("Потрібно ввести рівно три значення.")
        return False

    for parameter in parameters:
        try:
            float(parameter)
        except ValueError:
            print(f"Введене значення {parameter} не є числом.")
            return False

    return True


def find_min(a, b, c):
    if a < b:
        if a < c:
            return a
        else:
            return c
    else:
        if b < c:
            return b
        else:
            return c


def main():
    while True:
        parameters = reading()

        if checking(parameters):
            a, b, c = float(parameters[0]), float(parameters[1]), float(parameters[2])

            result = find_min(a, b, c)

            print("Найменше число:", result)
            break


if __name__ == "__main__":
    main()
