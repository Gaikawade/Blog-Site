from blog import app, db

# Checks whether the script is being run as the main program
# This context is used to provide access to the app's resources within the code block
# Creates all tables defined in the app's database model
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


# The application context is a container for information related to a specific instance of the app, such as configuration settings and database connections.