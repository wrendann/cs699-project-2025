## Instructions to set up

All commands are run inside backend folder.

Create a virtual env:

`python -m venv venv`

Activate it:

`source venv/bin/activate`

Install all the required dependencies in the env:

`pip install -r requirements.txt`

Create and run the database migrations:

```Bash
python manage.py makemigrations
python manage.py migrate
```

To start the server:

```
python manage.py runserver
```

The django backend should now be running at http://127.0.0.1:8000/ or 
http://localhost:8000/

Try going to http://127.0.0.1:8000/TFapp/hello/

Go to http://localhost:8000/admin to access the django admin panel

## To create a super user for managaing db:

#### Run the createsuperuser command: Execute the following command:

```
    python manage.py createsuperuser
```
Enter superuser details: The system will prompt you for the following information:
* Username: Choose a username for your superuser.
* Email address: Provide an email address (optional, can be left blank).
* Password: Enter a secure password and confirm it when prompted.