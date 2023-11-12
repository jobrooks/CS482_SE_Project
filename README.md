# CS482_SE_Project
Software Engineering project repository


User Stories:
https://docs.google.com/spreadsheets/d/15sxz_4_R4UFcytbMDAJyQcUcr8J1UUZUE-72tKluo9A/edit?usp=sharing

UI & Design:
https://docs.google.com/document/d/1j9YCYw4UdCkEt1P1eJxvOVHsuvEKYTaoDNTYSccI3gA/edit?usp=sharing


# Current Testing Coverage Report:
### last update 11/12/23 @6:00pm
```PS C:\Users\Sajiv\local_repos\CS482_SE_Project\django_react_starter\backend> coverage report
Name                                  Stmts   Miss  Cover
---------------------------------------------------------
backend\__init__.py                       0      0   100%
backend\settings.py                      22      0   100%
backend\urls.py                           4      0   100%
backend\views.py                          9      4    56%
game\admin.py                             1      0   100%
game\apps.py                              4      0   100%
game\migrations\0001_initial.py           5      0   100%
game\migrations\__init__.py               0      0   100%
game\models.py                           44     18    59%
game\serializers.py                      18      0   100%
game\urls.py                              4      0   100%
game\views.py                            45     33    27%
manage.py                                12      2    83%
user_api\__init__.py                      0      0   100%
user_api\admin.py                         1      0   100%
user_api\apps.py                          4      0   100%
user_api\migrations\__init__.py           0      0   100%
user_api\models.py                        1      0   100%
user_api\serializers.py                  13      0   100%
user_api\tests.py                        68      0   100%
user_api\urls.py                          3      0   100%
user_api\views.py                        20      1    95%
user_login\__init__.py                    0      0   100%
user_login\admin.py                       1      0   100%
user_login\apps.py                        4      0   100%
user_login\migrations\__init__.py         0      0   100%
user_login\models.py                      1      0   100%
user_login\tests.py                      22      0   100%
user_login\urls.py                        3      0   100%
user_login\views.py                      20      1    95%
user_profile\__init__.py                  0      0   100%
user_profile\admin.py                     1      0   100%
user_profile\apps.py                      4      0   100%
user_profile\migrations\__init__.py       0      0   100%
user_profile\models.py                    1      0   100%
user_profile\tests.py                     1      0   100%
user_profile\urls.py                      3      0   100%
user_profile\views.py                     5      2    60%
---------------------------------------------------------
TOTAL                                   344     61    82%
```