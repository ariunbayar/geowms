import base64 
import xml.etree.ElementTree as ET
from django.conf import settings
from backend.payment.models import Payment

class PaymentMethodMB():

    def __init__(self, data, payment_id):
        self.data = data
        self.payment_id = payment_id
        self.OrderID = None
        self.root = None

    def paymentSuccess(self):
        status = self.root.find('TransactionType').text
        if status == "CONFIRM":
            Payment.objects.filter(id=self.payment_id).update(is_success=True, error_code='0', error_message='Гүйлгээ амжилттай.', bank_unique_number=self.OrderID)
            return True


    def paymentConfirm(self):
        Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='32', error_message='Эх гүйлгээ олдоогүй.', bank_unique_number=self.OrderID)
        return False


    def paymentMessageConfirm(self):
        Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='34', error_message='Мессежний бүтэц алдаатай эсвэл шалгах явцад алдаа гарсан.', bank_unique_number=self.OrderID)
        return False


    def paymentCancelled(self):
        Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='CANCELLED', error_message='Алхам 2 дээр хэрэглэгч CANCEL товчийг дарсан.', bank_unique_number=self.OrderID)
        return False


    def paymentNotenRolled(self):
        Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='53', error_message='Хэрэглэгчийн карт интернет худалдаа хийхээр бүртгүүлээгүй.', bank_unique_number=self.OrderID)
        return False


    def paymentDeclined(self):
        status = self.root.find('ResponseCode').text
        if status == "16" or status == "15":
            Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='15', error_message='Хэрэглэгчийн картыг шалгах явц амжилтгүй болсон эсвэл интернет пин буруу.', bank_unique_number=self.OrderID)
            return False
        if status == "7":
            Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='7', error_message='Эх гүйлгээ олдоогүй /луйврын гүйлгээ байх магадлалтай/.', bank_unique_number=self.OrderID)
            return False
        if status == "2":
            Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='2', error_message='Гүйлгээ гаргах боломжгүй холболт салсан.', bank_unique_number=self.OrderID)
            return False


    def paymentFailed(self):
        status = self.root.find('ResponseCode').text
        if status == "4":
            Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='4', error_message='Гүйлгээний мессежийг задлах явцад алдаа гарсан /Гүйлгээ гарсан. CONFIRM хүсэлтээр шалгах/')
            return False

    def paymentFailedGeo(self):
        Payment.objects.filter(id=self.payment_id).update(is_success=False, error_code='Geo', error_message='Гео сервэрийн алдаа.')
        return False





    def statusCheck(self):
        check = False
        for i in self.root:
            if i.tag == 'Status':
                check = True
        return check

    def paymentMethodMB(self):
        xmlmsgBase64 = base64.b64decode(self.data)
        xmlmsg = xmlmsgBase64.decode()
        self.root = ET.fromstring(xmlmsg)
        check = self.statusCheck()
        self.OrderID = self.root.find('OrderID').text

        if check:
            status = self.root.find('Status').text

            if status == '0':
                # print("Гүйлгээ амжилттай.")
                message = self.paymentSuccess()
                return message

            elif status == '32': 
                # print("Эх гүйлгээ олдоогүй тохиолдолд")
                message = self.paymentConfirm()
                return message

            elif status == '34':
                message = self.paymentMessageConfirm()
                # print("Мессежний бүтэц алдаатай эсвэл шалгах явцад алдаа гарсан тохиолдолд")
                return message
            else:
                message = self.paymentFailedGeo()
                return message

        else:
            orderStatus = self.root.find('OrderStatus').text

            if orderStatus == 'CANCELLED':
                message = self.paymentCancelled()
                # print("Алхам 2 дээр хэрэглэгч CANCEL товчийг дарсан тохиолдолд")
                return message

            elif orderStatus == 'NOTENROLLED':
                message = self.paymentNotenRolled()
                # print("Хэрэглэгчийн карт интернет худалдаа хийхээр бүртгүүлээгүй тохиолдолд")

                return message
            elif orderStatus == 'DECLINED':
                message = self.paymentDeclined()
                # print("Хэрэглэгчийн картыг шалгах явц амжилтгүй болсон эсвэл интернет пин буруу тохиолдолд")
                # print("Эх гүйлгээ олдоогүй тохиолдолд /луйврын гүйлгээ байх магадлалтай/ /гүйлгээ гараагүй/")
                # print("Гүйлгээний дүн эх гүйлгээний хүсэлтийн дүнтэй таарахгүй тохиолдолд /луйврын гүйлгээбайх магадлалтай/ /гүйлгээ гараагүй/")
                # print("Гүйлгээ гаргах боломжгүй холболт салсан /гүйлгээ гараагүй/")
                return message
            elif orderStatus == 'FAILED':
                # print("Гүйлгээний мессежийг задлах явцад алдаа гарсан /Гүйлгээ гарсан. CONFIRM хүсэлтээршалгах/")
                message = self.paymentFailed()
                return message
            else:
                message = self.paymentFailedGeo()
                return message