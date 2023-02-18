# importing all require packages
from blog import app, db


# Checks whether the script is being run as the main program
if __name__ == '__main__':
    # This context is used to provide access to the app's resources within the code block
    with app.app_context():
        # Creates all tables defined in the app's database model
        db.create_all()
        # Flask app running in debug mode
    app.run(debug=True)


# The application context is a container for information related to a specific instance of the app, such as configuration settings and database connections.