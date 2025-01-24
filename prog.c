#include <stdio.h>

int main()
{
    int num = 50;
    num = 100;
    int num2 = 500;
    char name = 'v'; // double quotes in c is for strings
    float f1 = 35E9;
    int width = 10, length = 20, area;
    printf("my float number with a little bit of precision is %f\n", f1, sizeof(f1));
    printf("my decimal presicion has a little bit more precision %.20lf\n", f1);
    printf("the area of the rectangle is \"%d\" \n", width * length);
    printf("%c\n", sizeof(name));
    printf("%d\n", num + num2);
    printf("%d\n", sizeof(num));
    printf("Hello vintage\n");
    printf("i am learning c programming\n");
    printf("to become a sofware engineer\n");
    printf("i am testing new lines\n on a do it myself quest\n");
    printf("vintage is my nickname \"means something classic\"\n ");
    printf("my first variable is an integer %d, and my second variable is a character \"%c\" ", num, name);

    // int product = i * x

    int i, x;

    for (i = 0; i < 12; i++)
    {
        printf("%d ", i);
        for (x = 0; x < 12; x++)
        {
            printf("%d ", x);
        };
        printf("%d\n", i * x);
    };
}