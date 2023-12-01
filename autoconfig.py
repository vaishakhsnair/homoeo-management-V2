import os
import shutil

print("This program will do all the pre-configuration for you.")


if os.path.isdir("databasepage"):
    if os.path.isdir("databasepage/build"):
        print("build folder already exists")
    else:

        os.chdir("databasepage")
        os.system("npm install")
        os.system("npm run build")
        os.chdir("build")
        os.rename("index.html", "database.html")
        os.chdir("../..")
        print("build folder created")

    shutil.copyfile("databasepage/build/database.html", "templates/database.html")
    print("database.html copied")
    jsfiles = os.listdir("databasepage/build/static/js")
    for file in jsfiles:
        shutil.copyfile("databasepage/build/static/js/" + file, "static/js/" + file)
    print("js files copied")
    cssfiles = os.listdir("databasepage/build/static/css")
    for file in cssfiles:
        shutil.copyfile("databasepage/build/static/css/" + file, "static/css/" + file)
    print("css files copied")
    print("static files copied")
