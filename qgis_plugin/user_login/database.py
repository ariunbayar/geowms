from PyQt5 import QtGui

from PyQt5.QtWidgets import QApplication, QDialog, QPushButton, QMessageBox
import sys
# import MySQldb as mdb
import psycopg2
import requests
import json

class Window(QDialog):
    def __init__(self):
        super().__init__()

        self.title = "hoho"
        self.top = 200
        self.left = 500
        self.width = 400
        self.height = 300
        self.InitWindow()

    def InitWindow(self):
        self.button = QPushButton('DB Connenction ', self)
        self.button.setGeometry(100,100,200,50)
        self.button.clicked.connect(self.DBConnection)

        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)
        self.show()


    def DBConnection(self):
        try:
            connection = psycopg2.connect(user="postgres",
                                            password="Aguero16",
                                            host="127.0.0.1",
                                            port="5432",
                                            database="geo4")
            cursor = connection.cursor()
            d_id = 'geo'
            email = 'geo'
            cursor.execute(''' SELECT * FROM geoportal_app_user WHERE username= %s and password= %s ''', [email, d_id])
            mobile_records = cursor.fetchall()
            hoho=[]
            if mobile_records:
                for i in mobile_records:
                    hoho.append({
                        'id':i[0],
                        'username':i[4],
                        'email':i[7],
                        'firstName':i[5],
                        'lastName':i[6],
                        'is_sso':i[13],
                        'is_superuser':i[3]

                    })
                
                print("hoho", hoho)
                requests.post('https://ensdmv0v7mkse.x.pipedream.net', data={'user_info': json.dumps(hoho)})
                QMessageBox.about(self,'Connection',  'amjiltai newtersen')  
                self.hide()
            else:
                QMessageBox.about(self,'Connection',  'holbolt amjiltgvi bolloo')  
        except (Exception, psycopg2.Error) as error :
            QMessageBox.about(self, 'Connection', 'aldaa garsan')  
            print ("Error while fetching data from PostgreSQL", error)



App = QApplication(sys.argv)
window = Window()
sys.exit(App.exec())        