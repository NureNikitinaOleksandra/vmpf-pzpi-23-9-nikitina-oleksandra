# 4. Реалізуйте програму, яка визначає, чи є слово паліндромом (читається однаково з обох боків).

def reverse_string(string):
    reversed_string = ""
    i = len(string) - 1

    while i >= 0:
        reversed_string += string[i]
        i -= 1

    return reversed_string


def is_palindrome(word):
    reversed_word = reverse_string(word)
    return word.lower() == reversed_word.lower()


text = input("Введіть щось: ")

if is_palindrome(text):
    print(f"Слово {text} є паліндромом")
else:
    print(f"Слово {text} не є паліндромом")
