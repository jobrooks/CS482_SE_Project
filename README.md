# CS482_SE_Project
Software Engineering project repository


User Stories:
https://docs.google.com/spreadsheets/d/15sxz_4_R4UFcytbMDAJyQcUcr8J1UUZUE-72tKluo9A/edit?usp=sharing

UI & Design:
https://docs.google.com/document/d/1j9YCYw4UdCkEt1P1eJxvOVHsuvEKYTaoDNTYSccI3gA/edit?usp=sharing


# Current Testing Coverage Report:
### last update 11/12/23 @6:00pm
```PS C:\Users\Sajiv\local_repos\CS482_SE_Project\django_react_starter\backend> coverage report
Name                                  Stmts   Miss Branch BrPart  Cover
-----------------------------------------------------------------------
backend\__init__.py                       0      0      0      0   100%
backend\settings.py                      25      0      0      0   100%
backend\urls.py                           4      0      0      0   100%
backend\views.py                         14      6      2      0    50%
friend\__init__.py                        0      0      0      0   100%
friend\admin.py                          17      0      0      0   100%
friend\apps.py                            6      0      0      0   100%
friend\migrations\0001_initial.py         5      0      0      0   100%
friend\migrations\0002_initial.py         7      0      0      0   100%
friend\migrations\__init__.py             0      0      0      0   100%
friend\models.py                         43      2      8      4    88%
friend\serializers.py                    10      0      0      0   100%
friend\signals.py                         8      0      2      0   100%
friend\tests.py                          96      6      0      0    94%
friend\urls.py                            3      0      0      0   100%
friend\views.py                          99     31     26      8    62%
game\admin.py                             1      0      0      0   100%
game\apps.py                              4      0      0      0   100%
game\migrations\0001_initial.py           6      0      0      0   100%
game\migrations\__init__.py               0      0      0      0   100%
game\models.py                          107     60     24      0    36%
game\serializers.py                      32      0      0      0   100%
game\urls.py                              4      0      0      0   100%
game\views.py                           251    185     34      0    23%
manage.py                                12      2      2      1    79%
user_api\__init__.py                      0      0      0      0   100%
user_api\admin.py                         3      0      0      0   100%
user_api\apps.py                          4      0      0      0   100%
user_api\migrations\0001_initial.py       8      0      0      0   100%
user_api\migrations\__init__.py           0      0      0      0   100%
user_api\models.py                       15      0      0      0   100%
user_api\serializers.py                  13      0      0      0   100%
user_api\tests.py                        68      0      0      0   100%
user_api\urls.py                          3      0      0      0   100%
user_api\views.py                        20      1      4      1    92%
user_login\__init__.py                    0      0      0      0   100%
user_login\admin.py                       1      0      0      0   100%
user_login\apps.py                        4      0      0      0   100%
user_login\migrations\__init__.py         0      0      0      0   100%
user_login\models.py                      1      0      0      0   100%
user_login\tests.py                      22      0      0      0   100%
user_login\urls.py                        3      0      0      0   100%
user_login\views.py                      27      3      2      0    90%
user_profile\__init__.py                  0      0      0      0   100%
user_profile\admin.py                     1      0      0      0   100%
user_profile\apps.py                      4      0      0      0   100%
user_profile\migrations\__init__.py       0      0      0      0   100%
user_profile\models.py                    1      0      0      0   100%
user_profile\tests.py                    22      0      2      1    96%
user_profile\urls.py                      3      0      0      0   100%
user_profile\views.py                    62     31     10      1    44%
-----------------------------------------------------------------------
TOTAL                                  1039    327    116     16    64%
```
