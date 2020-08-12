from xml.etree.ElementTree import Element, SubElement, tostring
from Crypto.Cipher import DES3, PKCS1_v1_5
import binascii
import datetime
from Crypto.PublicKey import RSA
from django.conf import settings


def objectToXmlAccount(amount, description):
    Bank = settings.PAYMENT['BANK']
    AccountId = settings.PAYMENT['ACCOUNT_ID']
    AccountName = settings.PAYMENT['ACCOUNT_NAME']
    Description = description
    root = Element('Account')
    BankXml = SubElement(root, 'Bank')
    BankXml = Bank
    AccountIdXml = SubElement(root, 'AccountId')
    AccountIdXml = AccountId
    AccountNameXml = SubElement(root, 'AccountName')
    AccountNameXml.text = AccountName
    DescriptionXml = SubElement(root, 'Description')
    DescriptionXml.text = Description
    AmountXml = SubElement(root, 'Amount')
    AmountXml = amount
    return root


def objectToXmlAccounts(data):
    roots = Element('Accounts')
    roots.extend(data)
    return roots


def PaymentVerifyRequestMB(price, encAccounts, encKey):
    generated_on = str(datetime.datetime.now())
    root = Element('Request', {'MsgTime': generated_on})
    OrderID = SubElement(root, 'Bank')
    OrderID = 1405085651
    MerchantID = SubElement(root, 'MerchantID')
    MerchantID.text = "MERCH"
    TransactionType = SubElement(root, 'TransactionType')
    TransactionType.text = "PURCHASE"
    Amount = SubElement(root, 'Amount')
    Amount = price
    Currency = SubElement(root, 'Currency')
    Currency = 496
    TransactionDateTime = SubElement(root, 'TransactionDateTime')
    TransactionDateTime.text = generated_on
    EncAccounts = SubElement(root, 'EncAccounts')
    EncAccounts.text = encAccounts
    EncKey = SubElement(root, 'EncKey')
    EncKey.text = encKey
    Description = SubElement(root, 'Description')
    Description.text = "Guilgeenii utga"
    ApproveURL = SubElement(root, 'ApproveURL')
    ApproveURL.text = "localhost:8000/api"
    DeclineURL = SubElement(root, 'DeclineURL')
    DeclineURL.text = "localhost:8000/api"
    CancelURL = SubElement(root, 'CancelURL')
    CancelURL.text = "localhost:8000/api"
    return root


def bytesToHex(array):
    return str(binascii.hexlify(array))


def encrypts(data):
    dataString = tostring(data, encoding='utf-8')
    key = settings.PAYMENT['DES3_ENCRYPTION_KEY']
    datas = bytearray(dataString)
    cipher = DES3.new(key, DES3.MODE_CFB)
    msg = cipher.encrypt(datas)
    return msg


def signKey(data):
    pemLink = settings.PAYMENT['SIGN_KEY_LOCATION']
    f = open(pemLink, 'rb')
    key = RSA.importKey(f.read())
    cipher = PKCS1_v1_5.new(key)
    encrypted_message = cipher.encrypt(data.encode())
    return encrypted_message


def xmlConvert(price, description):
    # Account xml
    account = objectToXmlAccount(price, description)
    # Accounts xml
    accounts = objectToXmlAccounts(account)
    #encrypt accounts and convert to hex
    encryptedAccounts = encrypts(accounts)
    encAccounts = bytesToHex(encryptedAccounts)
    #encrypt Desede key of payment request and convert to hex

    # encryptedKey = signKey(encAccounts)
    # encKey = bytesToHex(encryptedKey)
    encKey = encAccounts
    #create request xml
    finalRequest = PaymentVerifyRequestMB(price, encAccounts, encKey)
    # for i in finalRequest:
    #     print(tostring(i))
    
    return finalRequest