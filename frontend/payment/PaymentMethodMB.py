import base64 
import xml.etree.ElementTree as ET
from django.conf import settings
from backend.payment.models import Payment

def paymentSuccess(root, payment_id):
    status = root.find('TransactionType').text
    if status == "CONFIRM":
        OrderID = root.find('OrderID').text
        Payment.objects.filter(id=payment_id).update(is_success=True, error_code='0', error_message='Гүйлгээ амжилттай.', bank_unique_number=OrderID)
        return True


def paymentConfirm(root, payment_id):
    OrderID = root.find('OrderID').text
    Payment.objects.filter(id=payment_id).update(is_success=False, error_code='32', error_message='Эх гүйлгээ олдоогүй.', bank_unique_number=OrderID)
    return False


def paymentMessageConfirm(root, payment_id):
    OrderID = root.find('OrderID').text
    Payment.objects.filter(id=payment_id).update(is_success=False, error_code='34', error_message='Мессежний бүтэц алдаатай эсвэл шалгах явцад алдаа гарсан.', bank_unique_number=OrderID)
    return False


def paymentCancelled(root, payment_id):
    OrderID = root.find('OrderID').text
    Payment.objects.filter(id=payment_id).update(is_success=False, error_code='CANCELLED', error_message='Алхам 2 дээр хэрэглэгч CANCEL товчийг дарсан.', bank_unique_number=OrderID)
    return False


def paymentNotenRolled(root, payment_id):
    OrderID = root.find('OrderID').text
    Payment.objects.filter(id=payment_id).update(is_success=False, error_code='53', error_message='Хэрэглэгчийн карт интернет худалдаа хийхээр бүртгүүлээгүй.', bank_unique_number=OrderID)
    return False


def paymentDeclined(root, payment_id):
    status = root.find('ResponseCode').text
    if status == "16" or status == "15":
        OrderID = root.find('OrderID').text
        Payment.objects.filter(id=payment_id).update(is_success=False, error_code='15', error_message='Хэрэглэгчийн картыг шалгах явц амжилтгүй болсон эсвэл интернет пин буруу.', bank_unique_number=OrderID)
        return False
    if status == "7":
        OrderID = root.find('OrderID').text
        Payment.objects.filter(id=payment_id).update(is_success=False, error_code='7', error_message='Эх гүйлгээ олдоогүй /луйврын гүйлгээ байх магадлалтай/.', bank_unique_number=OrderID)
        return False
    if status == "2":
        OrderID = root.find('OrderID').text
        Payment.objects.filter(id=payment_id).update(is_success=False, error_code='2', error_message='Гүйлгээ гаргах боломжгүй холболт салсан.', bank_unique_number=OrderID)
        return False


def paymentFailed(root, payment_id):
    status = root.find('ResponseCode').text
    if status == "4":
        Payment.objects.filter(id=payment_id).update(is_success=False, error_code='4', error_message='Гүйлгээний мессежийг задлах явцад алдаа гарсан /Гүйлгээ гарсан. CONFIRM хүсэлтээр шалгах/')
        return False


def statusCheck(root):
    check = False
    for i in root:
        if i.tag == 'Status':
            check = True
    return check

def paymentMethodMB(data, payment_id):
    xmlmsgBase64 = base64.b64decode(data)
    xmlmsg = xmlmsgBase64.decode()
    root = ET.fromstring(xmlmsg)
    check = statusCheck(root)
    if check:
        status = root.find('Status').text

        if status == '0':
            # print("Гүйлгээ амжилттай.")
            message = paymentSuccess(root, payment_id)
            return message

        elif status == '32': 
            # print("Эх гүйлгээ олдоогүй тохиолдолд")
            message = paymentConfirm(root, payment_id)
            return message

        elif status == '34':
            message = paymentMessageConfirm(root, payment_id)
            # print("Мессежний бүтэц алдаатай эсвэл шалгах явцад алдаа гарсан тохиолдолд")
            return message
        else:
            print("Бөө мэд")

    else:
        orderStatus = root.find('OrderStatus').text

        if orderStatus == 'CANCELLED':
            message = paymentCancelled(root, payment_id)
            # print("Алхам 2 дээр хэрэглэгч CANCEL товчийг дарсан тохиолдолд")
            return message

        elif orderStatus == 'NOTENROLLED':
            message = paymentNotenRolled(root, payment_id)
            # print("Хэрэглэгчийн карт интернет худалдаа хийхээр бүртгүүлээгүй тохиолдолд")

            return message
        elif orderStatus == 'DECLINED':
            message = paymentDeclined(root, payment_id)
            # print("Хэрэглэгчийн картыг шалгах явц амжилтгүй болсон эсвэл интернет пин буруу тохиолдолд")
            # print("Эх гүйлгээ олдоогүй тохиолдолд /луйврын гүйлгээ байх магадлалтай/ /гүйлгээ гараагүй/")
            # print("Гүйлгээний дүн эх гүйлгээний хүсэлтийн дүнтэй таарахгүй тохиолдолд /луйврын гүйлгээбайх магадлалтай/ /гүйлгээ гараагүй/")
            # print("Гүйлгээ гаргах боломжгүй холболт салсан /гүйлгээ гараагүй/")
            return message
        elif paymentFailed == 'FAILED':
            # print("Гүйлгээний мессежийг задлах явцад алдаа гарсан /Гүйлгээ гарсан. CONFIRM хүсэлтээршалгах/")
            message = paymentDeclined(root, payment_id)
            return message
        else:
            print("Бөө мэд")



# xmlmsg12 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPFJlc3BvbnNlIE1zZ1RpbWU9IjAzLzEwLzIwMTQgMTQ6MDQ6MzkiPgo8TWVyY2hhbnRJRD5FWkFTQUc8L01lcmNoYW50SUQ+CjxPcmRlcklEPjg4ODQyNzQ2MjE8L09yZGVySUQ+CjxUcmFuc2FjdGlvblR5cGU+UFVSQ0hBU0U8L1RyYW5zYWN0aW9uVHlwZT4KPEFtb3VudD4yNTAwMDwvQW1vdW50Pgo8Q3VycmVuY3k+NDk2PC9DdXJyZW5jeT4KPERlc2NyaXB0aW9uPtCW0L7Qu9C+0L7QvdGLINKv0L3RjdC80LvRjdGF0L3QuNC5INKv0L3RjTwvRGVzY3JpcHRpb24+CjxSZXNwb25zZUNvZGU+MjwvUmVzcG9uc2VDb2RlPgo8UmVzcG9uc2VEZXNjcmlwdGlvbj5DT05ORUNUSU9OIFBST0JMRU08L1Jlc3BvbnNlRGVzY3JpcHRpb24+CjxOYW1lPk5hbWU8L05hbWU+CjxCcmFuZD5WSVNBPC9CcmFuZD4KPE9yZGVyU3RhdHVzPkRFQ0xJTkVEPC9PcmRlclN0YXR1cz4KPEFwcHJvdmFsQ29kZT4wPC9BcHByb3ZhbENvZGU+CjxQQU4gLz4KPC9SZXNwb25zZT4='
# xmlmsg = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPFJlc3BvbnNlIE1zZ1RpbWU9IjE1LzA5LzIwMTQgMDk6NTA6NDgiPgo8T3JkZXJJRD4xNDA1MDg1NjUxPC9PcmRlcklEPgo8TWVyY2hhbnRJRD4gTUVSQ0ggPC9NZXJjaGFudElEPgo8VHJhbnNhY3Rpb25UeXBlPkNPTkZJUk08L1RyYW5zYWN0aW9uVHlwZT4KPFN0YXR1cz4wPC9TdGF0dXM+CjxTdGF0dXNEZXNjcmlwdGlvbj5BcHByb3ZlZDwvU3RhdHVzRGVzY3JpcHRpb24+CjwvUmVzcG9uc2U+'
# failed = 'PFJlc3BvbnNlIE1zZ1RpbWU9IjAzLzEwLzIwMTQgMTQ6MDQ6MzkiPgo8TWVyY2hhbnRJRD5FWkFTQUc8L01lcmNoYW50SUQ+CjxPcmRlcklEPjg4ODQyNzQ2MjE8L09yZGVySUQ+CjxUcmFuc2FjdGlvblR5cGU+UFVSQ0hBU0U8L1RyYW5zYWN0aW9uVHlwZT4KPEFtb3VudD4yNTAwMDwvQW1vdW50Pgo8Q3VycmVuY3k+NDk2PC9DdXJyZW5jeT4KPERlc2NyaXB0aW9uPtCW0L7Qu9C+0L7QvdGLINKv0L3RjdC80LvRjdGF0L3QuNC5INKv0L3RjTwvRGVzY3JpcHRpb24+CjxSZXNwb25zZUNvZGU+NDwvUmVzcG9uc2VDb2RlPjxSZXNwb25zZURlc2NyaXB0aW9uPk1FU1NBR0UgRk9STUFUIEVSUk9SPC9SZXNwb25zZURlc2NyaXB0aW9uPgo8TmFtZT5OYW1lPC9OYW1lPgo8QnJhbmQ+VklTQTwvQnJhbmQ+CjxPcmRlclN0YXR1cz5GQUlMRUQ8L09yZGVyU3RhdHVzPgo8QXBwcm92YWxDb2RlPjA8L0FwcHJvdmFsQ29kZT4KPFBBTiAvPgo8L1Jlc3BvbnNlPg=='
#paymentMethodMB(failed)
